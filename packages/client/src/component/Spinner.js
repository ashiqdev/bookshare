import React from "react";
import { css } from "@emotion/core";
import BeatLoader from "react-spinners/BeatLoader";

const override = css`
  display: block;
  margin: 0 auto;
  text-align: center;
`;

const Spinner = () => {
  return <BeatLoader css={override} size={15} color="#38a169" />;
};

export default Spinner;
