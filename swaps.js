const express = require('express');
const router = express.Router();
const sequelize = require('../config/db');
const auth = require('../middleware/auth');
const Event = require('../models/event');
const SwapRequest = require('../models/swapRequest');

// Get all swappable slots from other users
router.get('/available', auth, async (req, res) => {
  const rows = await Event.findAll({
    where: { status: 'SWAPPABLE' },
  });
  // filter out my own
  const others = rows.filter(r => r.ownerId !== req.user.id);
  res.json(others);
});

// Create swap request
router.post('/request', auth, async (req, res) => {
  const { mySlotId, theirSlotId } = req.body;
  if (!mySlotId || !theirSlotId) return res.status(400).json({ error: 'Missing slot ids' });

  const t = await sequelize.transaction();
  try {
    // lock rows
    const mySlot = await Event.findByPk(mySlotId, { transaction: t, lock: t.LOCK.UPDATE });
    const theirSlot = await Event.findByPk(theirSlotId, { transaction: t, lock: t.LOCK.UPDATE });
    if (!mySlot || !theirSlot) {
      await t.rollback();
      return res.status(404).json({ error: 'Slot not found' });
    }
    if (mySlot.ownerId !== req.user.id) {
      await t.rollback();
      return res.status(403).json({ error: 'Not owner of mySlot' });
    }
    if (mySlot.status !== 'SWAPPABLE' || theirSlot.status !== 'SWAPPABLE') {
      await t.rollback();
      return res.status(409).json({ error: 'One of the slots is not swappable' });
    }
    if (mySlot.ownerId === theirSlot.ownerId) {
      await t.rollback();
      return res.status(400).json({ error: 'Cannot swap with yourself' });
    }

    const reqRow = await SwapRequest.create({ fromUserId: req.user.id, toUserId: theirSlot.ownerId, mySlotId, theirSlotId }, { transaction: t });

    mySlot.status = 'SWAP_PENDING';
    theirSlot.status = 'SWAP_PENDING';
    await mySlot.save({ transaction: t });
    await theirSlot.save({ transaction: t });

    await t.commit();
    res.json(reqRow);
  } catch (err) {
    console.error(err);
    await t.rollback();
    res.status(500).json({ error: 'Error creating swap request' });
  }
});

// Incoming / outgoing lists
router.get('/incoming', auth, async (req, res) => {
  const incoming = await SwapRequest.findAll({ where: { toUserId: req.user.id } });
  res.json(incoming);
});
router.get('/outgoing', auth, async (req, res) => {
  const outgoing = await SwapRequest.findAll({ where: { fromUserId: req.user.id } });
  res.json(outgoing);
});

// Respond to swap request
router.post('/respond/:id', auth, async (req, res) => {
  const { id } = req.params;
  const { accept } = req.body;
  const t = await sequelize.transaction();
  try {
    const reqRow = await SwapRequest.findByPk(id, { transaction: t, lock: t.LOCK.UPDATE });
    if (!reqRow) { await t.rollback(); return res.status(404).json({ error: 'Request not found' }); }
    if (reqRow.toUserId !== req.user.id) { await t.rollback(); return res.status(403).json({ error: 'Not authorized' }); }

    const mySlot = await Event.findByPk(reqRow.mySlotId, { transaction: t, lock: t.LOCK.UPDATE });
    const theirSlot = await Event.findByPk(reqRow.theirSlotId, { transaction: t, lock: t.LOCK.UPDATE });

    if (!accept) {
      reqRow.status = 'REJECTED';
      await reqRow.save({ transaction: t });
      if (mySlot) { mySlot.status = 'SWAPPABLE'; await mySlot.save({ transaction: t }); }
      if (theirSlot) { theirSlot.status = 'SWAPPABLE'; await theirSlot.save({ transaction: t }); }
      await t.commit();
      return res.json({ result: 'rejected' });
    }

    // Accept path — verify statuses
    if (!mySlot || !theirSlot) { await t.rollback(); return res.status(404).json({ error: 'One of the slots disappeared' }); }
    if (mySlot.status !== 'SWAP_PENDING' || theirSlot.status !== 'SWAP_PENDING') { await t.rollback(); return res.status(409).json({ error: 'Slot states invalid' }); }

    // swap ownership
    const ownerA = mySlot.ownerId;
    const ownerB = theirSlot.ownerId;
    mySlot.ownerId = ownerB;
    theirSlot.ownerId = ownerA;
    mySlot.status = 'BUSY';
    theirSlot.status = 'BUSY';

    await mySlot.save({ transaction: t });
    await theirSlot.save({ transaction: t });

    reqRow.status = 'ACCEPTED';
    await reqRow.save({ transaction: t });

    await t.commit();
    res.json({ result: 'accepted' });
  } catch (err) {
    console.error(err);
    await t.rollback();
    res.status(500).json({ error: 'Error responding to request' });
  }
});

module.exports = router;
