const Action = require('../Models/Action');

async function registrarAccion(user_id, action_type, details) {
  const action_date = new Date();
  const newAction = new Action({ user_id, action_type, details, action_date });
  await newAction.save();
  return newAction;
}

module.exports = registrarAccion;