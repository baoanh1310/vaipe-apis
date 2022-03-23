import express from 'express'
import userCtrl from '../controllers/user.controller'
import authCtrl from '../controllers/auth.controller'
const upload = require('../libs/multer')({ acceptFile: ['png', 'jpg', 'jpeg', 'gif'] })

const router = express.Router()

router.route('/api/users')
  // .get(userCtrl.list)
  .post(userCtrl.create)

router.route('/api/users/:userId')
  .get(authCtrl.requireSignin, authCtrl.hasAuthorization, userCtrl.read)
  .put(authCtrl.requireSignin, authCtrl.hasAuthorization, userCtrl.update)
  .delete(authCtrl.requireSignin, authCtrl.hasAuthorization, userCtrl.remove)

router.param('userId', userCtrl.userByID)

router.route('/api/avatar/:userId')
  .post(authCtrl.requireSignin, authCtrl.hasAuthorization, upload.array("images"))

export default router