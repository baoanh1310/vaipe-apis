import mongoose from 'mongoose'

const BloodSchema = new mongoose.Schema({
    value: {
        type: Number,
        required: 'Blood pressure is required'
    },
    created: {
        type: Date,
        default: Date.now
    },
    img_path: {
        type: String
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }
})

export default mongoose.model('Blood', BloodSchema)