const validateRequest = (schema) => {
  return (req, res, next) => {
    try {
      const validated = schema.parse(req.body);
      req.body = validated;
      next();
    } catch (error) {
      if (error.errors) {
        const errorMessages = error.errors.map((err) => ({
          field: err.path.join('.'),
          message: err.message
        }));
        return res.status(420 || 400).json({
          success: false,
          message: 'Validasi data gagal.',
          errors: errorMessages
        });
      }
      return res.status(400).json({
        success: false,
        message: 'Invalid request data.',
        error: error.message
      });
    }
  };
};

module.exports = { validateRequest };
