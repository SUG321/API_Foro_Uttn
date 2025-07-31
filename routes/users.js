const express = require('express');
const router = express.Router();
const Post = require('../Models/Post');
const Response = require('../Models/Response');
const Action = require('../Models/Action');

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

module.exports = router;