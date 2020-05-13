const express = require('express');

const postMethods = require('./postDb')

const router = express.Router();

router.get('/', (req, res) => {

    postMethods.get()
    .then(p => {
      console.log(p)
      res.status(200).json(p)})
    .catch(e => res.status(500).json({ msg: 'whoops!'}))
});

router.get('/:id', validatePostId, (req, res) => {
  postMethods.getById(req.params.id)
  .then(p => res.status(200).json(p))
  .catch(e => res.status(500).json({ msg: 'whoops!'}))
});

router.delete('/:id', validatePostId, (req, res) => {
  postMethods.remove(req.params.id)
  .then(p => res.status(200).json(p))
  .catch(e => res.status(500).json({ msg: 'whoops!'}))
});

router.put('/:id', validatePostId, (req, res) => {
  if (req.body.text) {
    postMethods.update(req.params.id, req.body)
    .then(p => res.status(200).json(p))
    .catch(e => res.status(500).json({ msg: 'whoops!'}))
  } else {
    res.status(400).json({ msg: 'add text'})
  }

});

// custom middleware

async function validatePostId(req, res, next) {
  const { id } = req.params
  if (id) {
    await postMethods.getById(id)
    next()
  } else {
    res.status(400).json({ msg: 'Invalid Id' })
  }
}

module.exports = router;
