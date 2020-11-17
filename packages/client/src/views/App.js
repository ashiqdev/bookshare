import React from "react";
import { ReactQueryDevtools } from "react-query-devtools";
import { StateProvider } from "src/context/store";
import RouterController from "./Routing/RouterController";

const App = () => {
  return (
    <StateProvider>
      <RouterController />
      <ReactQueryDevtools initialIsOpen={false} />
    </StateProvider>
  );
};

export default App;
