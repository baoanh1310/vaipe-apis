import Ecg from '../models/ecg.model'
import errorHandler from '../helpers/dbErrorHandler'

const create = async (req, res) => {
    const { value, img_path } = req.body
    let values = JSON.parse(value)
    values = [...values]
    console.log(typeof values)
    console.log(values[0])
    const ecg = new Ecg(
        {
            value: values,
            img_path,
            user: req.profile._id
        }
    )
    try {
        await ecg.save()
        return res.status(200).json({
            message: "Save new ECG values successfully!"
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
        let ecgs = await Ecg.find().select('value img_path created')
        res.json(ecgs)
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