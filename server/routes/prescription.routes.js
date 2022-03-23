import express from 'express'
import userCtrl from '../controllers/user.controller'
import authCtrl from '../controllers/auth.controller'
import prescriptionCtrl from '../controllers/prescription.controller'

const router = express.Router()

router.route('/api/prescription/:userId')
  .get(authCtrl.requireSignin, authCtrl.hasAuthorization, prescriptionCtrl.getStatsPrescription)
  .post(authCtrl.requireSignin, authCtrl.hasAuthorization, prescriptionCtrl.create)

router.param('userId', userCtrl.userByID)

export default router
