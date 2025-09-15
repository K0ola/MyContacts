const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

const User = require('../Models/user.model.js.js');


function Token(userId) {
    return jwt.sign({ sub: userId }, process.env.JWT_SECRET);
  }

router.post('/register', async (req, res) => {
    console.log(req.body);
    // return res.status(200).json({'ca fonctionne' });
    // const {email, password } = req.body;
    // return res.status(200).json({ email, password });

    try {
      const { email, password } = req.body || {};
      if (!email || !password) {
        return res.status(400).json({ error: 'email and password are required' });
      }
      const user = await User.create({ email, password });
      const token = Token(user._id);
      res.status(201).json({ id: user._id, email: user.email, token });
    } catch (err) {
    //   return res.status(400).json({ error: 'Error creating user' });
    console.log(err);
      
    }
  });



  router.post('/login', async (req, res) => {
    
    try {
    
      const { email, password } = req.body || {};

      if (!email || !password) {
        return res.status(400).json({ error: 'email and password are required' });
      }


      const user = await User.findOne({ email });

      if (!user || !(await user.comparePassword(password))) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      const token = Token(user._id);

      res.status(200).json({ message: 'Login successful', id: user._id, email: user.email, token });

    } catch (err) {
      res.status(400).json({ error: 'Login failed' });
    } 
  });

module.exports = router;







// A faire
// 
// Completer les erreurs pour la logique de Register
// Relire pour un nettoyage (trouver de potentielles parties a optimiser/supprimer)