import mongoose from 'mongoose'

const PrescriptionSchema = new mongoose.Schema({
    drugs: {
        type: [Map],
        required: 'Prescription info is required'
    },
    created: {
        type: Date,
        default: Date.now
    },
    name: {
        type: String,
        required: 'Prescription name is required'
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