const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const User = require('./user');

const Event = sequelize.define('Event', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  title: { type: DataTypes.STRING, allowNull: false },
  startTime: { type: DataTypes.STRING, allowNull: false },
  endTime: { type: DataTypes.STRING, allowNull: false },
  status: { type: DataTypes.STRING, allowNull: false, defaultValue: 'BUSY' } // BUSY, SWAPPABLE, SWAP_PENDING
});

Event.belongsTo(User, { as: 'owner', foreignKey: 'ownerId' });
User.hasMany(Event, { foreignKey: 'ownerId' });

module.exports = Event;
