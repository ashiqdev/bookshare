import { NotFound } from "../utils/errors";

import Post from "../models/Post";
import {
  deleteFromAlgolia,
  insertToAlgolia,
  updateToAlgolia,
} from "../utils/algolia";

// export const savePost = async (post) => new Post(post).save();

export const savePost = async (post) => {
  const newPost = await new Post(post).save();
  // await index.saveObject({
  //   id: post._id,
  //   title: post.title,
  //   price: post.price,
  // });
  await insertToAlgolia(newPost);

  return newPost;
};

export const getAllPosts = async (flag = -1, page, perPage) => {
  let field;
  if (flag === -1) field = "createdAt";
  else field = "price";

  const pageOffset = Number(page);
  const limit = Number(perPage);

  const startIndex = (pageOffset - 1) * limit;
  const endIndex = pageOffset * limit;

  const paginatedPosts = {};

  if (endIndex < (await Post.countDocuments().exec())) {
    paginatedPosts.next = pageOffset + 1;
  }

  if (startIndex > 0) {
    paginatedPosts.previous = pageOffset - 1;
  }

  const postPromise = Post.find()
    .populate("book ", ["name", "writer", "summary", "images"])
    .limit(limit)
    .skip(startIndex)
    .sort({ [field]: `${flag === 1 ? 1 : -1}` });

  const countPromise = Post.count();

  const [posts, count] = await Promise.all([postPromise, countPromise]);

  paginatedPosts.posts = posts;
  paginatedPosts.pages = Math.ceil(count / limit);
  paginatedPosts.total = count;

  return paginatedPosts;
};

export const getPostById = async (id) =>
  Post.findOne({ _id: id }).populate("book author", [
    "name",
    "writer",
    "summary",
    "images",
    "name",
    "phone",
    "slicedPhone",
    "image",
  ]);

export const update = async (post, id) => {
  const updatedPost = await Post.findOneAndUpdate({ _id: id }, post, {
    new: true,
  }).exec();

  if (updatedPost) {
    await updateToAlgolia(updatedPost);
    return updatedPost;
  }
  throw new NotFound("Post not found by given id");
};

export const deleteById = async (id) => {
  const post = await Post.findOne({ _id: id });
  if (post) {
    await Post.deleteOne({ _id: id });
    await deleteFromAlgolia(id);
    return;
  }

  throw new NotFound("Post not found by given id");
};
