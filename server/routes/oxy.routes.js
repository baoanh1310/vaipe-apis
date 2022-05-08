import express from 'express'
import userCtrl from '../controllers/user.controller'
import authCtrl from '../controllers/auth.controller'
import oxyCtrl from '../controllers/oxy.controller'
import upload from '../libs/multer'

const router = express.Router()

router.route('/api/oxy/:userId')
  .get(authCtrl.requireSignin, authCtrl.hasAuthorization, oxyCtrl.getStatsOxy)
  .post(authCtrl.requireSignin, authCtrl.hasAuthorization, upload.single('image'), oxyCtrl.create)

router.param('userId', userCtrl.userByID)

router.route('/api/oxy/')
  .get(authCtrl.requireSignin, oxyCtrl.getStatsOxy)
  .post(authCtrl.requireSignin, upload.single('image'), oxyCtrl.create)

export default router
