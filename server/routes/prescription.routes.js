import express from 'express'
import authCtrl from '../controllers/auth.controller'
import medicineScheduleCtrl from '../controllers/medicineSchedule.controller'

const router = express.Router()

router.route('/api/prescription/')
  .get(authCtrl.requireSignin, medicineScheduleCtrl.getPrescriptionsList)
  
router.route('/api/prescription/')
  .put(authCtrl.requireSignin, medicineScheduleCtrl.updateMedicineSchedule)

export default router
