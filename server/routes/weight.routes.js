import express from 'express'
import userCtrl from '../controllers/user.controller'
import authCtrl from '../controllers/auth.controller'
import weightCtrl from '../controllers/weight.controller'

const router = express.Router()

router.param('userId', userCtrl.userByID)

router.route('/api/weights/')
  .get(authCtrl.requireSignin, weightCtrl.getStatsWeight)
  // .post(authCtrl.requireSignin, upload.single('image'), weightCtrl.create)
  .post(authCtrl.requireSignin, weightCtrl.create)

export default router
