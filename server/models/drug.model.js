import mongoose from 'mongoose'

const DrugSchema = new mongoose.Schema({
    created: {
        type: Date,
        default: Date.now
    },
    info: {
        type: Map,
        required: 'Drug info is required'
    }
})

export default mongoose.model('Drug', DrugSchema)