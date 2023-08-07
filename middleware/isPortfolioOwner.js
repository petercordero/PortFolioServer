const Portfolio = require('../models/Portfolio');

const isPortfolioOwner = (req, res, next) => {

    console.log("USER", req.user)

    Portfolio.findById(req.params.portfolioId)
    .then((foundPortfolio) => {
        console.log("found portfolio", foundPortfolio)
        if (req.user._id === foundPortfolio.owner.toString()){
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