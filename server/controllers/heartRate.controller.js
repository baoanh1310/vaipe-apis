import HeartRate from '../models/heartRate.model'
import errorHandler from '../helpers/dbErrorHandler'

const create = async (req, res) => {
    const { value } = req.body
    // const img_path = req.file.path
    const heartRate = new HeartRate(
        {
            value,
            // img_path,
            user: req.auth.userId
        }
    )
    console.log("heart rate: ", heartRate)
    try {
        await heartRate.save()
        return res.status(200).json({
            message: "Save new heart rate successfully!"
        })
    } catch (err) {
        console.log(err.message)
        return res.status(400).json({
            error: errorHandler.getErrorMessage(err)
        })
    }
}

const getStatsHeartRate = async (req, res) => {
    try {
        let heartRates = await HeartRate.find({ user: req.auth.userId })
        console.log(heartRates)
        heartRates = [...heartRates]
        let result = []
        for (let val of heartRates) {
            result.push({"created": val["created"], "value": val["value"]})
        }
        let obj = {
            "appStatus": 0,
            "data": {
                "result": result
            }
        }
        res.json(obj)
    } catch (err) {
        return res.status(400).json({
            // error: errorHandler.getErrorMessage(err)
            appStatus: -1,
            data: {}
        })
    }
}

export default {
    create,
    getStatsHeartRate
}