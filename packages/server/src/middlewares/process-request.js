const processRequest = async (req, res, next) => {
  let correlationId = req.headers["x-correlation-id"];
  if (!correlationId) {
    correlationId = Date.now().toString();
    req.headers["x-correlation-id"] = correlationId;
  }

  //   set correlationId to response header
  res.set("x-correlation-id", correlationId);

  return next();
};

export default processRequest;
