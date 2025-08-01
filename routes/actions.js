const express = require('express');
const router = express.Router();
const Action = require('../Models/Action');

// Registrar una acción de usuario
router.post('/actions', async (req, res) => {
  const { usuario_id, accion, detalles } = req.body;
  try {
    const newAction = new Action({ usuario_id, accion, detalles });
    await newAction.save();
    res.status(201).json({ success: true, action_id: newAction._id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Error en el servidor' });
  }
});

module.exports = router;