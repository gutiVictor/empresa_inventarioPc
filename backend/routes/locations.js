const express = require('express');
const router = express.Router();
const locationController = require('../controllers/locationController');
const { authMiddleware, checkRole } = require('../middlewares/authMiddleware');
const { param, body } = require('express-validator');
const validate = require('../middlewares/validate');

router.use(authMiddleware);

// GET /api/locations
router.get('/', locationController.getAll);

// GET /api/locations/:id
router.get('/:id', param('id').isInt(), validate, locationController.getById);

// POST /api/locations
router.post(
  '/',
  checkRole('admin', 'manager'),
  [
    body('name').notEmpty().trim().isLength({ max: 100 }),
    body('code').notEmpty().trim().isLength({ max: 20 }),
    body('city').notEmpty().trim().isLength({ max: 100 }),
    body('country').optional().isLength({ max: 2 }),
    body('address').optional().trim().isLength({ max: 255 }),
    validate
  ],
  locationController.create
);

// PUT /api/locations/:id
router.put(
  '/:id',
  param('id').isInt(),
  validate,
  checkRole('admin', 'manager'),
  [
    body('name').optional().trim().isLength({ max: 100 }),
    body('code').optional().trim().isLength({ max: 20 }),
    body('city').optional().trim().isLength({ max: 100 }),
    body('country').optional().isLength({ max: 2 }),
    body('address').optional().trim().isLength({ max: 255 }),
    validate
  ],
  locationController.updateLocation
);

// DELETE /api/locations/:id
router.delete(
  '/:id',
  param('id').isInt(),
  validate,
  checkRole('admin'),
  locationController.deleteLocation
);

module.exports = router;