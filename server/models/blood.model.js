import mongoose from 'mongoose'

const BloodSchema = new mongoose.Schema({
    high: {
        type: Number,
        required: 'Blood pressure high value is required'
    },
    low: {
        type: Number,
        required: 'Blood pressure low value is required'
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

export default mongoose.model('Blood', BloodSchema)