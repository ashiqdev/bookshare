import React from "react";
import SkeletonElement from "src/skeletons/SkeletonElement";
import Shimmer from "./Shimmer";

const SkeletonPosts = () => {
  const themeClass = "light";

  return (
    <div className={`skeleton-wrapper ${themeClass}`}>
      <div className="skeleton-posts">
        <div>
          <SkeletonElement type="thumbnail" />
        </div>

        <div>
          <SkeletonElement type="title" />
          <SkeletonElement type="description" />
          <SkeletonElement type="description" />
          <SkeletonElement type="description" />
          <SkeletonElement type="description" />
        </div>
      </div>

      <Shimmer />
    </div>
  );
};

export default SkeletonPosts;
