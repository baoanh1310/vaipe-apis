import mongoose from 'mongoose'

const HeartRateSchema = new mongoose.Schema({
    value: {
        type: Number,
        required: 'Heart rate is required'
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

export default mongoose.model('Heart', HeartRateSchema)