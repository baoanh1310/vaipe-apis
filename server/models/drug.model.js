import mongoose from 'mongoose'

const DrugSchema = new mongoose.Schema({
    created: {
        type: Date,
        default: Date.now
    },
    drugName: {
        type: String,
        required: 'Drug name is required'
    },
    isStandard: {
        type: Boolean,
        // required: 'You must specified this drug is standard or not',
        default: false
    },
    drugImage: {
        type: String,
    },
    registerCode: {
        type: String,
    },
    drugPropertyNames: {
        type: String,
    },
    drugProperties: {
        type: String,
    },
    category: {
        type: String,
    },
    country: {
        type: String,
    },
    addressFrom: {
        type: String,
    },
    registerAddress: {
        type: String,
    },
    registerCompany: {
        type: String,
    },
    price: {
        type: String,
    },
    expired: {
        type: String,
    },
    standard: {
        type: String,
    },
    drugType: {
        type: String,
    },
    drugNum: {
        type: String,
    }
})

export default mongoose.model('Drug', DrugSchema)