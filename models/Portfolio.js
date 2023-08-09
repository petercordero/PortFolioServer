const { Schema, model } = require('mongoose')

const portfolioSchema = new Schema(
    {
        owner: { type: Schema.Types.ObjectId, ref: 'User' },
        title: String,
        image: String,
        projects: [{ type: Schema.Types.ObjectId, ref: 'Project' }],
    },
    {
        timeseries: true
    }
)

module.exports = model('Portfolio', portfolioSchema)