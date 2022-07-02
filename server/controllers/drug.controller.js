import Drug from '../models/drug.model'
import errorHandler from '../helpers/dbErrorHandler'

const create = async (req, res) => {
    const { drugName, isStandard } = req.body
    const drug = new Drug(
        {
            drugName: drugName,
            isStandard: isStandard
        }
    )
    try {
        await drug.save()
        return res.status(200).json({
            message: "Create new drug successfully!"
        })
    } catch (err) {
        console.log(err.message)
        return res.status(400).json({
            appStatus: -1,
            error: errorHandler.getErrorMessage(err)
        })
    }
}

const getById = async (req, res) => {
    const id = req.params.id
    try {
        let drug = await Drug.findById(id)
        let value = {}
        value['apothecary'] = drug['apothecary']
        value['category'] = drug['category']
        value['country'] = drug['country']
        value['drugName'] = drug['drugName']
        value['drugImage'] = drug['drugImage'] != null ? drug['drugImage'] : ""
        value['drugType'] = drug['drugType']
        value['expired'] = parseInt(drug['expired'].split(' ')[0])
        value['guide'] = drug['guide'] != null ? drug['guide'] : ""
        value['registerCode'] = drug['registerCode']
        value['registerCompany'] = drug['registerCompany']
        value['registerAddress'] = drug['registerAddress']
        value['standard'] = drug['standard']
        value['productCompanyCode'] = drug['productCompanyCode']
        value['warning'] = drug['warning'] != null ? drug['warning'] : ""

        let drugProperties = drug['drugProperties'].split(', ')
        value['drugProperties'] = drugProperties

        if (!drug) {
            return res.status(400).json({
                appStatus: -1,
                message: "Drug not found"
            })
        }
        return res.status(200).json({
            appStatus: 0,
            value: value
        })
    } catch (err) {
        return res.status(400).json({
            appStatus: -1,
            error: errorHandler.getErrorMessage(err)
        })
    }
}

const getDrugList = async (req, res) => {
    try {
        let list = await Drug.find()
        if (!list) {
            return res.status(400).json({
                message: "There's no drug"
            })
        }
        return res.status(200).json({
            appStatus: 0,
            value: list
        })
    } catch (err) {
        return res.status(400).json({
            appStatus: -1,
            error: errorHandler.getErrorMessage(err)
        })
    }
}

export default {
    create,
    getById,
    getDrugList
}