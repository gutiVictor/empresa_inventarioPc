const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { authMiddleware, checkRole } = require('../middlewares/authMiddleware');
const { param, body } = require('express-validator');
const validate = require('../middlewares/validate');

router.use(authMiddleware);

// GET /api/users
router.get('/', userController.getAllUsers);

// GET /api/users/:id
router.get('/:id', param('id').isInt(), validate, userController.getUserById);

// POST /api/users
router.post(
  '/',
  checkRole('admin', 'manager'),
  [
    body('full_name').notEmpty().trim().isLength({ max: 150 }),
    body('email').isEmail().normalizeEmail(),
    body('employee_id').optional().trim().isLength({ max: 50 }),
    body('department').notEmpty().trim().isLength({ max: 100 }),
    body('job_title').notEmpty().trim().isLength({ max: 100 }),
    body('role').isIn(['admin', 'manager', 'operator', 'viewer']),
    validate
  ],
  userController.createUser
);

// PUT /api/users/:id
router.put(
  '/:id',
  param('id').isInt(),
  validate,
  checkRole('admin', 'manager'),
  [
    body('full_name').optional().trim().isLength({ max: 150 }),
    body('email').optional().isEmail().normalizeEmail(),
    body('employee_id').optional().trim().isLength({ max: 50 }),
    body('department').optional().trim().isLength({ max: 100 }),
    body('job_title').optional().trim().isLength({ max: 100 }),
    body('role').optional().isIn(['admin', 'manager', 'operator', 'viewer']),
    body('active').optional().isBoolean(),
    validate
  ],
  userController.updateUser
);

// DELETE /api/users/:id
router.delete(
  '/:id',
  param('id').isInt(),
  validate,
  checkRole('admin'),
  userController.deleteUser
);

module.exports = router;