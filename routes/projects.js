var express = require('express');
var router = express.Router();
var mongoose = require('mongoose')

const Project = require('../models/Project');
const Portfolio = require('../models/Portfolio')
const User = require('../models/User');
const isAuthenticated = require('../middleware/isAuthenticated')
const isPortfolioOwner = require('../middleware/isPortfolioOwner')

router.post('/:portfolioId', isAuthenticated, isPortfolioOwner, (req, res, next) => {
    const { title, link, description, image, portfolioId } = req.body
    Project.create(
        {
            owner: req.user._id,
            title,
            link,
            image,
            description,
            portfolio: portfolioId
        })
        .then((newProject) => {
            return Portfolio.findByIdAndUpdate(
                portfolioId,
                {
                    $push: { projects: newProject._id }
                },
                { new: true }
            )
                .populate(
                    "owner"
                )
                .populate({
                    path: 'projects',
                    populate: { path: 'owner' }
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


router.post('/edit/:portfolioId/:projectId', isAuthenticated, isPortfolioOwner, (req, res, next) => {


    const { projectId } = req.params

    console.log("req.params", req.params)
    console.log("req.body", req.body)


    Project.findByIdAndUpdate(
        projectId,

        req.body
        ,
        { new: true }
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
                    $pull: { projects: deletedProject._id }
                },
                { new: true }
            )
                .populate(
                    "owner"
                )
                .populate({
                    path: 'projects',
                    populate: { path: 'owner' }
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

router.delete('/delete-project/:portfolioId/:projectId', (req, res, next) => {
    const { projectId, portfolioId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(projectId)) {
        res.status(400).json({ message: 'Specified id is not valid' });
        return;
    }
    //before sending res.json, findByIdAndUpdate the portfolio using $pull to delete the project from the portfolio

    Project.findByIdAndDelete(projectId)
        .then(() => {
            Portfolio.findByIdAndUpdate(portfolioId, { $pull: { projects: projectId } }, { new: true })
                .then(() =>
                    res.status(200).json({ msg: "deleted bru" })
                )
        })
        .catch(err => {
            console.log(err)
            res.status(500).json(err)
        })

});



module.exports = router;