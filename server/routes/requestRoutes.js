const express = require('express');
const router = express.Router();
const {
  getAllRequests,
  getRequestById,
  createRequest,
  updateRequestStatus,
  deleteRequest,
  getRequestStats
} = require('../controllers/requestController');

// Summary statistics
router.get('/stats', getRequestStats);

// Collection routes
router.get('/', getAllRequests);
router.post('/', createRequest);

// Item routes
router.get('/:id', getRequestById);
router.patch('/:id/status', updateRequestStatus);
router.delete('/:id', deleteRequest);

module.exports = router;
