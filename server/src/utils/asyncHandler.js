const asyncHandler = (requestHandler) => {
  return (req, res, next) => {
    Promise.resolve(requestHandler(req, res, next)).catch((error) =>
      console.log(error)
    );
  };
};

/* const asyncHandler = (fn) => async (req, res, next) => {
  try {
    await fn(req, res, next);
  } catch (error) {
    // next(error);
    res.status(error.code || 500).json({
      success: false,
      message: error.message,
    });
  }
}; */

export { asyncHandler };
