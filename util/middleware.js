const jwt = require('jsonwebtoken')
const { SECRET } = require('./config.js')
const { Session, User } = require('../models')

const tokenExtractor = async (req, res, next) => {
    const authorization = req.get('authorization')
    if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
        try {
            const token = authorization.substring(7)
            req.decodedToken = jwt.verify(token, SECRET)
            const session = await Session.findOne({
                include: {
                    model: User
                },
                where: { 
                    token: token,
                    userId: req.decodedToken.id
                }
            })
            if (req.baseUrl !== '/api/logout'
                && (!session || session.user.disabled)) {
                return res.status(401).json({ error: 'token invalid' })
            }
        } catch{
            return res.status(401).json({ error: 'token invalid' })
        }
    } else {
        return res.status(401).json({ error: 'token missing' })
    }
    next()
}

module.exports = { tokenExtractor }