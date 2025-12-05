const express = require('express');
const router = express.Router();
const assetController = require('../controllers/assetController');
const { authMiddleware, checkRole } = require('../middlewares/authMiddleware');
const { param, body } = require('express-validator');
const validate = require('../middlewares/validate'); // tu middleware de validación

router.use(authMiddleware);

// GET /api/assets
router.get('/', assetController.getAllAssets);

// GET /api/assets/:id
router.get('/:id', param('id').isInt(), validate, assetController.getAssetById);

// POST /api/assets
router.post(
  '/',
  checkRole('admin', 'manager', 'operator'),
  [
    body('name').notEmpty().trim().isLength({ max: 200 }),
    body('asset_tag').notEmpty().trim().isLength({ max: 50 }),
    body('acquisition_date').isISO8601(),
    body('acquisition_value').isFloat({ min: 0 }),
    body('category_id').isInt(),
    body('location_id').isInt(),
    validate
  ],
  assetController.createAsset
);

// PUT /api/assets/:id
router.put(
  '/:id',
  param('id').isInt(),
  validate,
  checkRole('admin', 'manager', 'operator'),
  assetController.updateAsset
);

// DELETE /api/assets/:id
router.delete(
  '/:id',
  param('id').isInt(),
  validate,
  checkRole('admin'),
  assetController.deleteAsset
);

module.exports = router;