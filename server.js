const express = require('express');
const cors = require('cors');
const sequelize = require('./config/db');
const User = require('./models/user');
const Event = require('./models/event');
const SwapRequest = require('./models/swapRequest');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/auth', require('./routes/auth'));
app.use('/api/events', require('./routes/events'));
app.use('/api/swaps', require('./routes/swaps'));

const PORT = process.env.PORT || 4000;

async function start() {
  try {
    await sequelize.sync({ alter: true });
    app.listen(PORT, () => console.log(`Backend running on http://localhost:${PORT}`));
  } catch (err) {
    console.error('Failed to start', err);
  }
}

start();
