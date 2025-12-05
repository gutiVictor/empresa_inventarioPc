const express = require('express');
const router = express.Router();
const assetMoveController = require('../controllers/assetMoveController');
const { authMiddleware, checkRole } = require('../middlewares/authMiddleware');
const { param, body } = require('express-validator');
const validate = require('../middlewares/validate'); // tu middleware de validación

router.use(authMiddleware);

// CRUD Movimientos
router.get('/', assetMoveController.getAllMoves);
router.get('/:id', param('id').isInt(), validate, assetMoveController.getMoveById);

router.post('/', 
  checkRole('admin', 'manager', 'operator'),
  assetMoveController.createMove
);

router.put('/:id', 
  param('id').isInt(),
  validate,
  checkRole('admin', 'manager', 'operator'),
  assetMoveController.updateMove // ✅ nuevo
);

router.delete('/:id', 
  param('id').isInt(),
  validate,
  checkRole('admin', 'manager'),
  assetMoveController.deleteMove
);

module.exports = router;