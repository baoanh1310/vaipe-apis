import express from 'express'
import userCtrl from '../controllers/user.controller'
import authCtrl from '../controllers/auth.controller'
import oxyCtrl from '../controllers/oxy.controller'

const router = express.Router()

router.route('/api/oxy/:userId')
  .get(authCtrl.requireSignin, authCtrl.hasAuthorization, oxyCtrl.getStatsOxy)
  .post(authCtrl.requireSignin, authCtrl.hasAuthorization, oxyCtrl.create)

router.param('userId', userCtrl.userByID)

export default router
