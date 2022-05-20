import express from 'express'
import userCtrl from '../controllers/user.controller'
import authCtrl from '../controllers/auth.controller'
import drugHistoryCtrl from '../controllers/drugTaken.controller'

const router = express.Router()

router.param('userId', userCtrl.userByID)

router.route('/api/drugHistory/')
  .get(authCtrl.requireSignin, drugHistoryCtrl.getTakenHistoryByUserId)
  .post(authCtrl.requireSignin, drugHistoryCtrl.create)

router.route('/api/drugHistory/:id')
  .get(authCtrl.requireSignin, drugHistoryCtrl.getById)
  .delete(authCtrl.requireSignin, drugHistoryCtrl.deleteById)

export default router
