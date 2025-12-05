const { validationResult } = require('express-validator');

/**
 * Middleware que valida los resultados de express-validator
 * Si hay errores, responde con 400 y los mensajes de error
 * Si no hay errores, continúa al siguiente middleware
 */
const validate = (req, res, next) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    return res.status(400).json({
      message: 'Error de validación',
      errors: errors.array().map(err => ({
        field: err.path || err.param,
        message: err.msg
      }))
    });
  }
  
  next();
};

module.exports = validate;
