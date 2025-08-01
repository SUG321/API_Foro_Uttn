const express = require('express');
const router = express.Router();
const Post = require('../Models/Post');
const Response = require('../Models/Response');
const Action = require('../Models/Action');
const User = require('../Models/User');

// Obtener todas las preguntas realizadas por un usuario
router.get('/users/:userId/posts', async (req, res) => {
  const { userId } = req.params;
  try {
    const posts = await Post.find({ usuario_id: userId });
    res.json(posts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Error en el servidor' });
  }
});

// Obtener todas las preguntas en las que el usuario ha respondido
router.get('/users/:userId/answered-posts', async (req, res) => {
  const { userId } = req.params;
  try {
    const responses = await Response.find({ usuario_id: userId });
    const postIds = [...new Set(responses.map(r => r.pregunta_id.toString()))];
    const posts = await Post.find({ _id: { $in: postIds } });
    res.json(posts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Error en el servidor' });
  }
});

// --------------------- CRUD de Usuarios ---------------------

// Listar todos los usuarios
router.get('/users', async (req, res) => {
  try {
    const users = await User.find();
    
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Error en el servidor' });
  }
});

// Obtener un usuario por ID
router.get('/users/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'Usuario no encontrado' });
    }
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Error en el servidor' });
  }
});

// Crear un nuevo usuario
router.post('/users', async (req, res) => {
  try {
    const newUser = new User(req.body);
    await newUser.save();
    res.status(201).json({ success: true, user_id: newUser._id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Error en el servidor' });
  }
});

// Actualizar un usuario existente
router.put('/users/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const updated = await User.findByIdAndUpdate(id, req.body, { new: true });
    if (!updated) {
      return res.status(404).json({ success: false, message: 'Usuario no encontrado' });
    }
    res.json({ success: true, user: updated });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Error en el servidor' });
  }
});

// Eliminar un usuario
router.delete('/users/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const deleted = await User.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Usuario no encontrado' });
    }
    res.json({ success: true, message: 'Usuario eliminado' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Error en el servidor' });
  }
});

module.exports = router;