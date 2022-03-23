import express from 'express'
import userCtrl from '../controllers/user.controller'
import authCtrl from '../controllers/auth.controller'
import bloodCtrl from '../controllers/blood.controller'

const router = express.Router()

router.route('/api/blood/:userId')
  .get(authCtrl.requireSignin, authCtrl.hasAuthorization, bloodCtrl.getStatsBlood)
  .post(authCtrl.requireSignin, authCtrl.hasAuthorization, bloodCtrl.create)

router.param('userId', userCtrl.userByID)

export default router
