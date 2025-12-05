const express = require('express');
const router = express.Router();
const documentController = require('../controllers/documentController');
const { authMiddleware, checkRole } = require('../middlewares/authMiddleware');
const { param, body } = require('express-validator');
const validate = require('../middlewares/validate');

router.use(authMiddleware);

// GET /api/documents
router.get('/', documentController.getAll);

// GET /api/documents/:id
router.get('/:id', param('id').isInt(), validate, documentController.getById);

// POST /api/documents
router.post(
  '/',
  checkRole('admin', 'manager', 'operator'),
  [
    body('entity_type').isIn([
      'assets', 'asset_assignments', 'asset_moves', 'categories',
      'consumables', 'license_assignments', 'maintenance_orders',
      'software_licenses', 'suppliers', 'users'
    ]),
    body('entity_id').isInt(),
    body('file_url').isURL(),
    body('file_type').optional().isString().isLength({ max: 50 }),
    body('description').optional().trim().isLength({ max: 500 }),
    validate
  ],
  documentController.create
);

// PUT /api/documents/:id
router.put(
  '/:id',
  param('id').isInt(),
  validate,
  checkRole('admin', 'manager', 'operator'),
  [
    body('file_url').optional().isURL(),
    body('file_type').optional().isString().isLength({ max: 50 }),
    body('description').optional().trim().isLength({ max: 500 }),
    validate
  ],
  documentController.update
);

// DELETE /api/documents/:id
router.delete(
  '/:id',
  param('id').isInt(),
  validate,
  checkRole('admin'),
  documentController.delete
);

// GET /api/documents/entity/:entityType/:entityId
router.get(
  '/entity/:entityType/:entityId',
  param('entityType').isIn([
    'assets', 'asset_assignments', 'asset_moves', 'categories',
    'consumables', 'license_assignments', 'maintenance_orders',
    'software_licenses', 'suppliers', 'users'
  ]),
  param('entityId').isInt(),
  validate,
  documentController.getByEntity
);

module.exports = router;