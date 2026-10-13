/**
 * Input Validation Middleware
 * Reusable parameter, query, and request body validators
 */

/**
 * Validates that a route parameter is a positive integer.
 * Prevents PostgreSQL type error crashes (e.g., 'invalid input syntax for type integer: "abc"').
 * 
 * @param {string} [paramName='id'] - The route param key to validate
 */
export const validateNumericId = (paramName = 'id') => {
  return (req, res, next) => {
    const rawVal = req.params[paramName];
    const id = parseInt(rawVal, 10);

    if (isNaN(id) || id <= 0 || String(id) !== String(rawVal).trim()) {
      return res.status(400).json({
        success: false,
        message: `Invalid '${paramName}' parameter. Must be a positive integer.`,
      });
    }

    req.params[paramName] = id;
    next();
  };
};

/**
 * Validates that required string fields exist in req.body and are non-empty
 * 
 * @param {string[]} fields - List of required field names
 */
export const validateRequiredBody = (fields = []) => {
  return (req, res, next) => {
    const missing = [];

    for (const field of fields) {
      const val = req.body[field];
      if (val === undefined || val === null || (typeof val === 'string' && val.trim() === '')) {
        missing.push(field);
      }
    }

    if (missing.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Missing required field(s): ${missing.join(', ')}`,
        missingFields: missing,
      });
    }

    next();
  };
};

/**
 * Validates an email field format in req.body
 * 
 * @param {string} [fieldName='email']
 */
export const validateEmail = (fieldName = 'email') => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return (req, res, next) => {
    const email = req.body[fieldName];
    if (email && !emailRegex.test(String(email).trim())) {
      return res.status(400).json({
        success: false,
        message: `Invalid email address format for '${fieldName}'`,
      });
    }
    next();
  };
};

/**
 * Validates that a field matches one of the allowed enum values
 * 
 * @param {string} fieldName
 * @param {string[]} allowedValues
 */
export const validateEnum = (fieldName, allowedValues) => {
  return (req, res, next) => {
    const val = req.body[fieldName];
    if (val !== undefined && !allowedValues.includes(val)) {
      return res.status(400).json({
        success: false,
        message: `Invalid value for '${fieldName}'. Allowed: ${allowedValues.join(', ')}`,
      });
    }
    next();
  };
};
