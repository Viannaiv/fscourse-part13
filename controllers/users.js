const router = require('express').Router()
const { User } = require('../models')

router.get('/', async (req, res) => {
  const users = await User.findAll()
  res.json(users)
})

router.post('/', async (req, res, next) => {
  try {
    const user = await User.create(req.body)
    res.json(user)
  } catch(error) {
    next(error)
  }
})

router.put('/:username', async (req, res, next) => {
    const user = await User.findOne({ where: { username: req.params.username} })

    if (user) {
        try {
            if (!req.body.name) throw Error('name not found in request body')
            user.name = req.body.name
            await user.save()
            res.json(user)
        } catch(error) {
            next(error)
        }
    } else {
        res.status(404).end()
    }
})

module.exports = router