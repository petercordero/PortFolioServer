var express = require('express');
var router = express.Router();

const User = require('../models/User');
const Portfolio = require('../models/Portfolio')
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

  const { email, password, fullName, location } = req.body

  User.findByIdAndUpdate(
    userId,
    {
      email, 
      password, 
      fullName,  
      location
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

router.get('/profile/:userId', isAuthenticated,  (req, res, next) => {
  const {userId} = req.params;
  User.findById(userId)
    .populate({
      path: 'listedPortfolio',
      populate: {
        path: 'owner',
        model: 'User'
      }
    })
    .then((foundUserInfo) => {
      console.log("Found user:", foundUserInfo)
      res.json(foundUserInfo)
    })
    .catch((err) => {
      console.log(err)
      next(err)
    })
});


// router.get("/portfolio/profile/:userId", (req, res, next) => {
//   Portfolio.find({
//     owner: req.params.userId
//   })
//     .populate('owner')
//     .then((foundPortfolios) => {
//       res.json(foundPortfolios)
//     })
//     .catch((err) => {
//       console.log(err)
//       next(err)
//     })
// });

module.exports = router;