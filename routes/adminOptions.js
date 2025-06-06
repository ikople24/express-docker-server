const express = require('express');
const router = express.Router();
const {
  getAllAdminOptions,
  createAdminOption,
  updateAdminOption,
  deleteAdminOption,
} = require('../controllers/adminOptionController');

router.get('/', getAllAdminOptions);
router.post('/', createAdminOption);
router.put('/:id', updateAdminOption);
router.delete('/:id', deleteAdminOption);

module.exports = router;