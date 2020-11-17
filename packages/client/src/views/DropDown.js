/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState, useContext, useEffect, useRef } from "react";
import { queryCache } from "react-query";
import { CSSTransition } from "react-transition-group";
import { store } from "src/context/store";
import captitalize from "src/utils/captitalize";
import { LOG_OUT, TOGGLE_MODAL } from "src/context/action/actionTypes";

// icons
import avatar from "src/assets/icons/placeholder.png";
import user from "src/assets/icons/user.svg";
import logout from "src/assets/icons/logout.svg";
import right from "src/assets/icons/right-chevron.svg";
import left from "src/assets/icons/left-arrow.svg";
import smartphone from "src/assets/icons/smartphone.svg";
import pin from "src/assets/icons/pin.svg";
import gender from "src/assets/icons/gender.svg";
import linkedIn from "src/assets/icons/linkedIn.svg";
import details from "src/assets/icons/details.svg";

import { CloseBox, OpenBox } from "src/context/action/actions";
import DropDownItem from "./DropDownItem";

const DropDown = () => {
  const updatedUser = queryCache.getQueryData("user");
  const { state, dispatch } = useContext(store);
  console.log({ test: state.modal });
  const node = useRef(null);
  const [activeMenu, setActiveMenu] = useState("main");

  const handleClick = (e) => {
    // console.log(node);
    if (node.current.contains(e.target)) {
      // inside click
      dispatch(OpenBox());
      return;
    }

    // outside click
    if (e.target.alt === "Icon") {
      return;
    }
    dispatch(CloseBox());
  };

  // const [profileCompleted, setProfileCompleted] = useState(value);

  const setMenu = (menu) => setActiveMenu(menu);

  useEffect(() => {
    document.addEventListener("mousedown", handleClick);
    return () => {
      document.removeEventListener("mousedown", handleClick);
    };
  }, []);

  return (
    <div className="">
      <div
        className="absolute rounded-md  shadow-lg p-5 px-2 right-1.5 mt-6 bg-white w-72 sm:w-87 "
        style={{
          height: `${
            updatedUser && updatedUser.completed === "true" ? "230px" : "180px"
          }`,
        }}
        ref={node}
      >
        {activeMenu === "main" && (
          <div className="flex border-b">
            <img
              className="w-10 h-10 rounded-full mr-3"
              src={updatedUser?.image ? updatedUser.image : avatar}
              alt="Avatar"
            />
            <div className="pb-3">
              <p className="font-semibold">{captitalize(state?.user?.name)}</p>
              <p className="text-xs text-gray-800">{state?.user?.email}</p>
            </div>
          </div>
        )}

        <CSSTransition
          in={activeMenu === "main"}
          unmountOnExit
          timeout={500}
          classNames="menu-primary"
        >
          {/* 1st <When no profile> */}
          <div className="menu w-full pt-2 text-base">
            <DropDownItem toggleModal={TOGGLE_MODAL}>
              <div
                // type="button"
                className="flex items-center focus:outline-none"
              >
                <img src={user} alt="profile" className="h-6 w-8 mr-3" />
                <div className="flex items-center justify-center">
                  <span className="">Update Profile</span>
                </div>
              </div>
            </DropDownItem>

            {updatedUser && updatedUser.completed === "true" && (
              <DropDownItem goToMenu="profile" setMenu={setMenu}>
                <div className="flex items-center w-87 justify-center">
                  <img src={details} alt="user" className="h-6 w-8 mr-3" />
                  <div className="">
                    <a className="" href="#">
                      View Profile
                    </a>
                  </div>

                  <img
                    src={right}
                    className="w-8 h-4 font-bold ml-34 ml-auto"
                    alt=""
                  />
                </div>
              </DropDownItem>
            )}

            <DropDownItem logout={LOG_OUT}>
              <div className="flex items-center">
                <img src={logout} alt="profile" className="h-6 w-8 mr-3" />
                <div href="#">Sign Out</div>
              </div>
            </DropDownItem>
          </div>
        </CSSTransition>

        {updatedUser && updatedUser.completed === "true" && (
          <CSSTransition
            in={activeMenu === "profile"}
            unmountOnExit
            timeout={500}
            classNames="menu-secondary"
          >
            {/* 2nd when there is a profile */}
            <div className="menu">
              <DropDownItem goToMenu="main" setMenu={setMenu}>
                <div className="flex items-center w-87">
                  <img src={left} alt="user" className="h-6 w-8 mr-3" />
                  <div className="">
                    <a className="" href="#">
                      Back
                    </a>
                  </div>
                </div>
              </DropDownItem>

              <DropDownItem>
                <div className="flex items-center">
                  <img src={smartphone} alt="phone" className="h-6 w-8 mr-3" />
                  <div href="#">{updatedUser.phone}</div>
                </div>
              </DropDownItem>

              <DropDownItem>
                <div className="flex items-center">
                  <img src={pin} alt="pin" className="h-6 w-8 mr-3" />
                  <div href="#">{updatedUser.address}</div>
                </div>
              </DropDownItem>

              <DropDownItem>
                <div className="flex items-center">
                  <img src={gender} alt="gender" className="h-6 w-8 mr-3" />
                  <div href="#">{updatedUser.gender}</div>
                </div>
              </DropDownItem>

              {updatedUser.linkedIn && (
                <DropDownItem>
                  <div className="sm:flex items-center hidden sm:visible">
                    <img
                      src={linkedIn}
                      alt="linkedIn"
                      className="h-6 w-8 mr-3"
                    />
                    <div className="">{updatedUser.linkedIn}</div>
                  </div>
                </DropDownItem>
              )}
            </div>
          </CSSTransition>
        )}
      </div>
    </div>
  );
};

export default DropDown;
