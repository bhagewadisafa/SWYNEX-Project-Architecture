const Request = require('../models/Request');

// In-memory starter data so the student can run and test immediately
let starterRequests = [
  {
    _id: 'req_101',
    title: 'Lab 3 Compiler & Node.js Dependency Error',
    description: 'Workstation 14 in Lab 3 cannot reach the local npm registry during practical sessions.',
    category: 'IT & Lab Facilities',
    priority: 'High',
    status: 'In Progress',
    studentName: 'Rahul Sharma (MCA Student)',
    adminRemarks: 'Lab technician assigned to reconfigure local DNS and package mirrors.',
    createdAt: new Date(Date.now() - 3600000 * 24).toISOString()
  },
  {
    _id: 'req_102',
    title: 'Bonafide Certificate for Education Loan',
    description: 'Submitted bonafide certificate application for state bank student loan scheme.',
    category: 'Administrative',
    priority: 'Medium',
    status: 'Pending',
    studentName: 'Priya Patel (MCA Student)',
    adminRemarks: 'Application received, awaiting HOD signature.',
    createdAt: new Date(Date.now() - 3600000 * 12).toISOString()
  },
  {
    _id: 'req_103',
    title: 'Library Overdue Book Fee Reconciliation',
    description: 'Book was returned within due date slip, but online portal still lists 50 INR fine.',
    category: 'Library',
    priority: 'Low',
    status: 'Resolved',
    studentName: 'Amit Verma (MCA Student)',
    adminRemarks: 'Physical barcode verification completed. Fine balance waived.',
    createdAt: new Date(Date.now() - 3600000 * 48).toISOString()
  }
];

/**
 * @desc    Fetch all requests (with optional status & category filter)
 * @route   GET /api/requests
 * @access  Protected
 */
exports.getAllRequests = async (req, res) => {
  try {
    const { status, category } = req.query;

    // Check MongoDB if connected
    try {
      const query = {};
      if (status && status !== 'All') query.status = status;
      if (category && category !== 'All') query.category = category;

      const dbRequests = await Request.find(query).sort({ createdAt: -1 });
      if (dbRequests && dbRequests.length > 0) {
        return res.status(200).json({
          success: true,
          count: dbRequests.length,
          data: dbRequests
        });
      }
    } catch (dbErr) {
      // Fallback to in-memory starter data
    }

    let filtered = [...starterRequests];
    if (status && status !== 'All') {
      filtered = filtered.filter(r => r.status.toLowerCase() === status.toLowerCase());
    }
    if (category && category !== 'All') {
      filtered = filtered.filter(r => r.category.toLowerCase() === category.toLowerCase());
    }

    return res.status(200).json({
      success: true,
      count: filtered.length,
      data: filtered
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve requests.',
      error: err.message
    });
  }
};

/**
 * @desc    Get single request details
 * @route   GET /api/requests/:id
 * @access  Protected
 */
exports.getRequestById = async (req, res) => {
  try {
    const { id } = req.params;

    try {
      const doc = await Request.findById(id);
      if (doc) {
        return res.status(200).json({ success: true, data: doc });
      }
    } catch (e) {}

    const item = starterRequests.find(r => r._id === id);
    if (!item) {
      return res.status(404).json({ success: false, message: 'Request not found.' });
    }

    return res.status(200).json({ success: true, data: item });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
};

/**
 * @desc    Create a new service request
 * @route   POST /api/requests
 * @access  Protected (Student)
 */
exports.createRequest = async (req, res) => {
  try {
    const { title, description, category, priority, studentName } = req.body;

    if (!title || !description || !category) {
      return res.status(400).json({
        success: false,
        message: 'Please provide request title, description, and category.'
      });
    }

    const newTicket = {
      _id: 'req_' + Date.now(),
      title,
      description,
      category,
      priority: priority || 'Medium',
      status: 'Pending',
      studentName: studentName || 'Rahul Sharma (Student)',
      adminRemarks: 'Request queued for department review.',
      createdAt: new Date().toISOString()
    };

    // Attempt MongoDB save if available
    try {
      const dbDoc = await Request.create({
        title,
        description,
        category,
        priority: priority || 'Medium',
        status: 'Pending',
        studentName: newTicket.studentName,
        adminRemarks: newTicket.adminRemarks
      });
      newTicket._id = dbDoc._id;
    } catch (e) {
      // In-memory fallback
      starterRequests.unshift(newTicket);
    }

    return res.status(201).json({
      success: true,
      message: 'Service request submitted successfully!',
      data: newTicket
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: 'Failed to create request.',
      error: err.message
    });
  }
};

/**
 * @desc    Update request status and resolution remarks
 * @route   PATCH /api/requests/:id/status
 * @access  Protected (Admin)
 */
exports.updateRequestStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, adminRemarks } = req.body;

    if (!status) {
      return res.status(400).json({
        success: false,
        message: 'Please provide the new status value.'
      });
    }

    // Attempt DB update
    try {
      const updated = await Request.findByIdAndUpdate(
        id,
        { status, adminRemarks: adminRemarks || '' },
        { new: true }
      );
      if (updated) {
        return res.status(200).json({
          success: true,
          message: 'Status updated successfully.',
          data: updated
        });
      }
    } catch (e) {}

    const index = starterRequests.findIndex(r => r._id === id);
    if (index === -1) {
      return res.status(404).json({
        success: false,
        message: 'Request not found.'
      });
    }

    starterRequests[index].status = status;
    if (adminRemarks !== undefined) {
      starterRequests[index].adminRemarks = adminRemarks;
    }

    return res.status(200).json({
      success: true,
      message: 'Status updated successfully.',
      data: starterRequests[index]
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: 'Failed to update request status.',
      error: err.message
    });
  }
};

/**
 * @desc    Delete a request
 * @route   DELETE /api/requests/:id
 * @access  Protected
 */
exports.deleteRequest = async (req, res) => {
  try {
    const { id } = req.params;

    try {
      await Request.findByIdAndDelete(id);
    } catch (e) {}

    starterRequests = starterRequests.filter(r => r._id !== id);

    return res.status(200).json({
      success: true,
      message: 'Service request deleted successfully.'
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: 'Failed to delete request.',
      error: err.message
    });
  }
};

/**
 * @desc    Get counts & statistics for dashboard
 * @route   GET /api/requests/stats
 * @access  Protected
 */
exports.getRequestStats = async (req, res) => {
  try {
    let all = [...starterRequests];
    try {
      const dbAll = await Request.find();
      if (dbAll && dbAll.length > 0) all = dbAll;
    } catch (e) {}

    const total = all.length;
    const pending = all.filter(r => r.status === 'Pending').length;
    const inProgress = all.filter(r => r.status === 'In Progress' || r.status === 'Under Review').length;
    const resolved = all.filter(r => r.status === 'Resolved').length;

    return res.status(200).json({
      success: true,
      stats: { total, pending, inProgress, resolved }
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: err.message
    });
  }
};
