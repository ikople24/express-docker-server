const getDbConnection = require('../utils/dbManager');
const assignmentSchema = require('../models/Assignment');

exports.createAssignment = async (req, res) => {
  try {
    const appId = req.headers['x-app-id'];
    if (!appId) return res.status(400).json({ message: "Missing app-id" });

    const conn = await getDbConnection(appId);
    const Assignment = conn.model('Assignment', assignmentSchema);

    const { complaintId, userId, solution, solutionImages, completedAt, note } = req.body;
    const newAssignment = new Assignment({
      complaintId,
      userId,
      assignedAt: new Date(),
      solution: Array.isArray(solution) ? solution : [solution],
      solutionImages: solutionImages || [],
      completedAt: completedAt || null,
      note: note || '',
    });
    await newAssignment.save();
    res.status(201).json({ message: 'Assignment created successfully', assignment: newAssignment });
  } catch (error) {
    console.error('Error creating assignment:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};