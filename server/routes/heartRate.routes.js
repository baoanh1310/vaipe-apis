import express from 'express'
import userCtrl from '../controllers/user.controller'
import authCtrl from '../controllers/auth.controller'
import heartCtrl from '../controllers/heartRate.controller'

const router = express.Router()

router.param('userId', userCtrl.userByID)

router.route('/api/heartRate/')
  .get(authCtrl.requireSignin, heartCtrl.getStatsHeartRate)
  .post(authCtrl.requireSignin, heartCtrl.create)

export default router
