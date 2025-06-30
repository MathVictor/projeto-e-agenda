require('dotenv').config();
const express = require('express');
const path = require('path');
const session = require('express-session'); // ✅ AQUI ESTAVA FALTANDO
const app = express();

const eventRoutes = require('./controllers/eventController');
const authRoutes = require('./controllers/authController');

// ✅ Sessão
app.use(session({
  secret: 'utfpr',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false } // true se HTTPS
}));

// ✅ Middlewares
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// ✅ Rotas
app.use('/events', eventRoutes);
app.use('/auth', authRoutes);

// ✅ Views
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

app.get('/register', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'register.html'));
});

// ✅ Start
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor Express rodando em http://localhost:${PORT}`);
});
