import express from 'express'
import userCtrl from '../controllers/user.controller'
import authCtrl from '../controllers/auth.controller'
import drugCtrl from '../controllers/drug.controller'

const router = express.Router()

router.param('userId', userCtrl.userByID)

router.route('/api/drug/')
  .get(authCtrl.requireSignin, drugCtrl.getDrugList)
  .post(authCtrl.requireSignin, drugCtrl.create)

router.route('/api/drug/:id')
    .get(authCtrl.requireSignin, drugCtrl.getById)

export default router
