import { ValidationError } from "./ApiError.js";

const throwIf = (condition, errorInstance, logCallback) => {
  const shouldThrow = typeof condition === "function" ? condition() : condition;

  if (shouldThrow) {
    if (typeof logCallback === "function") {
      logCallback(errorInstance);
    }

    throw errorInstance;
  }
};

const throwIfInvalid = (
  fields,
  message = "Please fill all required fields"
) => {
  const missing = Object.entries(fields)
    .filter(([_, invalid]) => invalid)
    .map(([field]) => `${field} is required`);

  if (missing.length > 0) {
    throw new ValidationError(message, missing);
  }
};

export { throwIf, throwIfInvalid };
