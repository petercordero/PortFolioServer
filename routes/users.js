var express = require('express');
var router = express.Router();

const User = require('../models/User');
const isAuthenticated = require('../middleware/isAuthenticated');
const isProfileOwner = require('../middleware/isProfileOwner');

router.get('/user-detail/:userId', (req, res, next) => {
    const { userId } = req.params

    User.findById(userId)
    .then((foundUser) => {
      res.json(foundUser)
    })
    .catch((err) => {
      console.log(err)
      next(err)
    })
});

router.post('/user-update/:userId', isAuthenticated, isProfileOwner, (req, res, next) => {
  const { userId } = req.params

  const { email, password, fullName, username } = req.body

  User.findByIdAndUpdate(
    userId,
    {
      email, 
      password, 
      fullName,  
      username
    },
    { new: true }
  )
  .then((updatedUser) => {
    res.json(updatedUser)
  })
  .catch((err) => {
    console.log(err)
    next(err)
  })
})

router.get('/delete/:userId', isAuthenticated, isProfileOwner, (req, res, next) => {

  const { userId } = req.params

    User.findByIdAndDelete(userId)
      .then((deletedUser) => {

        Portfolio.deleteMany({
          owner: deletedUser._id
        })
          .then((deletedPortfolio) => {
            console.log("Deleted portfolio", deletedPortfolio)
            res.json(deletedUser)
          })
          .catch((err) => {
            console.log(err)
            next(err)
          })    
      })
      .catch((err) => {
        console.log(err)
        next(err)
      })
})

module.exports = router;
