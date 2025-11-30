import { Request, Response, NextFunction } from "express";
import formidable from "formidable";
import fs from "fs";
import {
  createPost,
  findPostById,
  getNewsFeedPosts,
  getPostsByUser,
  deletePost,
} from "../db/models/post.model";
import { getFollowing } from "../db/models/follow.model";
import errorHandler from "../utils/dbErrorHandler";

interface PostRequest extends Request {
  post?: any;
  profile?: any;
  auth?: {
    _id: string;
  };
}

export const create = (req: PostRequest, res: Response) => {
  const form = new formidable.IncomingForm({
    keepExtensions: true,
  });

  form.parse(req, async (err, fields, files) => {
    if (err) {
      return res.status(400).json({
        error: "Image could not be uploaded",
      });
    }

    try {
      const textField = Array.isArray(fields.text)
        ? fields.text[0]
        : fields.text;

      if (!textField) {
        return res.status(400).json({
          error: "Text is required",
        });
      }

      let photoData = null;
      let photoContentType = null;

      const photoFile = Array.isArray(files.photo)
        ? files.photo[0]
        : files.photo;
      if (photoFile) {
        photoData = fs.readFileSync(photoFile.filepath).toString("base64");
        photoContentType = photoFile.mimetype || "image/jpeg";
      }

      const post = await createPost({
        text: textField,
        photo: photoData,
        photo_content_type: photoContentType,
        posted_by: req.profile.id,
      });

      // Return post with postedBy user info
      const postWithUser = {
        ...post,
        _id: post.id,
        postedBy: {
          _id: req.profile.id,
          name: req.profile.name,
        },
      };

      res.json(postWithUser);
    } catch (error) {
      return res.status(400).json({
        error: errorHandler.getErrorMessage(error),
      });
    }
  });
};

export const postByID = async (
  req: PostRequest,
  res: Response,
  next: NextFunction,
  id: string,
) => {
  try {
    const post = await findPostById(id);

    if (!post) {
      return res.status(400).json({
        error: "Post not found",
      });
    }

    req.post = { ...post, _id: post.id };
    next();
  } catch (err) {
    return res.status(400).json({
      error: "Could not retrieve post",
    });
  }
};

export const photo = (req: PostRequest, res: Response) => {
  if (req.post.photo && req.post.photo_content_type) {
    const imageBuffer = Buffer.from(req.post.photo, "base64");
    res.set("Content-Type", req.post.photo_content_type);
    return res.send(imageBuffer);
  }
  return res.status(404).json({
    error: "Photo not found",
  });
};

export const listNewsFeed = async (req: PostRequest, res: Response) => {
  try {
    if (!req.profile?.id) {
      return res.status(400).json({
        error: "User not found",
      });
    }

    // Get users the current user is following
    const following = await getFollowing(req.profile.id);

    // Get posts from followed users and own posts
    const posts = await getNewsFeedPosts(req.profile.id, following);

    // Transform posts to match expected format
    const transformedPosts = posts.map((post) => ({
      _id: post.id,
      text: post.text,
      photo: post.photo,
      photo_content_type: post.photo_content_type,
      created: post.created,
      updated: post.updated,
      postedBy: post.postedBy,
    }));

    res.json(transformedPosts);
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err),
    });
  }
};

export const listByUser = async (req: PostRequest, res: Response) => {
  try {
    if (!req.profile?.id) {
      return res.status(400).json({
        error: "User not found",
      });
    }

    const posts = await getPostsByUser(req.profile.id);

    // Transform posts to match expected format
    const transformedPosts = posts.map((post) => ({
      _id: post.id,
      text: post.text,
      photo: post.photo,
      photo_content_type: post.photo_content_type,
      created: post.created,
      updated: post.updated,
      postedBy: post.postedBy,
    }));

    res.json(transformedPosts);
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err),
    });
  }
};

export const remove = async (req: PostRequest, res: Response) => {
  try {
    const post = req.post;
    const deleted = await deletePost(post.id);

    if (deleted) {
      res.json(post);
    } else {
      return res.status(400).json({
        error: "Post not found",
      });
    }
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err),
    });
  }
};

export const isPoster = (
  req: PostRequest,
  res: Response,
  next: NextFunction,
) => {
  const isPoster =
    req.post && req.auth && req.post.postedBy._id === req.auth._id;
  if (!isPoster) {
    return res.status(403).json({
      error: "User is not authorized",
    });
  }
  next();
};

export default {
  create,
  postByID,
  photo,
  listNewsFeed,
  listByUser,
  remove,
  isPoster,
};
