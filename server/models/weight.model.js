import mongoose from 'mongoose'

const WeightSchema = new mongoose.Schema({
    value: {
        type: Number,
        required: 'Weight is required'
    },
    created: {
        type: Date,
        default: Date.now
    },
    // img_path: {
    //     type: String
    // },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }
})

export default mongoose.model('Weight', WeightSchema)