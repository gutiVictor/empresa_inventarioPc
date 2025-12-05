const express = require('express');
const router = express.Router();
const licenseController = require('../controllers/licenseController');
const { authMiddleware, checkRole } = require('../middlewares/authMiddleware');
const { param, body } = require('express-validator');
const validate = require('../middlewares/validate');

router.use(authMiddleware);

// Rutas específicas (antes de parámetros)
router.get('/assignments', checkRole('admin', 'manager'), licenseController.getAssignments);

router.post(
  '/assign',
  checkRole('admin', 'manager'),
  [
    body('license_id').isInt(),
    body('asset_id').optional().isInt(),
    body('user_id').optional().isInt(),
    // Validar que solo uno de los dos esté presente
    body().custom((value) => {
      if (!value.asset_id && !value.user_id) throw new Error('Debe asignar a un activo o a un usuario');
      if (value.asset_id && value.user_id) throw new Error('Solo puede asignar a un activo o a un usuario, no ambos');
      return true;
    }),
    validate
  ],
  licenseController.assignLicense
);

// CRUD Licencias
router.get('/', licenseController.getAllLicenses);

router.get('/:id', param('id').isInt(), validate, licenseController.getLicenseById);

router.post(
  '/',
  checkRole('admin', 'manager'),
  [
    body('name').notEmpty().trim().isLength({ max: 200 }),
    body('type').isIn(['volume', 'single', 'subscription', 'free']),
    body('seats_total').optional().isInt({ min: 1 }),
    body('seats_used').optional().isInt({ min: 0 }),
    body('cost').optional().isFloat({ min: 0 }),
    body('supplier_id').optional().isInt(),
    validate
  ],
  licenseController.createLicense
);

router.put(
  '/:id',
  param('id').isInt(),
  validate,
  checkRole('admin', 'manager'),
  [
    body('name').optional().trim().isLength({ max: 200 }),
    body('type').optional().isIn(['volume', 'single', 'subscription', 'free']),
    body('seats_total').optional().isInt({ min: 1 }),
    body('seats_used').optional().isInt({ min: 0 }),
    body('cost').optional().isFloat({ min: 0 }),
    body('supplier_id').optional().isInt(),
    validate
  ],
  licenseController.updateLicense
);

router.delete(
  '/:id',
  param('id').isInt(),
  validate,
  checkRole('admin'),
  licenseController.deleteLicense
);

module.exports = router;