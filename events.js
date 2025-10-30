const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Event = require('../models/event');

// Get my events
router.get('/', auth, async (req, res) => {
  const events = await Event.findAll({ where: { ownerId: req.user.id } });
  res.json(events);
});

// Create event
router.post('/', auth, async (req, res) => {
  const { title, startTime, endTime, status } = req.body;
  if (!title || !startTime || !endTime) return res.status(400).json({ error: 'Missing fields' });
  try {
    const ev = await Event.create({ title, startTime, endTime, status: status || 'BUSY', ownerId: req.user.id });
    res.json(ev);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error creating event' });
  }
});

// Update event (only owner)
router.put('/:id', auth, async (req, res) => {
  const { id } = req.params;
  const event = await Event.findByPk(id);
  if (!event) return res.status(404).json({ error: 'Not found' });
  if (event.ownerId !== req.user.id) return res.status(403).json({ error: 'Forbidden' });
  const { title, startTime, endTime, status } = req.body;
  if (title) event.title = title;
  if (startTime) event.startTime = startTime;
  if (endTime) event.endTime = endTime;
  if (status) event.status = status;
  await event.save();
  res.json(event);
});

module.exports = router;
