const express = require('express');
const pool = require('../db/db');
const { protect, adminOnly, userOnly } = require('../middleware/auth');

const router = express.Router();

// GET /api/jobs/applications/mine — Must be BEFORE /:id routes
router.get('/applications/mine', protect, userOnly, async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT j.*, a.applied_at, u.name as admin_name
      FROM applications a
      JOIN jobs j ON a.job_id = j.id
      JOIN users u ON j.admin_id = u.id
      WHERE a.user_id = $1
      ORDER BY a.applied_at DESC
    `, [req.user.id]);
    res.json({ applications: result.rows });
  } catch (err) {
    console.error('Get applications error:', err);
    res.status(500).json({ message: 'Server error.' });
  }
});

// GET /api/jobs — all jobs (public)
router.get("/", async (req, res) => {
  const { page = 1, limit = 10, search = "", location = "" } = req.query;
  const pageNumber = Number(page);
  const limitNumber = Number(limit);
  const offset = (pageNumber - 1) * limitNumber;

  try {
    const result = await pool.query(
      `SELECT * FROM jobs
       WHERE position ILIKE $1 AND location ILIKE $2
       ORDER BY created_at DESC
       LIMIT $3 OFFSET $4`,
      [`%${search}%`, `%${location}%`, limitNumber, offset]
    );

    res.json({ jobs: result.rows });
  } catch (err) {
    res.status(500).json(err);
  }
});

// POST /api/jobs — admin only
router.post('/', protect, adminOnly, async (req, res) => {
  try {
    const { company_name, position, type, location, description, salary_range } = req.body;
    if (!company_name || !position || !type || !location) {
      return res.status(400).json({ message: 'Please provide all required fields.' });
    }
    if (!['Full Time', 'Part Time'].includes(type)) {
      return res.status(400).json({ message: 'Type must be Full Time or Part Time.' });
    }
    const result = await pool.query(
      `INSERT INTO jobs (company_name, position, type, location, description, salary_range, admin_id)
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [company_name, position, type, location, description || null, salary_range || null, req.user.id]
    );
    res.status(201).json({ message: 'Job created successfully.', job: result.rows[0] });
  } catch (err) {
    console.error('Create job error:', err);
    res.status(500).json({ message: 'Server error.' });
  }
});

// PUT /api/jobs/:id — admin only, own jobs
router.put('/:id', protect, adminOnly, async (req, res) => {
  try {
    const { id } = req.params;
    const { company_name, position, type, location, description, salary_range } = req.body;
    const existing = await pool.query('SELECT * FROM jobs WHERE id = $1', [id]);
    if (existing.rows.length === 0) return res.status(404).json({ message: 'Job not found.' });
    if (existing.rows[0].admin_id !== req.user.id) return res.status(403).json({ message: 'You can only edit your own jobs.' });
    const result = await pool.query(
      `UPDATE jobs
       SET company_name=$1, position=$2, type=$3, location=$4, description=$5, salary_range=$6
       WHERE id=$7 RETURNING *`,
      [company_name, position, type, location, description || null, salary_range || null, id]
    );
    res.json({ message: 'Job updated.', job: result.rows[0] });
  } catch (err) {
    console.error('Update job error:', err);
    res.status(500).json({ message: 'Server error.' });
  }
});

// DELETE /api/jobs/:id — admin only, own jobs
router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    const { id } = req.params;
    const existing = await pool.query('SELECT * FROM jobs WHERE id = $1', [id]);
    if (existing.rows.length === 0) return res.status(404).json({ message: 'Job not found.' });
    if (existing.rows[0].admin_id !== req.user.id) return res.status(403).json({ message: 'You can only delete your own jobs.' });
    await pool.query('DELETE FROM jobs WHERE id = $1', [id]);
    res.json({ message: 'Job deleted.' });
  } catch (err) {
    console.error('Delete job error:', err);
    res.status(500).json({ message: 'Server error.' });
  }
});

// POST /api/jobs/:id/apply — user only8888
router.post('/:id/apply', protect, userOnly, async (req, res) => {
  try {
    const { id } = req.params;
    const { resume_url } = req.body;

    if (!resume_url) {
      return res.status(400).json({ message: 'Resume is required.' });
    }

    const job = await pool.query('SELECT * FROM jobs WHERE id = $1', [id]);
    if (job.rows.length === 0) {
      return res.status(404).json({ message: 'Job not found.' });
    }

    const existing = await pool.query(
      'SELECT * FROM applications WHERE user_id=$1 AND job_id=$2',
      [req.user.id, id]
    );

    if (existing.rows.length > 0) {
      return res.status(400).json({ message: 'You already applied to this job.' });
    }

    const result = await pool.query(
      `INSERT INTO applications (user_id, job_id, resume_url)
       VALUES ($1, $2, $3) RETURNING *`,
      [req.user.id, id, resume_url]
    );

    res.status(201).json({
      message: 'Application submitted!',
      application: result.rows[0]
    });

  } catch (err) {
    console.error('Apply error:', err);
    res.status(500).json({ message: 'Server error.' });
  }
});

module.exports = router;
