const asyncHandler = (requestHandler, options = {}) => {
  const { logRequest = false } = options;

  return (req, res, next) => {
    // Optionally log request details
    if (logRequest && process.env.NODE_ENV !== "production") {
      console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
      if (Object.keys(req.body).length > 0) {
        console.log("Body:", JSON.stringify(req.body, null, 2));
      }
    }

    // Execute handler and catch any errors
    Promise.resolve(requestHandler(req, res, next)).catch((err) => {
      // Add request context to error for better debugging
      if (err && typeof err === "object") {
        err.requestId = req.id;
        err.method = req.method;
        err.path = req.path;
      }
      next(err);
    });
  };
};

export { asyncHandler };
