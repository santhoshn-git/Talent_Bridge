const express = require('express');
const pool = require('../db/db');
const { protect, adminOnly } = require('../middleware/auth');

const router = express.Router();

// GET /api/applications - admin can view applications for their jobs
router.get('/', protect, adminOnly, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT
         a.id,
         a.applied_at,
         a.resume_url,
         j.id AS job_id,
         j.position,
         j.company_name,
         j.location,
         j.type,
         u.id AS user_id,
         u.name AS applicant_name,
         u.email AS applicant_email
       FROM applications a
       JOIN jobs j ON a.job_id = j.id
       JOIN users u ON a.user_id = u.id
       WHERE j.admin_id = $1
       ORDER BY a.applied_at DESC`,
      [req.user.id]
    );

    res.json({ applications: result.rows });
  } catch (err) {
    console.error('Get all applications error:', err);
    res.status(500).json({ message: 'Server error.' });
  }
});

module.exports = router;
