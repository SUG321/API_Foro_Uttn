const express = require('express');
const router = express.Router();

const Post = require('../Models/Post');
const Response = require('../Models/Response');
const Action = require('../Models/Action');
const User = require('../Models/User');

const registrarAccion = require('../Logic/registrarAccion');
const { DateMX, TimeMX } = require('../Logic/dateFormatting');

// Obtener todas las preguntas realizadas por un usuario
router.get('/users/:userId/posts', async (req, res) => {
  const { userId } = req.params;
  try {
    const posts = await Post.find({ usuario_id: userId });
    const user = await User.findById(userId);

    const postDetails = posts.map(post => {
      const date = new Date(post.fecha_publicacion);
      return {
        post_id: post._id,
        apodo: user ? user.apodo : 'Desconocido',
        titulo: post.titulo,
        contenido: post.contenido,
        pub_date: DateMX(date),
        pub_time: TimeMX(date),
        respuestas: Array.isArray(post.respuestas) ? post.respuestas.length : 0,
        mensaje_admin: post.mensaje_admin
      };
    });

    res.json(postDetails);

  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Error en el servidor' });
  }
});

// Obtener todas las respuestas del usuario
router.get('/users/:userId/answered-posts', async (req, res) => {
  const { userId } = req.params;
  try {
    const responses = await Response.find({ usuario_id: userId });
    const user = await User.findById(userId);

    const responseDetails = responses.map(resp => {
      const date = new Date(resp.fecha_respuesta);
      return {
        pregunta_id: resp.pregunta_id,
        respuesta_id: resp._id,
        contenido: resp.contenido,
        res_date: DateMX(date),
        res_time: TimeMX(date),
        votos: resp.votos,
        usuario: {
          id: user ? user._id : null,
          apodo: user ? user.apodo : 'Desconocido',
          nombre: user ? user.nombre : undefined,
          foto_perfil: user && user.perfil ? user.perfil.foto_perfil : undefined
        }
      };
    });

    res.json(responseDetails);
    
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
    
    const formUsers = await Promise.all(users.map(async (user) => {
      return {
        user_id: user._id,
        apodo: user.apodo,
        admin: user.admin,
        foto_perfil: user.perfil ? user.perfil.foto_perfil : "0"
      }
    }));

    res.json(formUsers);

  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Error en el servidor' });
  }
});

// Obtener un usuario por ID
router.get('/users/:id', async (req, res) => {
  const { id } = req.params;
  try {
    // Buscar el usuario por su ID
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ success: false, message: 'Usuario no encontrado' });
    }

    const date = new Date(user.fecha_registro);

    // Preparar la respuesta con solo los campos necesarios
    const response = {
      _id: user._id,
      nombre: user.nombre,
      email: user.email,
      regDate: DateMX(date),
      regTime: TimeMX(date),
      apodo: user.apodo,
      admin: user.admin,
      perfil: user.perfil ? {
        biografia: user.perfil.biografia,
        foto_perfil: user.perfil.foto_perfil
      } : null
    };

    res.json(response);

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
    registrarAccion(id, 10, "Editó su perfil", id, "User");
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
    registrarAccion(id, 23, "Eliminó su cuenta", id, "User");

  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Error en el servidor' });
  }
});

module.exports = router;