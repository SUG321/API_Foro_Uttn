const Action = require('../Models/Action');

async function registrarAccion(user_id, action_type, details, objective_id = null, objective_type = null) {
  const action_date = new Date();
  const newAction = new Action({ user_id, action_type, details, action_date });

  if (objective_id && objective_type) {
    newAction.objective_id = objective_id;
    newAction.objective_type = objective_type;
  }

  await newAction.save();
  return newAction;
}

module.exports = registrarAccion;