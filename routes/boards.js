const express = require("express");
const router = express.Router();

const ps = require("@prisma/client");
const prisma = new ps.PrismaClient();

const pnum = 5;

function check(req, res) {
    if (req.session.login == null) {
        req.session.back = "/boards";
        res.redirect("/users/login");
        return true;
    } else {
        return false;
    }
}

router.get("/", (req, res, next) => {
    res.redirect("/boards/0");
});

router.get("/:page", (req, res, next) => {
    if (check(req, res)) { return; }
    const pg = +req.params.page;
    prisma.board.findMany({
        skip: pg * pnum,
        take: pnum,
        orderBy: [
            { createAt: "desc" } // 修正: createdAtをcreateAtに変更
        ],
        include: {
            account: true,
        },
    }).then(brds => {
        const data = {
            title: "Boards",
            login: req.session.login,
            content: brds,
            page: pg
        };
        res.render("boards/index", data);
    }).catch(next);
});

router.post("/add", (req, res, next) => {
    if (check(req, res)) { return; }
    prisma.board.create({
        data: {
            accountId: req.session.login.id,
            message: req.body.msg
        }
    }).then(() => {
        res.redirect("/boards");
    }).catch((err) => {
        console.error(err); // エラーをログに出力
        res.redirect("/boards/add");
    });
});

router.get("/home/:user/:id/:page", (req, res, next) => {
    if (check(req, res)) { return; }
    const id = +req.params.id;
    const pg = +req.params.page;
    prisma.board.findMany({
        where: { accountId: id },
        skip: pg * pnum,
        take: pnum,
        orderBy: [
            { createAt: "desc" } // 修正: createdAtをcreateAtに変更
        ],
        include: {
            account: true
        }
    }).then(brds => {
        const data = {
            title: "Boards",
            login: req.session.login,
            accountId: id,
            userName: req.params.user,
            content: brds,
            page: pg
        };
        res.render("boards/home", data);
    }).catch(next);
});

module.exports = router;
