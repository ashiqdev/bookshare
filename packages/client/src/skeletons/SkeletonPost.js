import React from "react";
import SkeletonElement from "src/skeletons/SkeletonElement";
import Shimmer from "./Shimmer";

const SkeletonPost = () => {
  const themeClass = "light";

  return (
    <div className="lg:bg-white">
      <div className="flex flex-col container mx-auto mt-6 lg:mt-6 bg-white overflow-hidden">
        <div className="lg:bg-white">
          <div className="flex flex-wrap flex-col lg:flex-row items-start container mx-auto">
            <div>
              <div className="w-84 h-8 bg-gray-300 rounded" />
              <div className="flex flex-wrap items-center pt-8">
                <div className="w-84 h-64 bg-gray-300" />
                <div className="lg:ml-64 h-32 w-64 rounded bg-gray-200">
                  <SkeletonElement type="description" />
                  <SkeletonElement type="description" />
                  <SkeletonElement type="description" />
                  <SkeletonElement type="description" />
                  <SkeletonElement type="description" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SkeletonPost;
