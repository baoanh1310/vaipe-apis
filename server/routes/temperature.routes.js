import express from 'express'
import userCtrl from '../controllers/user.controller'
import authCtrl from '../controllers/auth.controller'
import temperatureCtrl from '../controllers/temperature.controller'
import upload from '../libs/multer'

const router = express.Router()

router.route('/api/temperature/:userId')
  .get(authCtrl.requireSignin, authCtrl.hasAuthorization, temperatureCtrl.getStatsTemperature)
  .post(authCtrl.requireSignin, authCtrl.hasAuthorization, upload.single('image'), temperatureCtrl.create)

router.param('userId', userCtrl.userByID)

router.route('/api/temperature/')
  .get(authCtrl.requireSignin, temperatureCtrl.getStatsTemperature)
  .post(authCtrl.requireSignin, upload.single('image'), temperatureCtrl.create)

export default router
