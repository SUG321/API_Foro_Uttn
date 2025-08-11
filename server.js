// Requerir las dependencias necesarias
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');

// Rutas/+´-Endpoints
const authRoutes = require('./routes/auth');
const postsRoutes = require('./routes/posts');
const responsesRoutes = require('./routes/responses');
const usersRoutes = require('./routes/users');
const actionsRoutes = require('./routes/actions');
const faqsRoutes = require('./routes/faqs');

const app = express();

app.use(cors());
app.use(bodyParser.json());

const PORT = process.env.PORT || 5000;

// Conexión a MongoDB
mongoose.connect('mongodb://localhost:27017/foro_uttn', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => console.log('Conectado a MongoDB'))
    .catch((err) => console.log('Error al conectar a MongoDB: ', err));

// Montar las rutas
app.use('/', authRoutes);           // Login y registro "/" + "/login" = "localhost:5000/login" Mira el Readme.md
app.use('/posts', postsRoutes);     // Endpoints de Posts
app.use('/', responsesRoutes);      // Endpoints de Respuestas
app.use('/', usersRoutes);          // Endpoints de Usuarios
app.use('/', actionsRoutes);        // Endpoints de Acciones
app.use('/faqs', faqsRoutes);       // Endpoints de FAQ

app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
}); 