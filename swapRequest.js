const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const User = require('./user');
const Event = require('./event');

const SwapRequest = sequelize.define('SwapRequest', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  status: { type: DataTypes.STRING, allowNull: false, defaultValue: 'PENDING' } // PENDING, ACCEPTED, REJECTED, CANCELLED
});

SwapRequest.belongsTo(User, { as: 'fromUser', foreignKey: 'fromUserId' });
SwapRequest.belongsTo(User, { as: 'toUser', foreignKey: 'toUserId' });
SwapRequest.belongsTo(Event, { as: 'mySlot', foreignKey: 'mySlotId' });
SwapRequest.belongsTo(Event, { as: 'theirSlot', foreignKey: 'theirSlotId' });

module.exports = SwapRequest;
