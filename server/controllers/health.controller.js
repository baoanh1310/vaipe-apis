import Oxy from '../models/oxy.model'
import Weights from '../models/weight.model'
import Blood from '../models/blood.model'
import Temp from '../models/temperature.model'

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
        for (let val of bloods) {
            blood_result.push({"created": val["created"], "value": val["value"]})
        }

        let temps = await Temp.find({ user: req.auth.userId })
        temps = [...temps]
        let temp_result = []
        for (let val of temps) {
            temp_result.push({"created": val["created"], "value": val["value"]})
        }

        let result = {
            "weight": weight_result,
            "spO2": oxy_result,
            "temparature": temp_result,
            "blood_pressure": blood_result
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