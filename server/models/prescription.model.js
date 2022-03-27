import mongoose from 'mongoose'

const PrescriptionSchema = new mongoose.Schema({
    value: {
        type: [Map],
        required: 'Prescription info is required'
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

export default mongoose.model('Prescription', PrescriptionSchema)