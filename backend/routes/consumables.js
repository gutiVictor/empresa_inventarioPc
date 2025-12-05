const express = require('express');
const router = express.Router();
const consumableController = require('../controllers/consumableController');
const { authMiddleware, checkRole } = require('../middlewares/authMiddleware');
const { param, body } = require('express-validator');
const validate = require('../middlewares/validate');

router.use(authMiddleware);

// GET /api/consumables
router.get('/', consumableController.getAll);

// GET /api/consumables/:id
router.get('/:id', param('id').isInt(), validate, consumableController.getById);

// POST /api/consumables
router.post(
  '/',
  checkRole('admin', 'manager', 'operator'),
  [
    body('name').notEmpty().trim().isLength({ max: 200 }),
    body('quantity_in_stock').optional().isInt({ min: 0 }),
    body('min_quantity').optional().isInt({ min: 0 }),
    body('category_id').optional().isInt(),
    body('location_id').optional().isInt(),
    validate
  ],
  consumableController.create
);

// PUT /api/consumables/:id
router.put(
  '/:id',
  param('id').isInt(),
  validate,
  checkRole('admin', 'manager', 'operator'),
  [
    body('name').optional().trim().isLength({ max: 200 }),
    body('quantity_in_stock').optional().isInt({ min: 0 }),
    body('min_quantity').optional().isInt({ min: 0 }),
    body('category_id').optional().isInt(),
    body('location_id').optional().isInt(),
    validate
  ],
  consumableController.update
);

// DELETE /api/consumables/:id
router.delete(
  '/:id',
  param('id').isInt(),
  validate,
  checkRole('admin'),
  consumableController.delete
);

// PUT /api/consumables/:id/stock - Ajuste de stock
router.put(
  '/:id/stock',
  param('id').isInt(),
  validate,
  checkRole('admin', 'manager', 'operator'),
  [
    body('quantity').isInt(), // positivo o negativo
    body('reason').optional().trim().isLength({ max: 255 }),
    validate
  ],
  consumableController.adjustStock
);

module.exports = router;