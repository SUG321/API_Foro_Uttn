const mongoose = require('mongoose');

const ActionSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  action_type: { type: Number, required: true },
  details: { type: String },
  action_date: { type: Date }
});

module.exports = mongoose.model('Action', ActionSchema, 'actions');
