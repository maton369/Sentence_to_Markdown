var express = require('express');
var router = express.Router();

const ps = require('@prisma/client');
const prisma = new ps.PrismaClient();

router.get("/", (req, res, next) => {
  prisma.user.findMany({
    orderBy: [{ name: "asc" }]
  }).then(users => {
    const data = {
      title: "Users/Index",
      content: users
    };
    res.render("users/index", data);
  });
});

router.get("/find", (req, res, next) => {
  const name = req.query.name;
  prisma.user.findMany({
    where: { name: { contains: name } }
  }).then(users => {
    var data = {
      title: "Users/Find",
      content: users
    };
    res.render("users/index", data);
  });
});

router.get("/add", (req, res, next) => {
  const data = {
    title: "Users/Add"
  };
  res.render("users/add", data);
});

router.post("/add", (req, res, next) => {
  prisma.user.create({
    data: {
      name: req.body.name,
      pass: req.body.pass,
      mail: req.body.mail,
      age: +req.body.age
    }
  }).then(() => {
    res.redirect("/users");
  });
});

router.get("/edit/:id", (req, res, next) => {
  const id = req.params.id;
  prisma.user.findUnique(
    { where: { id: +id } }
  ).then(usr => {
    const data = {
      title: "User/Edit",
      user: usr
    };
    res.render("users/edit", data);
  });
});

router.post("/edit", (req, res, next) => {
  const { id, name, pass, mail, age } = req.body;
  prisma.user.update({
    where: { id: +id },
    data: {
      name: name,
      mail: mail,
      pass: pass,
      age: +age
    }
  }).then(() => {
    res.redirect("/users");
  });
});

router.get("/delete/:id", (req, res, next) => {
  const id = req.params.id;
  prisma.user.findUnique(
    { where: { id: +id } }
  ).then(usr => {
    const data = {
      title: "Users/Delete",
      user: usr
    };
    res.render("users/delete", data);
  });
});

router.post("/delete", (req, res, next) => {
  prisma.user.delete({
    where: { id: +req.body.id }
  }).then(() => {
    res.redirect("/users");
  });
});

router.get("/login", (req, res, next) => {
  var data = {
    title: "Users/Login",
    content: "名前とパスワードを入力してください。"
  };
  res.render("users/login", data);
});

router.post("/login", (req, res, next) => {
  prisma.user.findMany({
    where: {
      name: req.body.name,
      pass: req.body.pass
    }
  }).then(usr => {
    if (usr != null && usr[0] != null) {
      req.session.login = usr[0];
      let back = req.session.back;
      if (back == null) {
        back = "/";
      }
      res.redirect(back);
    } else {
      var data = {
        title: "Users/Login",
        content: "名前かパスワードに問題があります。再入力してください。"
      };
      res.render("users/login", data);
    }
  });
});

module.exports = router;
