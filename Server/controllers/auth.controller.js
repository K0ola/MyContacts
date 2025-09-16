const jwt = require('jsonwebtoken');
const User = require('../Models/user.model');

function signToken(userId) {
  return jwt.sign({ sub: userId }, process.env.JWT_SECRET);
}

exports.register = async (req, res) => {
  try {
    let { email, password } = req.body || {};
    if (!email || !password) {
      return res.status(400).json({ error: 'email et mot de passe sont requis' });
    }

    email = String(email).trim().toLowerCase();

    const user = await User.create({ email, password });
    const token = signToken(user._id);

    return res.status(201).json({ id: user._id, email: user.email, token });
  } catch (err) {
    if (err?.code === 11000 && err?.keyPattern?.email) {
      return res.status(409).json({ error: 'Email déjà utilisé' });
    }
    if (err?.name === 'ValidationError') {
      return res.status(400).json({ error: err.message });
    }
    console.error(err);
    return res.status(500).json({ error: 'Erreur lors de la création de l\'utilisateur' });
  }
};

exports.login = async (req, res) => {
  try {
    let { email, password } = req.body || {};
    if (!email || !password) {
      return res.status(400).json({ error: 'email et mot de passe sont requis' });
    }

    email = String(email).trim().toLowerCase();

    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({ error: 'Identifiants invalides' });
    }

    const ok = await user.comparePassword(password);
    if (!ok) {
      return res.status(401).json({ error: 'Identifiants invalides' });
    }

    const token = signToken(user._id);
    return res.status(200).json({
      message: 'Connecté avec succès',
      id: user._id,
      email: user.email,
      token,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Échec de la connexion' });
  }
};
