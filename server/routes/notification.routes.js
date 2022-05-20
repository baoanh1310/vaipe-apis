import express from 'express'
import userCtrl from '../controllers/user.controller'
import authCtrl from '../controllers/auth.controller'
import notiCtrl from '../controllers/notification.controller'

const router = express.Router()

router.param('userId', userCtrl.userByID)

router.route('/api/notification/')
  .get(authCtrl.requireSignin, notiCtrl.getNotiByUserId)
  .post(authCtrl.requireSignin, notiCtrl.create)

router.route('/api/notification/:id')
  .get(authCtrl.requireSignin, notiCtrl.getById)
  .delete(authCtrl.requireSignin, notiCtrl.deleteById)

export default router
