import jwt from "jsonwebtoken";

import Post from "../models/Post";
import { NotFound } from "../utils/errors";

const jwtValidator = (token) => jwt.verify(token, process.env.APP_SECRET);

export const checkAuth = (req, res, next) => {
  // Get token from header
  const token = req.header("x-auth-token");

  // check if no token
  if (!token) {
    return res.status(401).json({ msg: "No token, authorization denied" });
  }

  // verify token
  try {
    const decoded = jwtValidator(token);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ msg: "Token is not valid" });
  }
};

export const isOwner = async (req, res, next) => {
  const post = await Post.findById(req.params.id);
  if (!post) throw new NotFound("post not found", "post");
  if (req.user.id !== post.author.toString()) {
    return res.status(401).json({ msg: "You don't have permission" });
  }
  next();
};
