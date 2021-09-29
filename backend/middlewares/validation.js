const { validationResult } = require("express-validator");
const validate = async (req, res, next) => {

  const errors = validationResult(req);
  if (errors.isEmpty()) {
    return next();
  }
  res.status(400).json({
    message: "Validation error",
    validation: false,
    success: false,
    error: errors.array(),
  });
};

module.exports = validate;
