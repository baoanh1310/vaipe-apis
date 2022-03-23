import express from 'express'
import userCtrl from '../controllers/user.controller'
import authCtrl from '../controllers/auth.controller'
import ecgCtrl from '../controllers/ecg.controller'

const router = express.Router()

router.route('/api/ecg/:userId')
  .get(authCtrl.requireSignin, authCtrl.hasAuthorization, ecgCtrl.getStatsEcg)
  .post(authCtrl.requireSignin, authCtrl.hasAuthorization, ecgCtrl.create)

router.param('userId', userCtrl.userByID)

export default router
