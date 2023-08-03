var express = require('express');
var router = express.Router();

const Portfolio = require('../models/Portfolio');
const User = require('../models/User');
const isAuthenticated = require('../middleware/isAuthenticated')
const isPortfolioOwner = require('../middleware/isPortfolioOwner')

router.get('/', (req, res, next) => {
  Portfolio.find()
  .then((allPortfolios) => {
    res.json(allPortfolios)
  })
  .catch((err) => {
    console.log(err)
    next(err)
  })

});

router.post('/new-portfolio', isAuthenticated, (req, res, next) => {
    const { owner, title } = req.body
    Portfolio.create(
        { owner,
            title,
        })
        .then((newPortfolio) => {
            res.json(newPortfolio)
        })
        .catch((err) => {
            console.log(err)
            next(err)
        })
})

router.get('/portfolio-detail/:portfolioId', (req, res, next) => {

    const { sockId } = req.params

    Portfolio.findById(sockId)
        .populate(
            "owner"
        )
        .populate({
            path: 'projects',
            populate: { path: 'owner'}
        })
        .then((foundSock) => {
            res.json(foundSock)
        })
        .catch((err) => {
            console.log(err)
            next(err)
        })

})

router.post('/portfolio-update/:portfolioId', isAuthenticated, isPortfolioOwner, (req, res, next) => {
    const { portfolioId } = req.params

    const { title } = req.body
    Portfolio.findByIdAndUpdate(
        portfolioId,
        {
           title,
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