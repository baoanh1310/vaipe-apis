import Blood from '../models/blood.model'
import HeartRate from '../models/heartRate.model'
import errorHandler from '../helpers/dbErrorHandler'

const create = async (req, res) => {
    const { high, low, heart_rate } = req.body
    // const img_path = req.file.path
    const blood = new Blood(
        {
            high,
            low,
            user: req.auth.userId
        }
    )
    console.log("blood: ", blood)
    try {
        await blood.save()
        if (heart_rate != -1.0) {
            const heartRate = new HeartRate(
                {
                    value: heart_rate,
                    user: req.auth.userId
                }
            )
            try {
                await heartRate.save()
            } catch (err) {
                console.log(err.message)
                return res.status(400).json({
                    error: errorHandler.getErrorMessage(err)
                })
            }
        }
        return res.status(200).json({
            message: "Save new blood and heart rate values successfully!"
        })
    } catch (err) {
        console.log(err.message)
        return res.status(400).json({
            error: errorHandler.getErrorMessage(err)
        })
    }
}

const getStatsBlood = async (req, res) => {
    try {
        let bloods = await Blood.find({ user: req.auth.userId })
        console.log(bloods)
        bloods = [...bloods]
        let result = []
        for (let val of bloods) {
            let high_low_obj = {
                "high": val["high"],
                "low": val["low"]
            }
            result.push({
                "created": val["created"], 
                "value": high_low_obj
            })
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
    getStatsBlood
}