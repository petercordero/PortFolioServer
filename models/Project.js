const { Schema, model } = require('mongoose')

const projectSchema = new Schema(
    {
        owner: { type: Schema.Types.ObjectId, ref: 'User' },
        title: String,
        link: String,
        description: String,
        image: { type: String, default: 'https://media.istockphoto.com/id/1216251206/vector/no-image-available-icon.jpg?s=170667a&w=0&k=20&c=N-XIIeLlhUpm2ZO2uGls-pcVsZ2FTwTxZepwZe4DuE4=' },
    },
    {
        timeseries: true
    }
)

module.exports = model('Project', projectSchema)