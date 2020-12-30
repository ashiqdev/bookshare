import express from "express";
import { saveBook, updateBook } from "../services/book-service";
import {
  deleteById,
  getAllPosts,
  getPostById,
  savePost,
  update,
} from "../services/post-service";
import { checkAuth, isOwner } from "../middlewares/auth";
import { validationRules, validate } from "../utils/validator";
import { catchErrors } from "../helpers/error-catcher";
import { NotFound } from "../utils/errors";

const router = express.Router();

const getHandler = async (req, res) => {
  let flag;
  if (req.query.filter === "Price: Low to High") {
    flag = 1;
  } else if (req.query.filter === "Price: High to Low") {
    flag = 2;
  }

  const { pageOffset, limit } = req.query;

  //  1. Get posts by calling db
  const posts = await getAllPosts(flag, pageOffset, limit);
  // 2. return the post as response
  res.status(200).json({ posts });
};

const getByIdHandler = async (req, res) => {
  const { id } = req.params;
  // Get post by calling db
  const post = await getPostById(id);
  if (!post) {
    throw new NotFound("post not found with given id", "post");
  }

  return res.json({ post });
};

const postHandler = async (req, res) => {
  const { body } = req;
  const { name, writer, summary, images } = body;
  // 1. create book reference
  const book = await saveBook({
    name,
    writer,
    summary,
    images,
    owner: req.user.id,
  });
  // 2. create post by calling db
  const post = await savePost({
    title: body.title,
    description: body.description,
    price: Number(body.price),
    book: book.id,
    author: req.user.id,
  });
  // 2. return the post as response
  return res.status(201).json({ post });
};

const putHandler = async (req, res) => {
  const { body } = req;
  const { id } = req.params;
  /**
   * When we need will update post, we need to update the book too.
   */
  const { name, writer, summary, images } = req.body;

  const postById = await getPostById(id);

  if (!postById) throw new NotFound("Post not found", "post");

  const { id: bookId } = postById.book;

  // update book
  await updateBook({ name, writer, summary, images }, bookId);
  //   1. update post by calling db
  const post = await update(body, id);
  //   2. return the updated post
  return res.status(200).json({ post });
};

const deleteHandler = async (req, res) => {
  const { id } = req.params;
  // 1. delete post by calling db
  await deleteById(id);
  // 2. return a message that, post is deleted
  res.status(200).json("Post Deleted");
};

router.get("/", catchErrors(getHandler));

router.get("/:id", catchErrors(getByIdHandler));
router.post(
  "/",
  checkAuth,
  validationRules("create_post"),
  validate,
  catchErrors(postHandler)
);
router.put(
  "/:id",
  checkAuth,
  catchErrors(isOwner),
  validationRules("update_post"),
  validate,
  catchErrors(putHandler)
);
router.delete(
  "/:id",
  checkAuth,
  catchErrors(isOwner),
  catchErrors(deleteHandler)
);

export default router;
