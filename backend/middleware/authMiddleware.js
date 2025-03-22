const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    const token = req.cookies.jwtToken;

    if (!token) {
        return res.status(401).json({ error: 'Acesso negado. Token não fornecido' })
    }

    try {
        const decoded = jwt.verify(token.replace('Bearer ', ''), process.env.JWT_SECRET);
        req.usuarioId = decoded.id;
        next();

    } catch (error) {
        res.status(401).json({ error: 'Token inválido' });
    }
}