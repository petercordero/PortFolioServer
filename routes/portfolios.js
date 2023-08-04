var express = require('express');
var router = express.Router();

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
            res.json(newPortfolio)
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

    const { title, image } = req.body
    Portfolio.findByIdAndUpdate(
        portfolioId,
        {
           title,
           image
        },
        { new: true}
    )
    .then((updatedPortfolio) => {
        res.json(updatedPortfolio)
    })
})

router.post('/delete-portfolio/:sockId', isAuthenticated, isPortfolioOwner, (req, res, next) => {
    const { portfolioId } = req.params
    Portfolio.findByIdAndDelete(portfolioId)
    .then((deletedPortfolio) => {
        res.json(deletedPortfolio)
    })
    .catch((err) => {
        console.log(err)
        next(err)
    })
})

module.exports = router;