const router = require('express').Router()

const { Blog, User } = require('../models')

router.get('/', async (req, res) => {
    const blogs = await Blog.findAll({
        include: {
          model: User
        }
    })
    res.json(blogs)
})

router.post('/', async (req, res, next) => {
    try {
        const user = await User.findOne()
        const blog = await Blog.create({ ...req.body, userId: user.id })
        res.json(blog)
    } catch(error) {
        next(error)
    }
})

router.delete('/:id', async (req, res, next) => {
    try {
        await Blog.destroy({
            where: {
              id: req.params.id
            }
        })
        res.status(204).end()
    } catch(error) {
        next(error)
    }
})

const blogFinder = async (req, res, next) => {
    req.blog = await Blog.findByPk(req.params.id)
    next()
}

router.put('/:id', blogFinder, async (req, res, next) => {
    if (req.blog) {
        try {
            if (!req.body.likes) throw Error('likes not found in request body')
            req.blog.likes = req.body.likes
            await req.blog.save()
            res.json(req.blog)
        } catch(error) {
            next(error)
        }
    } else {
        res.status(404).end()
    }
})

module.exports = router