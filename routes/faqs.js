const express = require('express');
const router = express.Router();

const Faq = require('../Models/FAQ');

// Obtener todas las FAQs
router.get('/', async (req, res) => {
  try {
    const faqs = await Faq.find();
    res.json(faqs);
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
    if (!faq) {
      return res.status(404).json({ success: false, message: 'FAQ no encontrada' });
    }
    res.json(faq);
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
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Error en el servidor' });
  }
});

// Eliminar una FAQ
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const deleted = await Faq.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'FAQ no encontrada' });
    }
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Error en el servidor' });
  }
});

module.exports = router;