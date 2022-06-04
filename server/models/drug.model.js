import mongoose from 'mongoose'

const DrugSchema = new mongoose.Schema({
    created: {
        type: Date,
        default: Date.now
    },
    info: {
        type: Map,
        required: 'Drug info is required'
    },
    isStandard: {
        type: Boolean,
        required: 'You must specified this drug is standard or not',
        default: false
    },
    img_path: {
        type: String,
    }
})

export default mongoose.model('Drug', DrugSchema)