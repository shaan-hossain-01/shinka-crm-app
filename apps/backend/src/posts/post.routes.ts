import express from "express";
import postCtrl from "./post.controller";
import userCtrl from "../users/user.controller";
import { requireSignin } from "../auth/auth.controller";

const router = express.Router();

router.route("/api/posts/new/:userId").post(requireSignin, postCtrl.create);

router
  .route("/api/posts/feed/:userId")
  .get(requireSignin, postCtrl.listNewsFeed);

router.route("/api/posts/by/:userId").get(requireSignin, postCtrl.listByUser);

router.route("/api/posts/photo/:postId").get(postCtrl.photo);

router
  .route("/api/posts/:postId")
  .delete(requireSignin, postCtrl.isPoster, postCtrl.remove);

router.param("userId", userCtrl.userByID);
router.param("postId", postCtrl.postByID);

export default router;
