exports.createAssignment = async (req, res) => {
  try {
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