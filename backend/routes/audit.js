const express = require('express');
const router = express.Router();
const auditController = require('../controllers/auditController');
const { authMiddleware, checkRole } = require('../middlewares/authMiddleware');
const { param, query } = require('express-validator');
const validate = require('../middlewares/validate');

router.use(authMiddleware);

// GET /api/audit - Obtener logs con paginación
router.get(
  '/',
  checkRole('admin', 'manager'),
  [
    query('page').optional().isInt({ min: 1 }),
    query('limit').optional().isInt({ min: 1, max: 100 }),
    validate
  ],
  auditController.getAllLogs
);

// GET /api/audit/:table/:recordId - Logs de un registro específico
router.get(
  '/:table/:recordId',
  checkRole('admin', 'manager'),
  [
    param('table').isIn([
      'assets', 'asset_assignments', 'asset_moves', 'categories',
      'consumables', 'documents', 'license_assignments', 'locations',
      'maintenance_orders', 'software_licenses', 'suppliers', 'users'
    ]),
    param('recordId').isInt(),
    validate
  ],
  auditController.getLogsByRecord
);

module.exports = router;