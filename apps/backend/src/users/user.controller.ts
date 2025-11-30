import { Request, Response, NextFunction } from "express";
import extend from "lodash/extend";
import {
  createUser,
  findUserById,
  updateUser,
  deleteUser,
  listUsers,
} from "../db/models/user.model";
import { findUserProfileByUserId } from "../db/models/userProfile.model";
import {
  addFollow,
  removeFollow,
  getFollowCounts,
  isFollowing,
  getFollowing,
} from "../db/models/follow.model";
import errorHandler from "../utils/dbErrorHandler";

interface UserRequest extends Request {
  profile?: any;
  auth?: {
    _id: string;
  };
}

export const create = async (req: Request, res: Response) => {
  try {
    const user = await createUser({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
    });

    return res.status(200).json({
      message: "Successfully signed up!",
    });
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err),
    });
  }
};

export const list = async (req: Request, res: Response) => {
  try {
    let users = await listUsers();

    const sanitizedUsers = users.map((user) => ({
      name: user.name,
      email: user.email,
      updated: user.updated,
      created: user.created,
    }));

    res.json(sanitizedUsers);
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err),
    });
  }
};

export const userByID = async (
  req: UserRequest,
  res: Response,
  next: NextFunction,
  id: string,
) => {
  try {
    const user = await findUserById(id);

    if (!user) {
      return res.status(400).json({
        error: "User not found",
      });
    }

    // Fetch user profile
    const profile = await findUserProfileByUserId(id);

    // Get follow counts
    const { followers, following } = await getFollowCounts(id);

    // Check if current user follows this user
    let isFollowingUser = false;
    if (req.auth?._id && req.auth._id !== id) {
      isFollowingUser = await isFollowing(req.auth._id, id);
    }

    req.profile = {
      ...user,
      about: profile?.about,
      photo: profile?.photo,
      photoContentType: profile?.photo_content_type,
      followers,
      following,
      isFollowing: isFollowingUser,
    };
    next();
  } catch (err) {
    return res.status(400).json({
      error: "Could not retrieve user",
    });
  }
};

export const read = (req: UserRequest, res: Response) => {
  req.profile.hashed_password = undefined;
  req.profile.salt = undefined;
  return res.json(req.profile);
};

export const update = async (req: UserRequest, res: Response) => {
  try {
    let user = req.profile;

    // Handle photo upload if present
    let photoData = null;
    let photoContentType = null;

    if (req.file) {
      photoData = req.file.buffer.toString("base64");
      photoContentType = req.file.mimetype;
    }

    user = extend(user, req.body);
    user.updated = new Date();

    const updatedUser = await updateUser(user.id, {
      name: req.body.name || user.name,
      email: req.body.email || user.email,
      password: req.body.password,
      about: req.body.about,
      photo: photoData,
      photoContentType,
    });

    if (updatedUser) {
      (updatedUser as any).hashed_password = undefined;
      (updatedUser as any).salt = undefined;
      res.json(updatedUser);
    } else {
      return res.status(400).json({
        error: "User not found",
      });
    }
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err),
    });
  }
};

export const remove = async (req: UserRequest, res: Response) => {
  try {
    let user = req.profile;
    let deletedUser = await deleteUser(user.id);

    if (deletedUser) {
      user.hashed_password = undefined;
      user.salt = undefined;
      res.json(user);
    } else {
      return res.status(400).json({
        error: "User not found",
      });
    }
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err),
    });
  }
};

export const photo = async (req: UserRequest, res: Response) => {
  if (req.profile.photo && req.profile.photoContentType) {
    const imageBuffer = Buffer.from(req.profile.photo, "base64");
    res.set("Content-Type", req.profile.photoContentType);
    return res.send(imageBuffer);
  }
  return res.status(404).json({
    error: "Photo not found",
  });
};

export const addFollowing = async (req: UserRequest, res: Response) => {
  try {
    if (!req.auth?._id || !req.body.userId) {
      return res.status(400).json({
        error: "Missing user information",
      });
    }

    await addFollow(req.auth._id, req.body.userId);

    return res.status(200).json({
      message: "Successfully followed user",
    });
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err),
    });
  }
};

export const removeFollowing = async (req: UserRequest, res: Response) => {
  try {
    if (!req.auth?._id || !req.body.userId) {
      return res.status(400).json({
        error: "Missing user information",
      });
    }

    await removeFollow(req.auth._id, req.body.userId);

    return res.status(200).json({
      message: "Successfully unfollowed user",
    });
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err),
    });
  }
};

export const findPeople = async (req: UserRequest, res: Response) => {
  try {
    if (!req.profile?.id) {
      return res.status(400).json({
        error: "User not found",
      });
    }

    // Get list of users the current user is following
    const following = await getFollowing(req.profile.id);
    // Add current user's ID to exclude them from results
    following.push(req.profile.id);

    // Find users not in the following list
    const users = await listUsers();
    const peopleToFollow = users
      .filter((user) => !following.includes(user.id))
      .map((user) => ({
        _id: user.id,
        name: user.name,
      }));

    return res.json(peopleToFollow);
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err),
    });
  }
};

export default {
  create,
  list,
  userByID,
  read,
  update,
  remove,
  photo,
  addFollowing,
  removeFollowing,
  findPeople,
};
