const router = require('express').Router()
const { Session } = require('../models')
const { tokenExtractor } = require('../util/middleware')

router.delete('/', tokenExtractor, async (req, res, next) => {
    try {
        await Session.destroy({
            where: {
                userId: req.decodedToken.id
            }
        })
        res.status(204).end()
    } catch(error) {
        next(error)
    }
})

module.exports = router