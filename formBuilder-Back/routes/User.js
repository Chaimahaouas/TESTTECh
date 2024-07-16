const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs'); 
const User = require('../Models/UserModel'); 
const jwt = require('jsonwebtoken');
const config = require('config');
const jwtSecret = config.get('jwtSecret');
router.post('/signup', async (req, res) => {
    const { email, username, password,role } = req.body;

    try {
        
        let user = await User.findOne({ email });

        if (user) {
            return res.status(400).json({ message: 'Cet email est déjà utilisé.' });
        }

        user = new User({
            email,
            username,
            password,
            role
        });

     
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt); 
        await user.save();

        res.status(201).json({ message: 'Utilisateur inscrit avec succès.' });
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Erreur du serveur');
    }
});

router.post('/signin', async (req, res) => {
    const { email, password } = req.body;

    try {
        let user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({ message: 'Email ou mot de passe incorrect.' });
        }

       
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({ message: 'Email ou mot de passe incorrect.' });
        }

        
        const payload = {
            user: {
                id: user.id,
                email:user.email,
                role:user.role,
                
            }
        };
       

     jwt.sign(payload,jwtSecret, { expiresIn: '7d' }, (err, token) => {
    if (err) throw err;
    res.json({ token });
});
       

    } catch (error) {
        console.error(error.message);
        res.status(500).send('Erreur du serveur');
    }
});

module.exports = router;
