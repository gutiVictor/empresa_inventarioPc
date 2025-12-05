const express = require('express');
const router = express.Router();
const supplierController = require('../controllers/supplierController');
const { authMiddleware, checkRole } = require('../middlewares/authMiddleware');
const { param, body } = require('express-validator');
const validate = require('../middlewares/validate');

router.use(authMiddleware);

// GET  /api/suppliers
router.get('/', supplierController.getAll);

// GET  /api/suppliers/:id
router.get('/:id', param('id').isInt(), validate, supplierController.getById);

// POST /api/suppliers
router.post(
  '/',
  checkRole('admin', 'manager'),
  [
    body('name').notEmpty().trim().isLength({ max: 200 }),
    body('tax_id').optional().trim().isLength({ max: 50 }),
    body('email').optional().isEmail().normalizeEmail(),
    body('phone').optional().trim().isLength({ max: 20 }),
    body('contact_person').optional().trim().isLength({ max: 100 }),
    body('address').optional().trim(),
    body('website').optional().isURL(),
    body('support_phone').optional().trim().isLength({ max: 50 }),
    body('support_email').optional().isEmail().normalizeEmail(),
    validate
  ],
  supplierController.create
);

// PUT  /api/suppliers/:id
router.put(
  '/:id',
  param('id').isInt(),
  validate,
  checkRole('admin', 'manager'),
  [
    body('name').optional().trim().isLength({ max: 200 }),
    body('tax_id').optional().trim().isLength({ max: 50 }),
    body('email').optional().isEmail().normalizeEmail(),
    body('phone').optional().trim().isLength({ max: 20 }),
    body('contact_person').optional().trim().isLength({ max: 100 }),
    body('address').optional().trim(),
    body('website').optional().isURL(),
    body('support_phone').optional().trim().isLength({ max: 50 }),
    body('support_email').optional().isEmail().normalizeEmail(),
    validate
  ],
  supplierController.updateSupplier
);

// DELETE /api/suppliers/:id  (soft-delete)
router.delete(
  '/:id',
  param('id').isInt(),
  validate,
  checkRole('admin'),
  supplierController.deleteSupplier
);

module.exports = router;