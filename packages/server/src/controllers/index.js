import configureUserController from "./user-controller";
import configurePostController from "./post-controller";

const configure = (app) => {
  configureUserController(app);
  configurePostController(app);
};

export default configure;
