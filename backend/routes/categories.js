const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
const { authMiddleware, checkRole } = require('../middlewares/authMiddleware');
const { param, body } = require('express-validator');
const validate = require('../middlewares/validate');

router.use(authMiddleware);

// GET /api/categories
router.get('/', categoryController.getAll);

// GET /api/categories/:id
router.get('/:id', param('id').isInt(), validate, categoryController.getById);

// POST /api/categories
router.post(
  '/',
  checkRole('admin', 'manager'),
  [
    body('name').notEmpty().trim().isLength({ max: 100 }),
    body('parent_id').optional().isInt(),
    validate
  ],
  categoryController.create
);

// PUT /api/categories/:id
router.put(
  '/:id',
  param('id').isInt(),
  validate,
  checkRole('admin', 'manager'),
  [
    body('name').optional().trim().isLength({ max: 100 }),
    body('parent_id').optional().isInt(),
    validate
  ],
  categoryController.update
);

// DELETE /api/categories/:id
router.delete(
  '/:id',
  param('id').isInt(),
  validate,
  checkRole('admin'),
  categoryController.delete
);

module.exports = router;