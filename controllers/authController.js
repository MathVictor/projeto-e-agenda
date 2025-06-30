const express = require('express');
const bcrypt = require('bcrypt');
const { getUserByUsername, createUser } = require('../models/User');
const router = express.Router();

// LOGIN (com sessão)
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const user = await getUserByUsername(username);

  if (!user) {
    return res.status(401).json({ error: 'Usuário não encontrado' });
  }

  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    return res.status(401).json({ error: 'Senha inválida' });
  }

  // ✅ Salva dados na sessão
  req.session.user = {
    username: user.username,
    id: user._id
  };

  res.json({ status: 'logged_in' });
});

// REGISTRO (sem sessão ainda)
router.post('/register', async (req, res) => {
  const { username, password } = req.body;
  const existing = await getUserByUsername(username);

  if (existing) {
    return res.status(409).json({ error: 'Usuário já existe' });
  }

  const hashed = await bcrypt.hash(password, 10);
  await createUser({ username, password: hashed });

  res.status(201).json({ status: 'created' });
});

// LOGOUT
router.post('/logout', (req, res) => {
  req.session.destroy();
  res.json({ status: 'logged_out' });
});

// ✅ Verifica se usuário está logado
router.get('/status', (req, res) => {
  if (req.session.user) {
    res.json({ loggedIn: true, user: req.session.user });
  } else {
    res.json({ loggedIn: false });
  }
});


module.exports = router;
