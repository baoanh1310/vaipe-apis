import mongoose from 'mongoose'

const ECGSchema = new mongoose.Schema({
    value: {
        type: [Number],
        required: 'ECG values are required'
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

export default mongoose.model('Ecg', ECGSchema)