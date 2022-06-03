import mongoose from 'mongoose'

const MedicineReceiptSchema = new mongoose.Schema({
    drugs: {
        type: [Map],
        required: 'MedicineReceipt info is required'
    },
    created: {
        type: Date,
        default: Date.now
    },
    name: {
        type: String,
        required: 'MedicineReceipt name is required'
    },
    // img_path: {
    //     type: String
    // },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }
})

export default mongoose.model('MedicineReceipt', MedicineReceiptSchema)