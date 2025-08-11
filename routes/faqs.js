const express = require('express');
const router = express.Router();

const Faq = require('../Models/FAQ');
const Post = require('../Models/Post');
const Response = require('../Models/Response');

const registrarAccion = require('../Logic/registrarAccion');
const { DateMX, TimeMX } = require('../Logic/dateFormatting');


// Obtener todas las FAQs
router.get('/', async (req, res) => {
  try {
    const faqs = await Faq.find();

    const formFaqs = faqs.map(faq => {
      const date = new Date(faq.fecha_creacion);
      return {
        faq_id: faq._id,
        user_id: faq.usuario_id,
        titulo: faq.titulo,
        contenido: faq.contenido,
        pub_date: DateMX(date),
        pub_time: TimeMX(date)
      };
    });

    res.json(formFaqs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Error en el servidor' });
  }
});

// Obtener una FAQ por ID
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const faq = await Faq.findById(id);
    const date = new Date(faq.fecha_creacion);

    const formFaqs = {
      faq_id: faq._id,
      user_id: faq.usuario_id,
      titulo: faq.titulo,
      contenido: faq.contenido,
      pub_date: DateMX(date),
      pub_time: TimeMX(date)
    };

    if (!faq) {
      return res.status(404).json({ success: false, message: 'FAQ no encontrada' });
    }

    res.json(formFaqs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Error en el servidor' });
  }
});

// Obtener FAQ a partir de un post con respuesta verificada
router.get('/post/:postId', async (req, res) => {
  const { postId } = req.params;
  const { usuario_id } = req.body;
  try {
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ success: false, message: 'Post no encontrado' });
    }

    const verifiedResponse = await Response.findOne({ pregunta_id: postId, verified: true });
    if (!verifiedResponse) {
      return res.status(404).json({ success: false, message: 'No existe una respuesta verificada' });
    }

    const newFaq = new Faq({ 
      usuario_id, 
      titulo: post.titulo, 
      contenido: verifiedResponse.contenido });
    await newFaq.save();
    
    res.json({
      titulo: post.titulo,
      contenido: verifiedResponse.contenido
    });
    registrarAccion(usuario_id, 17, "Agregó una publicación a FAQ", newFaq._id, "Faq");
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Error en el servidor' });
  }
});

// Crear una nueva FAQ
router.post('/', async (req, res) => {
  const { usuario_id, titulo, contenido } = req.body;
  try {
    const newFaq = new Faq({ usuario_id, titulo, contenido });
    await newFaq.save();
    res.status(201).json({ success: true, faq_id: newFaq._id });
    registrarAccion(usuario_id, 18, "Agregó una pregunta a FAQ", newFaq._id, "Faq")
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Error en el servidor' });
  }
});

// Actualizar una FAQ existente
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const updated = await Faq.findByIdAndUpdate(id, req.body, { new: true });
    if (!updated) {
      return res.status(404).json({ success: false, message: 'FAQ no encontrada' });
    }
    res.json({ success: true });
    registrarAccion(req.body.usuario_id, 20, "Modificó una pregunta de FAQ", "Faq");
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Error en el servidor' });
  }
});

// Eliminar una FAQ
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  const { usuario_id } = req.body;
  try {
    const deleted = await Faq.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'FAQ no encontrada' });
    }
    res.json({ success: true });
    registrarAccion(usuario_id, 19, "Eliminó una pregunta de FAQ", "Faq");
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Error en el servidor' });
  }
});

module.exports = router;