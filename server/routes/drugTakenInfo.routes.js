import express from 'express'
import authCtrl from '../controllers/auth.controller'
import drugTakenInfoCtrl from '../controllers/drugTakenInfo.controller'

const router = express.Router()

router.route('/api/drugTakenInfo/')
  .get(authCtrl.requireSignin, drugTakenInfoCtrl.getDrugTakenInfoByUserId)
  .post(authCtrl.requireSignin, drugTakenInfoCtrl.create)

export default router