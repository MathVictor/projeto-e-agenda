const express = require('express');
const { createEvent, getEventsByUser, updateEvent, deleteEvent } = require('../models/Event');
const requireLogin = require('../middlewares/requireLogin');
const router = express.Router();

// ✅ Protege com sessão
router.use(requireLogin);

router.get('/', async (req, res) => {
  const userId = req.session.user.username;
  const events = await getEventsByUser(userId);
  res.json(events);
});

router.post('/', async (req, res) => {
  const { title, date } = req.body;
  const userId = req.session.user.username;

  if (!title || !date) {
    return res.status(400).json({ error: 'Campos obrigatórios ausentes' });
  }

  const result = await createEvent({ title, date, userId });
  res.status(201).json({ status: 'created', id: result.insertedId });
});

router.put('/:id', async (req, res) => {
  const userId = req.session.user.username;
  const result = await updateEvent(req.params.id, { ...req.body, userId });
  res.json({ status: 'updated', modified: result.modifiedCount });
});

router.delete('/:id', async (req, res) => {
  const userId = req.session.user.username;
  const result = await deleteEvent(req.params.id, userId);
  res.json({ status: 'deleted', deleted: result.deletedCount });
});

module.exports = router;
