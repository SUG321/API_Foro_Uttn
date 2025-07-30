const express = require('express');
const router = express.Router();
const Response = require('../Models/Response');
const User = require('../Models/User');

// Obtener todas las respuestas de un post
router.get('/posts/:postId/responses', async (req, res) => {
    const { postId } = req.params;
    try {
        const responses = await Response.find({ pregunta_id: postId });

        const responseDetails = await Promise.all(responses.map(async (resp) => {
            const user = await User.findById(resp.usuario_id);
            return {
                respuesta_id: resp._id,
                contenido: resp.contenido,
                fecha_respuesta: resp.fecha_respuesta,
                votos: resp.votos,
                usuario: {
                    id: user ? user._id : null,
                    apodo: user ? user.apodo : 'Desconocido',
                    nombre: user ? user.nombre : undefined,
                    foto_perfil: user && user.perfil ? user.perfil.foto_perfil : undefined
                }
            };
        }));

        res.json(responseDetails);
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Error en el servidor' });
    }
});

// Crear una respuesta para un post
router.post('/posts/:postId/responses', async (req, res) => {
    const { postId } = req.params;
    const { usuario_id, contenido } = req.body;
    try {
        const newResponse = new Response({
            usuario_id,
            pregunta_id: postId,
            contenido
        });
        await newResponse.save();
        res.status(201).json({ success: true, message: 'Respuesta creada', respuesta_id: newResponse._id });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Error en el servidor' });
    }
});

// Actualizar una respuesta existente
router.put('/responses/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const updated = await Response.findByIdAndUpdate(id, req.body, { new: true });
        if (!updated) {
            return res.status(404).json({ success: false, message: 'Respuesta no encontrada' });
        }
        res.json({ success: true, message: 'Respuesta actualizada', respuesta: updated });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Error en el servidor' });
    }
});

// Eliminar una respuesta
router.delete('/responses/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const deleted = await Response.findByIdAndDelete(id);
        if (!deleted) {
            return res.status(404).json({ success: false, message: 'Respuesta no encontrada' });
        }
        res.json({ success: true, message: 'Respuesta eliminada' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Error en el servidor' });
    }
});

module.exports = router;
