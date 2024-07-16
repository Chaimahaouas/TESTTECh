const jwt = require('jsonwebtoken');
const config = require('config');
const jwtSecret = config.get('jwtSecret');
function isAdmin(req, res, next) {
   
   
   const authHeader = req.header('Authorization');

   console.log('Request Headers:', req.headers); 

   if (!authHeader) {
       console.log('No Authorization header provided.');
       return res.status(401).json({ message: 'Accès non autorisé. Token invalide ou manquant.' });
   }

   const token = authHeader.split(' ')[1];

   if (!token) {
       console.log('No token provided.');
       return res.status(401).json({ message: 'Accès non autorisé. Token invalide ou manquant.' });
   }


    try {
        
        const decoded = jwt.verify(token,jwtSecret);
        console.log('Decoded Token:', decoded);
        if (decoded.user && decoded.user.role === 'admin') {
            req.user = decoded.user;
            next(); 
        } else {
            console.log('User is not an admin:', decoded.user);
            return res.status(403).json({ message: 'Accès non autorisé. Seuls les administrateurs peuvent effectuer cette action.' });
        }
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: 'Erreur du serveur' });
    }
}
function verifyUser(req, res, next) {
    const authHeader = req.header('Authorization');

    if (!authHeader) {
        return res.status(401).json({ message: 'Access denied. No token provided.' });
    }
    
    const token = authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    try {
        const decoded = jwt.verify(token, jwtSecret);
        req.user = decoded.user;
        next();
    } catch (error) {
        res.status(400).json({ message: 'Invalid token.' });
    }
}




module.exports = {
    isAdmin,
    verifyUser
};