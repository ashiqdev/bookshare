/* eslint-disable react/prop-types */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useContext } from "react";
import { store } from "src/context/store";

const DropDownItem = ({
  children,
  leftIcon,
  rightIcon,
  goToMenu,
  setMenu,
  logout,
  toggleModal,
}) => {
  const { dispatch } = useContext(store);
  console.log({ GOTO: goToMenu });

  return (
    <a
      href="#"
      className="menu-item text-gray-900"
      onClick={() => {
        goToMenu && setMenu(goToMenu);
        logout && dispatch({ type: logout });
        toggleModal && dispatch({ type: toggleModal });
      }}
    >
      <span className="icon-button">{leftIcon}</span>
      {children}
      <span className="icon-right">{rightIcon}</span>
    </a>
  );
};

export default DropDownItem;
