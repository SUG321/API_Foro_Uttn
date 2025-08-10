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

            await registrarAccion(user._id, 12, "Inició sesión");

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
        // Verificar si el email ya está registrado
        const userExists = await User.findOne({ email: email });
        if (userExists) {
            return res.status(400).json({ success: false, message: 'El email ya está registrado' });
        }

        // Crear el nuevo usuario con los datos proporcionados
        const newUser = new User({
            apodo,
            email,
            contraseña: contraseña, // Guardar la contraseña encriptada
            admin: false, // Usuario no es admin por defecto
            perfil: { biografia: "", foto_perfil: "" }, // Perfil vacío por defecto
            fecha_registro: Date.now()
        });

        // Guardar el nuevo usuario en la base de datos
        await newUser.save();

        // Obtener el usuario registrado para enviar la respuesta
        const user = await User.findOne({ email: email }).select('-contraseña'); // No enviar la contraseña en la respuesta

        res.json({
            success: true,
            message: 'Usuario registrado exitosamente',
            user: {
                id: user._id,
                apodo: user.apodo,
                email: user.email,
                fecha_registro: user.fecha_registro
            }
        });

        // Llamar a la función para registrar acción (si es necesario)
        await registrarAccion(user._id, 13, "Se registró");

    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Error en el servidor' });
    }
});

module.exports = router;