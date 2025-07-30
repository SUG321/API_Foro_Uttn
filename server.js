// Requerir las dependencias necesarias
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');

const User = require('./Models/User');
const Post = require('./Models/Post');
const Response = require('./Models/Response');

// Crear una instancia de Express
const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

const PORT = process.env.PORT || 5000;

// Conexión a MongoDB (utilizando MongoDB Atlas o tu propia instancia de MongoDB)
mongoose.connect('mongodb://localhost:27017/foro_uttn', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => console.log('Conectado a MongoDB'))
    .catch((err) => console.log('Error al conectar a MongoDB: ', err));



// Ruta para iniciar sesión ----------------------------------------------------------------------------(FALTA ESTA)
app.post('/login', async (req, res) => {
    const { email, contraseña } = req.body;

    try {
        // Buscar el usuario por email
        const user = await User.findOne({ email: email });

        if (user) {

            let isMatch;

            // Comparar la contraseña cifrada
            if (contraseña == user.contraseña) { isMatch = true } else { isMatch = false };

            if (isMatch == true) {
                // Si la contraseña es correcta, devolver la información del usuario (sin la contraseña)
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
            } else {
                // Si las contraseñas no coinciden
                res.json({ success: false, message: 'Contraseña incorrecta' });
            }
        } else {
            // Si no se encuentra al usuario
            res.json({ success: false, message: 'Usuario no encontrado' });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Error en el servidor' });
    }
});



// Ruta para registrar un nuevo usuario ----------------------------------------------------------------------------(FALTA ESTA)
app.post('/register', async (req, res) => {
    const { apodo, email, contraseña } = req.body;

    try {
        // Verificar si el email ya está registrado
        const userExists = await User.findOne({ email: email });
        if (userExists) {
            return res.json({ success: false, message: 'El email ya está registrado' });
        }

        // Crear un nuevo usuario sin encriptación de contraseña
        const newUser = new User({
            apodo,
            email,
            contraseña,  // Contraseña tal como está
            admin: false,
            fecha_registro: Date.now()
        });

        // Guardar el usuario en la base de datos
        await newUser.save();

        // Búsqueda del nuevo usuario creado
        const user = await User.findOne({ email: email });

        // Responder con un mensaje de éxito
        res.json({
            success: true,
            message: 'Usuario registrado exitosamente',
            user: {
                id: user._id
            }
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Error en el servidor' });
    }
});


// Ruta para obtener todos los posts con la información del usuario  --------------------------------------------(FALTA ESTA)
// Aun falta agregar salida de votos
app.get('/posts', async (req, res) => {
    try {
        const posts = await Post.find();

        const postDetails = await Promise.all(posts.map(async (post) => {
            const user = await User.findById(post.usuario_id);
            console.log(user);

            const date = new Date(post.fecha_publicacion);

            const formattedDate = `${date.getFullYear().toString().slice(2)}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getDate().toString().padStart(2, '0')}`;

            return {
                post_id: post._id,
                apodo: user ? user.apodo : 'Desconocido',  // Manejo de posibles valores nulos
                titulo: post.titulo,
                contenido: post.contenido,
                pub_date: formattedDate,
                respuestas: Array.isArray(post.respuestas) ? post.respuestas.length : 0
            };
        }));

        res.json(postDetails);

    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Error en el servidor' });
    }
});



// Ruta para obtener todas las respuestas de una publicación -------------------
app.get('/posts/:postId/responses', async (req, res) => {
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



// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});
