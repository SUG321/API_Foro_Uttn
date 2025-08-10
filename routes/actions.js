const express = require('express');
const router = express.Router();

const Action = require('../Models/Action');
const User = require('../Models/User');
const Post = require('../Models/Post');
const Response = require('../Models/Response');

const registrarAccion = require('../Logic/registrarAccion');
const { DateMX, TimeMX } = require('../Logic/dateFormatting');

const mongoose = require('mongoose');

// Ver todas las acciones de usuarios o uno en específico
router.get('/actions', async (req, res) => {
  const { user_id } = req.query;
  try {
    const filter = user_id ? { user_id: new mongoose.Types.ObjectId(user_id) } : {};
    const actions = await Action.find(filter);

    const formattedActions = await Promise.all(actions.map(async (action) => {
      const user = await User.findById(action.user_id);
      const date = new Date(action.action_date);
      
      let actionData = {
        action_user: user.apodo,
        action_user_id: user._id,
        action: action.action_type,
        details: action.details,
        date: DateMX(date),
        hour: TimeMX(date)
      };

      if (action.objective_type) {
        if (action.objective_type === "Post") {
          const post = await Post.findById(action.objective_id);
          actionData.post_id = post._id;
          actionData.titulo = post.titulo;
        }
        if (action.objective_type === "User") {
          const userObjective = await User.findById(action.objective_id); 
          actionData.user_id = userObjective._id;
          actionData.apodo = userObjective.apodo;
        }
        if (action.objective_type === "Response") {
          const response = await Response.findById(action.objective_id);
          actionData.response_id = response._id;
          actionData.response_content = response.contenido;
        }
      }

      return actionData; 
    }));
    
    res.json(formattedActions);
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Error en el servidor' });
  }
});



// Registrar una acción de usuario
router.post('/actions', async (req, res) => {
  const { user_id, action_type, details, objective_id, objective_type } = req.body;
  try {
    await registrarAccion(user_id, action_type, details, objective_id, objective_type);
    res.status(201).json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Error en el servidor' });
  }
});

module.exports = router;