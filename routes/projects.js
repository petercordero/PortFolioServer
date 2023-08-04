var express = require('express');
var router = express.Router();

const Project = require('../models/Project');
const Portfolio = require('../models/Portfolio')
const User = require('../models/User');
const isAuthenticated = require('../middleware/isAuthenticated')
const isPortfolioOwner = require('../middleware/isPortfolioOwner')

router.post('/', isAuthenticated, isPortfolioOwner, (req, res, next) => {
    const { title, link, image, portfolioId } = req.body
    Project.create(
        { owner: req.user._id,
            title,
            link,
            image,
            portfolio: portfolioId
        })
        .then((newProject) => {
            return Portfolio.findByIdAndUpdate(
                portfolioId, 
                {
                    $push: {projects: newProject._id}
                },
                { new: true }
            )
            .populate(
                "owner"
            )
            .populate({
                path: 'projects',
                populate: { path: 'owner'}
            })
            .then((updatedPortfolio) => {
                res.json(updatedPortfolio)
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


router.post('/project-update/:projectId', isAuthenticated, isPortfolioOwner, (req, res, next) => {
    const { projectId } = req.params

    const { title } = req.body
    Project.findByIdAndUpdate(
        projectId,
        {
           title
        },
        { new: true}
    )
    .then((updatedProject) => {
        res.json(updatedProject)
    })
})

router.post('/delete-project/:portfolioId/:projectId', isAuthenticated, isPortfolioOwner, (req, res, next) => {
    const { projectId } = req.params
    Project.findByIdAndDelete(projectId)
    .then((deletedProject) => {
        Portfolio.findByIdAndUpdate(
            req.params.portfolioId,
            {
                $pull: {projects: deletedProject._id}
            },
            { new: true }
        )
        .populate(
            "owner"
        )
        .populate({
            path: 'projects',
            populate: { path: 'owner'}
        })
        .then((updatedPortfolio) => {
            res.json(updatedPortfolio)
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