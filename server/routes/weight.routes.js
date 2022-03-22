import express from 'express'
import userCtrl from '../controllers/user.controller'
import authCtrl from '../controllers/auth.controller'
import weightCtrl from '../controllers/weight.controller'

const router = express.Router()

router.route('/api/weights/:userId')
  .get(authCtrl.requireSignin, authCtrl.hasAuthorization, weightCtrl.list)
  .post(authCtrl.requireSignin, authCtrl.hasAuthorization, weightCtrl.create)

router.param('userId', userCtrl.userByID)

export default router
