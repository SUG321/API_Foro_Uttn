const express = require('express');
const router = express.Router();

const Post = require('../Models/Post');
const User = require('../Models/User');

const { DateMX, TimeMX } = require('../Logic/dateFormatting');
const registrarAccion = require('../Logic/registrarAccion');

// Obtener todos los posts aceptados con información del usuario basica
router.get('/', async (req, res) => {
    try {
        const posts = await Post.find({ verified: true });

        const postDetails = await Promise.all(posts.map(async (post) => {
            const user = await User.findById(post.usuario_id);
            const date = new Date(post.fecha_publicacion);

            return {
                post_id: post._id,
                apodo: user ? user.apodo : 'Desconocido',
                titulo: post.titulo,
                contenido: post.contenido,
                pub_date: DateMX(date),
                respuestas: Array.isArray(post.respuestas) ? post.respuestas.length : 0
            };
        }));

        res.json(postDetails);

    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Error en el servidor' });
    }
});

// Obtener un post específico con información extendida
router.get('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const post = await Post.findById(id);
        if (!post) {
            return res.status(404).json({ success: false, message: 'Post no encontrado' });
        }
        const user = await User.findById(post.usuario_id);
        const date = new Date(post.fecha_publicacion);

        res.json({
            post_id: post._id,
            apodo: user ? user.apodo : 'Desconocido',
            titulo: post.titulo,
            contenido: post.contenido,
            pub_date: DateMX(date),
            pub_time: TimeMX(date),
            respuestas: Array.isArray(post.respuestas) ? post.respuestas.length : 0
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Error en el servidor' });
    }
});

// Crear un nuevo post
router.post('/', async (req, res) => {
    const { usuario_id, titulo, contenido, categoria_id } = req.body;

    const fecha_publicacion = Date();

    try {
        const newPost = new Post({ usuario_id, titulo, contenido, categoria_id, fecha_publicacion });
        await newPost.save();
        res.status(201).json({ success: true });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Error en el servidor' });
    }
});

// Actualizar un post existente
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const updateData = { ...req.body, modified: true };
        const updatedPost = await Post.findByIdAndUpdate(id, updateData, { new: true });

        if (!updatedPost) {
            return res.status(404).json({ success: false, message: 'Post no encontrado' });
        }
        res.json({ success: true });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Error en el servidor' });
    }
});

// Eliminar un post
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const deleted = await Post.findByIdAndDelete(id);
        if (!deleted) {
            return res.status(404).json({ success: false, message: 'Post no encontrado' });
        }
        res.json({ success: true });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Error en el servidor' });
    }
});

module.exports = router;