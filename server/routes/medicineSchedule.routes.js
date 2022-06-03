import express from 'express'
import userCtrl from '../controllers/user.controller'
import authCtrl from '../controllers/auth.controller'
import medicineScheduleCtrl from '../controllers/medicineSchedule.controller'
import upload from '../libs/multer'

const router = express.Router()

router.param('userId', userCtrl.userByID)

router.route('/api/medicineSchedule/')
  .get(authCtrl.requireSignin, medicineScheduleCtrl.getSchedulesByUserId)
  .post(authCtrl.requireSignin, medicineScheduleCtrl.create)

router.route('/api/medicineSchedule/:id')
  .get(authCtrl.requireSignin, medicineScheduleCtrl.getScheduleById)
  .delete(authCtrl.requireSignin, medicineScheduleCtrl.deleteById)

export default router
