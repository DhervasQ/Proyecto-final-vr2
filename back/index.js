const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();
app.use(express.json());

// Configurar CORS
app.use(cors());

// Conectar a la base de datos de MongoDB usando Mongoose
mongoose.connect('mongodb://localhost:27017/wpp-14', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Conexión exitosa a la base de datos.'))
  .catch(error => console.error('Error al conectar a la base de datos:', error));

// Definir el esquema de usuario
const usuarioSchema = new mongoose.Schema({
  nombre: String,
  email: String,
  password: String
});

// Crear el modelo de usuario basado en el esquema
const Usuario = mongoose.model('Usuario', usuarioSchema);

// Ruta de registro
app.post('/registro', (req, res) => {
  const { nombre, email, password } = req.body;

  // Verificar si el correo electrónico ya existe en la base de datos
  Usuario.findOne({ email }, (error, user) => {
    if (error) {
      console.error('Error al buscar usuario:', error);
      res.status(500).json({ error: 'Error al buscar usuario' });
    } else {
      if (user) {
        // El correo electrónico ya está registrado
        res.status(409).json({ error: 'El correo electrónico ya está registrado' });
      } else {
        // El correo electrónico no está registrado, crear un nuevo usuario
        bcrypt.hash(password, 10, (error, hash) => {
          if (error) {
            console.error('Error al cifrar la contraseña:', error);
            res.status(500).json({ error: 'Error al cifrar la contraseña' });
          } else {
            const nuevoUsuario = new Usuario({
              nombre,
              email,
              password: hash
            });

            // Guardar el nuevo usuario en la base de datos
            nuevoUsuario.save((error, result) => {
              if (error) {
                console.error('Error al crear usuario:', error);
                res.status(500).json({ error: 'Error al crear usuario' });
              } else {
                res.json({ message: 'Usuario creado exitosamente' });
              }
            });
          }
        });
      }
    }
  });
});

// Ruta de inicio de sesión
app.post('/login', (req, res) => {
  const { email, password } = req.body;

  // Buscar el usuario en la base de datos por email
  Usuario.findOne({ email }, (error, user) => {
    if (error) {
      console.error('Error al buscar usuario:', error);
      res.status(500).json({ error: 'Error al buscar usuario' });
    } else {
      if (user) {
        // Verificar la contraseña utilizando bcrypt
        bcrypt.compare(password, user.password, (error, result) => {
          if (error) {
            console.error('Error al comparar contraseñas:', error);
            res.status(500).json({ error: 'Error al comparar contraseñas' });
          } else {
            if (result) {
              // Contraseña válida, generar el token utilizando jsonwebtoken
              const token = jwt.sign({ id: user._id }, 'tu_secreto', {
                expiresIn: '24h' // Tiempo de expiración del token
              });
              console.log("Usuario logeado exitosamente con token:" + token)
              res.json({ token });
            } else {
              // Contraseña incorrecta
              res.status(401).json({ error: 'Contraseña incorrecta' });
            }
          }
        });
      } else {
        // Usuario no encontrado
        res.status(404).json({ error: 'Usuario no encontrado' });
      }
    }
  });
});

// Middleware de autenticación
const authenticate = (req, res, next) => {
  const token = req.headers.authorization;
  if (!token) {
    console.error('Token no proporcionado');
    res.status(401).json({ error: 'Token no proporcionado' });
  } else {
    jwt.verify(token, 'tu_secreto', (error, decoded) => {
      if (error) {
        console.error('Token inválido:', error);
        console.error('Decoded inválido:', decoded);
        res.status(401).json({ error: 'Token inválido' });
      } else {
        // Token válido, continuar con la siguiente ruta
        req.userId = decoded.id;
        next();
      }
    });
  }
};

// Rutas protegidas con autenticación
app.get('/usuarios', authenticate, (req, res) => {
  // Obtener todos los usuarios de la base de datos
  Usuario.find({}, (error, results) => {
    if (error) {
      console.error('Error al obtener usuarios:', error);
      res.status(500).json({ error: 'Error al obtener usuarios' });
    } else {
      res.json(results);
    }
  });
});

app.post('/usuarios', authenticate, (req, res) => {
  const usuario = req.body;

  bcrypt.hash(usuario.password, 10, (error, hash) => {
    if (error) {
      console.error('Error al encriptar la contraseña:', error);
      res.status(500).json({ error: 'Error al encriptar la contraseña' });
    } else {
      const nuevoUsuario = new Usuario({
        nombre: usuario.nombre,
        email: usuario.email,
        password: hash
      });

      nuevoUsuario.save((error, result) => {
        if (error) {
          console.error('Error al crear usuario:', error);
          res.status(500).json({ error: 'Error al crear usuario' });
        } else {
          const usuarioConID = { ...usuario, _id: result._id };
          res.json(usuarioConID);
        }
      });
    }
  });
});

app.put('/usuarios/:id', authenticate, (req, res) => {
  const usuarioId = req.params.id;
  const nuevoUsuario = req.body;

  Usuario.findByIdAndUpdate(usuarioId, nuevoUsuario, (error, result) => {
    if (error) {
      console.error('Error al actualizar usuario:', error);
      res.status(500).json({ error: 'Error al actualizar usuario' });
    } else {
      res.json({ message: 'Usuario actualizado exitosamente' });
    }
  });
});

app.delete('/usuarios/:id', authenticate, (req, res) => {
  const usuarioId = req.params.id;

  Usuario.findByIdAndRemove(usuarioId, (error, result) => {
    if (error) {
      console.error('Error al eliminar usuario:', error);
      res.status(500).json({ error: 'Error al eliminar usuario' });
    } else {
      res.json({ message: 'Usuario eliminado exitosamente' });
    }
  });
});

// Iniciar el servidor en el puerto 3000
app.listen(3000, () => {
  console.log('Servidor iniciado en el puerto 3000');
});
