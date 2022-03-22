import Oxy from '../models/oxy.model'
import errorHandler from '../helpers/dbErrorHandler'

const create = async (req, res) => {
    const { value, img_path } = req.body
    const oxy = new Oxy(
        {
            value,
            img_path,
            user: req.profile._id
        }
    )
    try {
        await oxy.save()
        return res.status(200).json({
            message: "Save new oxygen value successfully!"
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
        let oxys = await Oxy.find().select('value img_path created')
        res.json(oxys)
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