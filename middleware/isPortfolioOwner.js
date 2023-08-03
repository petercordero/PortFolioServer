const Portfolio = require('../models/Portfolio');

const isPortfolioOwner = (req, res, next) => {

    Portfolio.findById(req.params.portfolioId)
    .then((foundPortfolio) => {
        if (req.body.owner === foundPortfolio.owner.toString()){
            next()
        } else{
            res.status(401).json({message: "Validation error"})
        }

    })
    .catch((err) => {
        console.log(err)
        next(err)
    })
}

module.exports = isPortfolioOwner