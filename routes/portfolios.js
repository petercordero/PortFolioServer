var express = require('express');
var router = express.Router();
var mongoose = require('mongoose')

const Portfolio = require('../models/Portfolio');
const User = require('../models/User');
const isAuthenticated = require('../middleware/isAuthenticated')
const isPortfolioOwner = require('../middleware/isPortfolioOwner')

router.get('/', (req, res, next) => {
  Portfolio.find()
  .populate(
    "owner"
)
.populate({
    path: 'projects',
    populate: { path: 'owner'}
})
  .then((allPortfolios) => {
    res.json(allPortfolios)
  })
  .catch((err) => {
    console.log(err)
    next(err)
  })

});

router.post('/new-portfolio', isAuthenticated, (req, res, next) => {
    const { owner, title, image } = req.body
    Portfolio.create(
        { owner: req.user._id,
            title,
            image
        })
        .then((newPortfolio) => {
            User.findByIdAndUpdate(req.user._id, {$push: { listedPortfolio: newPortfolio._id }})
            .then(() => res.json(newPortfolio))  
        })
        .catch((err) => {
            console.log(err)
            next(err)
        })
    
})

router.get('/portfolio/:portfolioId', (req, res, next) => {

    const { portfolioId } = req.params

    Portfolio.findById(portfolioId)
        .populate(
            "owner"
        )
        .populate({
            path: 'projects',
            populate: { path: 'owner'}
        })
        .then((foundPortfolio) => {
            res.json(foundPortfolio)
        })
        .catch((err) => {
            console.log(err)
            next(err)
        })

})

router.post('/portfolio/edit/:portfolioId', isAuthenticated, isPortfolioOwner, (req, res, next) => {
    const { portfolioId } = req.params
    console.log(req.body)
    const { title, image } = req.body
    Portfolio.findByIdAndUpdate(
        portfolioId,
        {
           title: title,
           image: image
        },
        { new: true}
    )
    .then((updatedPortfolio) => {
        res.json(updatedPortfolio)
    })
})

router.delete('/delete-portfolio/:portfolioId', (req, res, next) => {
    const { portfolioId } = req.params;
    
    if (!mongoose.Types.ObjectId.isValid(portfolioId)) {
      res.status(400).json({ message: 'Specified id is not valid' });
      return;
    }
  
    Portfolio.findByIdAndDelete(portfolioId)
      .then(() => res.json({ message: `Portfolio with ${portfolioId} is removed successfully.` }))
      .catch(error => res.json(error));
  });

module.exports = router;