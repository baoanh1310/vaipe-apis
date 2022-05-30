import express from 'express'
import userCtrl from '../controllers/user.controller'
import authCtrl from '../controllers/auth.controller'
import bloodCtrl from '../controllers/blood.controller'

const router = express.Router()

router.param('userId', userCtrl.userByID)

router.route('/api/blood/')
  .get(authCtrl.requireSignin, bloodCtrl.getStatsBlood)
  // .post(authCtrl.requireSignin, upload.single('image'), bloodCtrl.create)
  .post(authCtrl.requireSignin, bloodCtrl.create)

export default router
