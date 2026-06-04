/**
 * Car Routes
 * Defines all car-related API endpoints
 */

const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const carController = require('../controllers/carController');
const { protect, authorize } = require('../middlewares/auth');
const { validate } = require('../middlewares/validate');

/**
 * Validation rules for creating/updating a car
 */
const carValidation = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Title is required')
    .isLength({ max: 100 })
    .withMessage('Title cannot exceed 100 characters'),
  body('brand')
    .trim()
    .notEmpty()
    .withMessage('Brand is required'),
  body('model')
    .trim()
    .notEmpty()
    .withMessage('Model is required'),
  body('year')
    .notEmpty()
    .withMessage('Year is required')
    .isInt({ min: 1900, max: new Date().getFullYear() + 1 })
    .withMessage('Please provide a valid year'),
  body('mileage')
    .notEmpty()
    .withMessage('Mileage is required')
    .isInt({ min: 0 })
    .withMessage('Mileage must be a positive number'),
  body('fuelType')
    .optional()
    .isIn(['petrol', 'diesel', 'electric', 'hybrid', 'other'])
    .withMessage('Invalid fuel type'),
  body('transmission')
    .optional()
    .isIn(['automatic', 'manual', 'cvt', 'semi-automatic'])
    .withMessage('Invalid transmission type'),
  body('description')
    .optional()
    .isLength({ max: 2000 })
    .withMessage('Description cannot exceed 2000 characters'),
  body('images')
    .optional()
    .isArray()
    .withMessage('Images must be an array'),
  body('images.*.url')
    .optional()
    .isURL()
    .withMessage('Please provide valid image URLs'),
];

/**
 * Validation rules for updating (partial)
 */
const updateCarValidation = [
  body('title')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Title cannot exceed 100 characters'),
  body('year')
    .optional()
    .isInt({ min: 1900, max: new Date().getFullYear() + 1 })
    .withMessage('Please provide a valid year'),
  body('mileage')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Mileage must be a positive number'),
];

// Public routes
router.get('/', carController.getAllCars);
router.get('/stats', protect, authorize('admin'), carController.getCarStats);
router.get('/my-cars', protect, carController.getMyCars);
router.get('/:id', carController.getCarById);

// Protected routes
router.post('/', protect, carValidation, validate, carController.createCar);
router.put('/:id', protect, updateCarValidation, validate, carController.updateCar);
router.delete('/:id', protect, carController.deleteCar);

// Admin routes
router.put('/:id/verify', protect, authorize('admin'), carController.verifyCar);

module.exports = router;
