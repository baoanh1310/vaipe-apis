import express from 'express'
import userCtrl from '../controllers/user.controller'
import authCtrl from '../controllers/auth.controller'
import temperatureCtrl from '../controllers/temperature.controller'

const router = express.Router()

router.param('userId', userCtrl.userByID)

router.route('/api/temperature/')
  .get(authCtrl.requireSignin, temperatureCtrl.getStatsTemperature)
  // .post(authCtrl.requireSignin, upload.single('image'), temperatureCtrl.create)
  .post(authCtrl.requireSignin, temperatureCtrl.create)

export default router
