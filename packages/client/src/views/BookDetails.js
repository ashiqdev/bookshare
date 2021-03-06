import React from "react";
import { Link } from "react-router-dom";

const BookDetails = ({ post, reference }) => {
  const { images } = post.book;
  let filteredImages;

  if (images.length > 1) {
    filteredImages = images.filter(
      (img) => img !== "https://i.ibb.co/PY6PfWT/placeholder.jpg"
    );
  } else {
    filteredImages = images;
  }
  return (
    <Link
      to={`/posts/${post._id}`}
      ref={reference || null}
      className="flex flex-col sm:flex-row min-w-full bg-white px-5 py-6 rounded-lg text-xl shadow-md hover:shadow-lg mr-3 mt-8 cursor-pointer"
    >
      <div className="mr-6 flex-shrink-0 w-64">
        <img
          src={filteredImages[0]}
          alt="Image1"
          className="h-48 w-full rounded-lg"
        />
      </div>
      <div className="">
        <div className="">
          <h2 className="mb-8 bg-clip-text text-transparent bg-gradient-to-r from-teal-400  to-blue-500  font-bold text-2xl">
            {post.title}
          </h2>

          <p className="text-lg">{post.book.summary}</p>
        </div>
      </div>
      <p className="sm:ml-auto pt-3 sm:pt-0 bg-clip-text text-transparent bg-gradient-to-r from-teal-400  to-blue-500  font-bold text-2xl">
        ৳{post.price}
      </p>
    </Link>
  );
};

export default BookDetails;
