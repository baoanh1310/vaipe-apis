import express from 'express'
import userCtrl from '../controllers/user.controller'
import authCtrl from '../controllers/auth.controller'
import oxyCtrl from '../controllers/oxy.controller'

const router = express.Router()

router.param('userId', userCtrl.userByID)

router.route('/api/oxy/')
  .get(authCtrl.requireSignin, oxyCtrl.getStatsOxy)
  // .post(authCtrl.requireSignin, upload.single('image'), oxyCtrl.create)
  .post(authCtrl.requireSignin, oxyCtrl.create)

export default router
