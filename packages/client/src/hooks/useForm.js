import { useState } from "react";

const useFormState = (initialValues) => {
  const [state, setstate] = useState(initialValues);

  const onChangeHandler = (e) =>
    setstate({
      ...state,
      [e.target.name]: e.target.value,
    });

  const reset = (field) => {
    if (field) {
      setstate({
        ...state,
        [field]: initialValues[field],
      });
    } else {
      setstate({
        ...initialValues,
      });
    }
  };

  return [state, onChangeHandler, reset];
};

export default useFormState;
