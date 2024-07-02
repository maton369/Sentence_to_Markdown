var express = require('express');
var router = express.Router();

const MarkdownIt = require('markdown-it');
const markdown = new MarkdownIt();

const ps = require('@prisma/client');
const prisma = new ps.PrismaClient();

function check(req,res) {
  if (req.session.login == undefined) {
    req.session.back = '/';
    return true;
  } else {
    return false;
  }
}

router.get('/check', function(req, res, next) {
  if (check(req, res)) {
    res.json({result:false});
  } else {
    res.json({result:req.session.login.name});
  }
});

router.get('/all', (req, res, next)=>{
  if (check(req,res)){
    res.json({});
    return;
  }
  prisma.Markdata.findMany({
    where:{accountId: +req.session.login.id},
    orderBy: [
      {createAt: 'desc'}
    ],
  }).then(mds=> {
    res.json(mds);    
  });
})

router.get('/mark/:id', (req, res, next) => {
  if (check(req,res)){
    res.json([]);
    return;
  }
  prisma.Markdata.findMany({
    where: {
      id: +req.params.id,
      accountId: +req.session.login.id
    },
    orderBy: [
      {createAt: 'desc'}
    ],
  })
  .then((models) => {
    const model = models != null ? 
      models[0] != null ? 
        models[0] : null : null;
    res.json(model);
  });
});

router.post('/add', (req, res, next) => {
  if (check(req,res)){
    res.json({});
    return;
  }
  prisma.Markdata.create({
    data: {
      accountId: req.session.login.id,
      title: req.body.title,
      content: req.body.content,
    }
  })
  .then(model => {
     res.json(model);
  });
});

router.post('/mark/edit', (req, res, next) => {
  if (check(req,res)){
    res.json({});
    return;
  }
  prisma.Markdata.update({
    where:{ id: +req.body.id },
    data:{
      title: req.body.title,
      content: req.body.content
    }
  })
  .then(model => {
    res.json(model);
  });
});

router.post('/mark/render', (req, res, next)=>{
  if (check(req,res)){
    res.json({});
    return;
  }
  const source = req.body.source;
  const ren = markdown.render(source);
  const result = {render:ren};
  res.json(result);
})

module.exports = router;