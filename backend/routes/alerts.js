import express from 'express';
import { Alert, Village } from '../models/index.js';
import { authenticate, authorize } from '../middleware/auth.js';
import { generateAutomaticAlerts, resolveImprovedAlerts } from '../services/alertGenerator.js';

const router = express.Router();

router.post('/', authenticate, authorize('admin'), async (req, res, next) => {
  try {
    const alert = await Alert.create(req.body);
    res.status(201).json(alert);
  } catch (error) {
    next(error);
  }
});

router.get('/', authenticate, async (req, res, next) => {
  try {
    const { district, severity, resolved } = req.query;
    
    const whereClause = {};
    if (severity) whereClause.severity = severity;
    if (resolved !== undefined) whereClause.is_resolved = resolved === 'true';

    const alerts = await Alert.findAll({
      where: whereClause,
      include: [{ 
        model: Village, 
        attributes: ['name', 'district'],
        ...(district && { where: { district } })
      }],
      order: [
        ['is_resolved', 'ASC'],  // Unresolved first
        ['severity', 'DESC'],     // Critical first
        ['createdAt', 'DESC']     // Newest first
      ]
    });
    
    res.json(alerts);
  } catch (error) {
    next(error);
  }
});

router.get('/active', authenticate, async (req, res, next) => {
  try {
    const alerts = await Alert.findAll({
      where: { is_resolved: false },
      include: [{ model: Village, attributes: ['name', 'district'] }],
      order: [['createdAt', 'DESC']]
    });
    res.json(alerts);
  } catch (error) {
    next(error);
  }
});

// Local user: get alerts for their village only
router.get('/my-village', authenticate, async (req, res, next) => {
  try {
    const village_id = req.user.village_id;
    if (!village_id) {
      return res.status(403).json({ error: 'No village linked to this user' });
    }
    const alerts = await Alert.findAll({
      where: { village_id },
      include: [{ model: Village, attributes: ['name', 'district'] }],
      order: [['createdAt', 'DESC']]
    });
    res.json(alerts);
  } catch (error) {
    next(error);
  }
});

// Get unique districts for filtering
router.get('/districts', authenticate, async (req, res, next) => {
  try {
    const districts = await Village.findAll({
      attributes: [[Village.sequelize.fn('DISTINCT', Village.sequelize.col('district')), 'district']],
      raw: true
    });
    res.json(districts.map(d => d.district));
  } catch (error) {
    next(error);
  }
});

router.put('/:id/resolve', authenticate, authorize('admin'), async (req, res, next) => {
  try {
    const alert = await Alert.findByPk(req.params.id);
    if (!alert) {
      return res.status(404).json({ error: 'Alert not found' });
    }
    await alert.update({ is_resolved: true });
    res.json(alert);
  } catch (error) {
    next(error);
  }
});

router.delete('/:id', authenticate, authorize('admin'), async (req, res, next) => {
  try {
    const alert = await Alert.findByPk(req.params.id);
    if (!alert) {
      return res.status(404).json({ error: 'Alert not found' });
    }
    await alert.destroy();
    res.json({ message: 'Alert deleted successfully' });
  } catch (error) {
    next(error);
  }
});

// AUTOMATIC ALERT GENERATION - Admin only
router.post('/generate', authenticate, authorize('admin'), async (req, res, next) => {
  try {
    console.log('🤖 Manual alert generation triggered by admin');
    const result = await generateAutomaticAlerts();
    await resolveImprovedAlerts();
    
    res.json({
      success: true,
      message: 'Automatic alert generation completed',
      created: result.created,
      updated: result.updated
    });
  } catch (error) {
    next(error);
  }
});

// USER-SUBMITTED ALERT - Local users can submit alerts
router.post('/submit', authenticate, async (req, res, next) => {
  try {
    const { title, description, severity } = req.body;
    const village_id = req.user.village_id;

    if (!village_id) {
      return res.status(403).json({ error: 'No village linked to this user' });
    }

    if (!title || !description) {
      return res.status(400).json({ error: 'Title and description are required' });
    }

    // Create user-submitted alert
    const alert = await Alert.create({
      village_id,
      severity: severity || 'alert',
      message: `📝 User Report: ${title} - ${description}`,
      wsi_score: null,
      is_resolved: false,
      user_submitted: true,
      submitted_by: req.user.id
    });

    const alertWithVillage = await Alert.findByPk(alert.id, {
      include: [{ model: Village, attributes: ['name', 'district'] }]
    });

    res.status(201).json({
      success: true,
      message: 'Alert submitted successfully',
      alert: alertWithVillage
    });
  } catch (error) {
    next(error);
  }
});

export default router;
