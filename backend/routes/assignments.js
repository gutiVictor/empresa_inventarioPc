const express = require('express');
const router = express.Router();
const assignmentController = require('../controllers/assignmentController');
const { authMiddleware, checkRole } = require('../middlewares/authMiddleware');
const { param, body } = require('express-validator');
const validate = require('../middlewares/validate');

router.use(authMiddleware);

// GET /api/assignments
router.get('/', assignmentController.getAll);

// POST /api/assignments
router.post(
  '/',
  checkRole('admin', 'manager', 'operator'), // ← según tu lógica
  [
    body('asset_id').isInt(),
    body('user_id').isInt(),
    body('assigned_date').isISO8601(),
    validate
  ],
  assignmentController.create
);

// PUT /api/assignments/:id/return
router.put(
  '/:id/return',
  param('id').isInt(),
  validate,
  checkRole('admin', 'manager', 'operator'),
  assignmentController.returnAsset
);

// DELETE /api/assignments/:id (soft-delete)
router.delete(
  '/:id',
  param('id').isInt(),
  validate,
  checkRole('admin'),
  assignmentController.deleteAssignment
);

module.exports = router;