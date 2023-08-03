const { Schema, model } = require('mongoose')

const projectSchema = new Schema(
    {
        owner: {type: Schema.Types.ObjectId, ref: 'User'},
        title: String,
        link: String,
        image: String
    },
    {
        timeseries: true
    }
)

module.exports = model('Project', projectSchema)