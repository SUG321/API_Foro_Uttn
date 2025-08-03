const express = require('express');
const router = express.Router();
const Action = require('../Models/Action');

const mongoose = require('mongoose');
const User = require('../Models/User');

// Ver todas las acciones de usuarios o uno en específico
router.get('/actions', async (req, res) => {
  const { user_id } = req.query;
  try {
    const filter = user_id ? { user_id: new mongoose.Types.ObjectId(user_id) } : {};
    const actions = await Action.find(filter);

    const formattedActions = await Promise.all(actions.map(async (action) => {
      const user = await User.findById(action.user_id);
      const date = new Date(action.action_date);

      // Formateo de fecha
      const formattedDateYears = date.toLocaleDateString('es-MX', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        timeZone: 'America/Mexico_City'
      });

      const formattedDateHours = date.toLocaleTimeString('es-ES', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
        timeZone: 'America/Mexico_City'
      });

      return {
        action_user: user.apodo,
        action: action.action_type,
        details: action.details,
        date: formattedDateYears,
        hour: formattedDateHours
      };
    }));

    res.json(formattedActions);
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Error en el servidor' });
  }
});


// Registrar una acción de usuario
router.post('/actions', async (req, res) => {
  const { user_id, action_type, details } = req.body;
  try {
    const action_date = new Date();
    console.log(action_date);
    const newAction = new Action({ user_id, action_type, details, action_date });
    await newAction.save();
    res.status(201).json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Error en el servidor' });
  }
});

module.exports = router;