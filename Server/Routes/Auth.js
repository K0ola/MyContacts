const express = require('express');
const router = express.Router();

const User = require('../Models/User');

router.post('/register', async (req, res) => {
    const {email, password } = req.body;
    try {
        const newUser = new User({ email, password });
        await newUser.save();
        res.status(201).json({ message: 'User Created 👍' });
    } catch (error) {
        res.status(400).json({ error: 'Error' });
    }
});

router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User
            .findOne({ email, password })
            .select('-password -__v -createdAt');
        if (!user) {
            return res.status(401).json({ error: 'Login or Password is not good chef' });
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(400).json({ error: 'Error' });
    }
});

module.exports = router;