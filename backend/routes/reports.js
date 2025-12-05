const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController');
const { authMiddleware, checkRole } = require('../middlewares/authMiddleware');
const { query } = require('express-validator');
const validate = require('../middlewares/validate');

router.use(authMiddleware);

// GET /api/reports/dashboard - Estadísticas generales
router.get(
  '/dashboard',
  checkRole('admin', 'manager'),
  reportController.getDashboardStats
);

// GET /api/reports/expiring-licenses - Licencias por vencer
router.get(
  '/expiring-licenses',
  checkRole('admin', 'manager'),
  [
    query('days').optional().isInt({ min: 1, max: 365 }),
    validate
  ],
  reportController.getExpiringLicenses
);

// GET /api/reports/low-stock - Consumibles con bajo stock
router.get(
  '/low-stock',
  checkRole('admin', 'manager'),
  [
    query('threshold').optional().isInt({ min: 0 }),
    validate
  ],
  reportController.getLowStockConsumables
);

module.exports = router;