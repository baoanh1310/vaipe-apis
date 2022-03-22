import Prescription from '../models/prescription.model'
import errorHandler from '../helpers/dbErrorHandler'

const create = async (req, res) => {
    const { value, img_path } = req.body
    let values = JSON.parse(value)
    values = [...values]
    console.log(values)
    const prescription = new Prescription(
        {
            value: values,
            img_path,
            user: req.profile._id
        }
    )
    try {
        await prescription.save()
        return res.status(200).json({
            message: "Save new prescription successfully!"
        })
    } catch (err) {
        console.log(err.message)
        return res.status(400).json({
            error: errorHandler.getErrorMessage(err)
        })
    }
}

const list = async (req, res) => {
    try {
        let prescriptions = await Prescription.find().select('value img_path created')
        res.json(prescriptions)
    } catch (err) {
        return res.status(400).json({
            error: errorHandler.getErrorMessage(err)
        })
    }
}

export default {
    create,
    list
}