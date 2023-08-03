var express = require('express');
var router = express.Router();

const Project = require('../models/Project');
const User = require('../models/User');
const isAuthenticated = require('../middleware/isAuthenticated')
const isPortfolioOwner = require('../middleware/isPortfolioOwner')

router.post('/add-project/:portfolioId', isAuthenticated, isPortfolioOwner, (req, res, next) => {
    const { owner, title, link, image } = req.body
    Project.create(
        { owner,
            title,
            link,
            image
        })
        .then((newProject) => {
            Portfolio.findByIdAndUpdate(
                req.params.portfolioId,
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