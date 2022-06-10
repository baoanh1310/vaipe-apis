import express from 'express'
import authCtrl from '../controllers/auth.controller'
import drugTakenHistoryCtrl from '../controllers/drugTakenHistory.controller'

const router = express.Router()

router.route('/api/drugTakenHistory/')
  .get(authCtrl.requireSignin, drugTakenHistoryCtrl.getDrugTakenHistoryByUserId)
  // .post(authCtrl.requireSignin, drugTakenHistoryCtrl.create)
  .post(authCtrl.requireSignin, drugTakenHistoryCtrl.takeMedicines)

router.route('/api/drugTakenHistory/:id')
//   .get(authCtrl.requireSignin, drugTakenInfoCtrl.getDrugTakenHistoryById)
    .put(authCtrl.requireSignin, drugTakenHistoryCtrl.update)
    .delete(authCtrl.requireSignin, drugTakenHistoryCtrl.deleteById)

export default router