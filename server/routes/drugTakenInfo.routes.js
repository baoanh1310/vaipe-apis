import express from 'express'
import authCtrl from '../controllers/auth.controller'
import drugTakenInfoCtrl from '../controllers/drugTakenInfo.controller'

const router = express.Router()

router.route('/api/drugTakenInfo/')
  // .get(authCtrl.requireSignin, drugTakenInfoCtrl.getDrugTakenInfoByUserId)
  .get(authCtrl.requireSignin, drugTakenInfoCtrl.getDrugTakenInfoByDate)
  .post(authCtrl.requireSignin, drugTakenInfoCtrl.create)

router.route('/api/drugTakenInfo/:id')
  .get(authCtrl.requireSignin, drugTakenInfoCtrl.getDrugTakenInfoById)

export default router