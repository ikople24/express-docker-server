const getDbConnection = require('../utils/dbManager');
const adminOptionSchema = require('../models/AdminOption');

exports.getAllAdminOptions = async (req, res) => {
  try {
    const appId = req.headers['x-app-id'];
    const conn = await getDbConnection(appId);
    const AdminOption = conn.model('AdminOption', adminOptionSchema);
    const options = await AdminOption.find();
    res.status(200).json({ success: true, data: options });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.createAdminOption = async (req, res) => {
  try {
    const appId = req.headers['x-app-id'];
    const conn = await getDbConnection(appId);
    const AdminOption = conn.model('AdminOption', adminOptionSchema);
    const option = new AdminOption(req.body);
    await option.save();
    res.status(201).json({ success: true, data: option });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

exports.updateAdminOption = async (req, res) => {
  try {
    const appId = req.headers['x-app-id'];
    const conn = await getDbConnection(appId);
    const AdminOption = conn.model('AdminOption', adminOptionSchema);
    const updated = await AdminOption.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json({ success: true, data: updated });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

exports.deleteAdminOption = async (req, res) => {
  try {
    const appId = req.headers['x-app-id'];
    const conn = await getDbConnection(appId);
    const AdminOption = conn.model('AdminOption', adminOptionSchema);
    await AdminOption.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: 'Deleted' });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};