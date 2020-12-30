import models from "../models/data-models";
import { NotFound } from "../utils/errors";
import cloudinary from "../utils/cloudinary";

// export const saveBook = async (book) => new Book(book).save();

const { Book } = models;

export const saveBook = async (body) => {
  const { name, writer, summary, images, owner } = body;

  const res = [];

  if (images) {
    for (const image of images) {
      const uploadedResponse = await cloudinary.uploader.upload(image, {
        upload_preset: "seplt5p0",
        eager: [
          {
            crop: "fit",
            quality: "auto",
          },
        ],
      });

      res.push(uploadedResponse.eager[0].url);
    }
  } else {
    // fill the res with an placeholder image
    res.push("https://i.ibb.co/PY6PfWT/placeholder.jpg");
  }

  const newBook = await new Book({
    name,
    writer,
    summary,
    owner,
    images: res,
  }).save();
  return newBook;
};

export const updateBook = async (post, id) => {
  const updatedImages = [];
  const oldImages = [];
  const { name, writer, summary } = post;
  let { images } = post;

  if (!images) images = ["https://i.ibb.co/PY6PfWT/placeholder.jpg"];

  for (const image of images) {
    if (image.startsWith("data")) {
      const uploadedResponse = await cloudinary.uploader.upload(image, {
        upload_preset: "seplt5p0",
        eager: [
          {
            crop: "fit",
            quality: "auto",
          },
        ],
      });

      updatedImages.push(uploadedResponse.eager[0].url);
    } else {
      oldImages.push(image);
    }
  }

  console.log({ updatedImages });
  console.log({ oldImages });

  const updatedBook = await Book.findOneAndUpdate(
    { _id: id },
    { name, writer, summary, images: [...oldImages, ...updatedImages] },
    {
      new: true,
    }
  ).exec();

  if (updatedBook) return updatedBook;
  throw new NotFound("Book not found by given id");
};
