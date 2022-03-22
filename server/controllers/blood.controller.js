import Blood from '../models/blood.model'
import errorHandler from '../helpers/dbErrorHandler'

const create = async (req, res) => {
    const { value, img_path } = req.body
    const blood = new Blood(
        {
            value,
            img_path,
            user: req.profile._id
        }
    )
    try {
        await blood.save()
        return res.status(200).json({
            message: "Save new blood successfully!"
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
        let bloods = await Blood.find().select('value img_path created')
        res.json(bloods)
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