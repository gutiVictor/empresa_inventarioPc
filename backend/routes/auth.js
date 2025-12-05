const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { authMiddleware } = require('../middlewares/authMiddleware');
const { body } = require('express-validator');
const validate = require('../middlewares/validate');

// POST /api/auth/login - Login (público)
router.post(
  '/login',
  [
    body('email').isEmail().normalizeEmail(),
    body('password').notEmpty().isLength({ min: 4 }),
    validate
  ],
  authController.login
);

// GET /api/auth/profile - Obtener perfil (protegido)
router.get('/profile', authMiddleware, authController.getProfile);

// PUT /api/auth/change-password - Cambiar password (protegido)
router.put(
  '/change-password',
  authMiddleware,
  [
    body('currentPassword').notEmpty(),
    body('newPassword').notEmpty().isLength({ min: 6 }),
    validate
  ],
  authController.changePassword
);

module.exports = router;