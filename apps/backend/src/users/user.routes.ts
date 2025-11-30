import express from 'express';
import userCtrl from './user.controller';
import { requireSignin, hasAuthorization } from '../auth/auth.controller';

const router = express.Router();

router.route('/api/users')
  .post(userCtrl.create)
  .get(userCtrl.list);

router.route('/api/users/:userId')
  .get(requireSignin, userCtrl.read)
  .put(requireSignin, hasAuthorization, userCtrl.update)
  .delete(requireSignin, hasAuthorization, userCtrl.remove);

router.param('userId', userCtrl.userByID);

export default router;
