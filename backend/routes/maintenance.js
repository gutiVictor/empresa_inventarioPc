const express = require('express');
const router = express.Router();
const maintenanceController = require('../controllers/maintenanceController');
const { authMiddleware, checkRole } = require('../middlewares/authMiddleware');
const { param, body } = require('express-validator');
const validate = require('../middlewares/validate');

router.use(authMiddleware);

// GET /api/maintenance
router.get('/', maintenanceController.getAll);

// GET /api/maintenance/:id
router.get('/:id', param('id').isInt(), validate, maintenanceController.getById);

// POST /api/maintenance
router.post(
  '/',
  checkRole('admin', 'manager', 'operator'),
  [
    body('asset_id').isInt(),
    body('type').isIn(['preventive', 'corrective', 'upgrade']),
    body('planned_date').isISO8601(),
    body('technician_id').optional().isInt(),
    body('cost_parts').optional().isFloat({ min: 0 }),
    body('cost_labor').optional().isFloat({ min: 0 }),
    validate
  ],
  maintenanceController.create
);

// PUT /api/maintenance/:id
router.put(
  '/:id',
  param('id').isInt(),
  validate,
  checkRole('admin', 'manager', 'operator'),
  [
    body('asset_id').optional().isInt(),
    body('type').optional().isIn(['preventive', 'corrective', 'upgrade']),
    body('planned_date').optional().isISO8601(),
    body('status').optional().isIn(['scheduled', 'in_progress', 'completed', 'cancelled']),
    body('technician_id').optional().isInt(),
    body('cost_parts').optional().isFloat({ min: 0 }),
    body('cost_labor').optional().isFloat({ min: 0 }),
    validate
  ],
  maintenanceController.update
);

// DELETE /api/maintenance/:id
router.delete(
  '/:id',
  param('id').isInt(),
  validate,
  checkRole('admin'),
  maintenanceController.delete
);

module.exports = router;