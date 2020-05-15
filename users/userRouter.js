const express = require('express');

const userMethods = require('./userDb')

const router = express.Router();

router.post('/', validateUser, (req, res) => {

  userMethods.insert(req.body)
  .then(u => res.status(200).json(u))
  .catch(e => res.status(500).json({ msg: 'Whoops, something went wrong on our side'}))

});

router.get('/', (req, res) => {
  userMethods.get()
    .then(users => res.status(200).json(users))
    .catch(e => res.status(500).json({ msg: 'Whoops, something went wrong on our side'}))
});

router.get('/:id', validateUserId, (req, res) => {
  res.status(200).json(req.user)
});

router.delete('/:id', validateUserId, (req, res) => {
  const { id } =  req.params;

  userMethods.remove(id)
  .then(u => res.status(200).json(u))
  .catch(e => res.status(500).json({ msg: 'Whoops, something went wrong on our side'}))
});

router.put('/:id', validateUserId, validateUser, (req, res) => {
  const { id } =  req.params;

  userMethods.update(id, req.body)
  .then(u => res.status(200).json(u))
  .catch(e => res.status(500).json({ msg: 'Whoops, something went wrong on our side'}))
});

// posts

router.post('/:id/posts', validateUserId, validatePost, (req, res) => {
  req.body.user_id = req.params.id
  userMethods.insert(req.body)
  .then(p => {
    res.status(200).json(p)})
  .catch(e => {
    res.status(500).json({ msg: 'Whoops, something went wrong on our side'})})
});

router.get('/:id/posts', validateUserId, (req, res) => {
  const { id } = req.params
  userMethods.getUserPosts(id)
  .then(p => res.status(200).json(p))
  .catch(e => res.status(500).json({ msg: 'Whoops, something went wrong on our side'}))
});


//custom middleware

function validateUserId(req, res, next) {
  const { id } =  req.params

  if (id) {
    userMethods.getById(id)
      .then(r => { 
        r ? next() : res.status(500).json({ msg: 'Whoops, something went wrong on our side'})
       })
      .catch(e=> res.status(500).json({ msg: 'Whoops, something went wrong on our side'}))
  } else {
    res.status(400).json({ msg: 'Invalid user ID'})
  }
}

function validateUser(req, res, next) {
  const { name } = req.body

  if (name) {
    next()
  } else {
    res.status(400).json({ message: "missing required name field" })
  }
}

function validatePost(req, res, next) {
  
  const { text } = req.body

  if (text) {
    next()
  } else {
    res.status(400).json({ message: "missing required text field" })
  }
}

module.exports = router;
