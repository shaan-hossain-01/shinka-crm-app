import express from 'express';
import userCtrl from './user.controller';
import { requireSignin, hasAuthorization } from '../auth/auth.controller';
import { uploadSingle } from '../middleware/upload';

const router = express.Router();

router.route('/api/users')
  .post(userCtrl.create)
  .get(userCtrl.list);

router.route('/api/users/:userId')
  .get(requireSignin, userCtrl.read)
  .put(requireSignin, hasAuthorization, uploadSingle, userCtrl.update)
  .delete(requireSignin, hasAuthorization, userCtrl.remove);

router.route('/api/users/:userId/photo')
  .get(userCtrl.photo);

router.param('userId', userCtrl.userByID);

export default router;
