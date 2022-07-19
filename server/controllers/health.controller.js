import Oxy from '../models/oxy.model'
import Weights from '../models/weight.model'
import Blood from '../models/blood.model'
import Temp from '../models/temperature.model'
import HeartRate from '../models/heartRate.model'

import errorHandler from '../helpers/dbErrorHandler'

const getStats = async (req, res) => {
    try {
        let oxys = await Oxy.find({ user: req.auth.userId })
        oxys = [...oxys]
        let oxy_result = []
        for (let val of oxys) {
            oxy_result.push({"created": val["created"], "value": val["value"]})
        }
        
        let weights = await Weights.find({ user: req.auth.userId })
        weights = [...weights]
        let weight_result = []
        for (let val of weights) {
            weight_result.push({"created": val["created"], "value": val["value"]})
        }

        let bloods = await Blood.find({ user: req.auth.userId })
        bloods = [...bloods]
        let blood_result = []
        // for (let val of bloods) {
        //     blood_result.push({"created": val["created"], "value": val["value"]})
        // }
        for (let val of bloods) {
            let high_low_obj = {
                "high": val["high"],
                "low": val["low"]
            }
            blood_result.push({
                "created": val["created"], 
                "value": high_low_obj
            })
        }

        let temps = await Temp.find({ user: req.auth.userId })
        temps = [...temps]
        let temp_result = []
        for (let val of temps) {
            temp_result.push({"created": val["created"], "value": val["value"]})
        }

        let heart_rates = await HeartRate.find({ user: req.auth.userId })
        heart_rates = [...heart_rates]
        let heart_rate_result = []
        for (let val of heart_rates) {
            heart_rate_result.push({"created": val["created"], "value": val["value"]})
        }

        let result = {
            "weight": weight_result,
            "spO2": oxy_result,
            "temperature": temp_result,
            "blood_pressure": blood_result,
            "heart_rate": heart_rate_result
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
            error: errorHandler.getErrorMessage(err),
            appStatus: -1,
            data: {}
        })
    }
}

export default {
    getStats
}