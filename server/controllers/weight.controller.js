import Weight from '../models/weight.model'
import errorHandler from '../helpers/dbErrorHandler'

const create = async (req, res) => {
    const { value, img_path } = req.body
    const weight = new Weight(
        {
            value,
            img_path,
            user: req.profile._id
        }
    )
    try {
        await weight.save()
        return res.status(200).json({
            message: "Save new weight successfully!"
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
        let weights = await Weight.find().select('value img_path created')
        res.json(weights)
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