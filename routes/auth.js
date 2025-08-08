const express = require('express');
const router = express.Router();
const User = require('../Models/User');
const registrarAccion = require('../Logic/registrarAccion');

// Ruta para iniciar sesión
router.post('/login', async (req, res) => {
    const { email, contraseña } = req.body;

    try {
        const user = await User.findOne({ email: email });
        if (user) {
            let isMatch = contraseña === user.contraseña;
            if (isMatch) {
                res.json({
                    success: true,
                    user: {
                        id: user._id,
                        apodo: user.apodo,
                        nombre: user.nombre,
                        email: user.email,
                        admin: user.admin
                    },
                });

            await registrarAccion(user._id, 10, "Iniciar sesión");

            } else {
                res.json({ success: false, message: 'Contraseña incorrecta' });
            }
        } else {
            res.json({ success: false, message: 'Usuario no encontrado' });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Error en el servidor' });
    }
});

// Ruta para registrar un nuevo usuario
router.post('/register', async (req, res) => {
    const { apodo, email, contraseña } = req.body;

    try {
        const userExists = await User.findOne({ email: email });
        if (userExists) {
            return res.json({ success: false, message: 'El email ya está registrado' });
        }

        const newUser = new User({
            apodo,
            email,
            contraseña,
            admin: false,
            fecha_registro: Date.now()
        });

        await newUser.save();

        const user = await User.findOne({ email: email });

        res.json({
            success: true,
            message: 'Usuario registrado exitosamente',
            user: {
                id: user._id
            }
        });

        await registrarAccion(user._id, 9, "Registrarse");

    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Error en el servidor' });
    }
});

module.exports = router;