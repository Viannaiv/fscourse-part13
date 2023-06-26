const router = require('express').Router()
const { Blog, User } = require('../models')
const { Op } = require('sequelize')
const { tokenExtractor } = require('../util/middleware')

const blogFinder = async (req, res, next) => {
    req.blog = await Blog.findByPk(req.params.id)
    next()
}

router.get('/', async (req, res) => {
    let where = {}

    if (req.query.search) {
        where = {
            [Op.or]: [
                {title: { [Op.iLike]: `%${req.query.search}%` }}, 
                {author: { [Op.iLike]: `%${req.query.search}%` }}
            ]
        }
    }

    const blogs = await Blog.findAll({
        attributes: { exclude: ['userId'] },
        include: {
          model: User
        },
        where,
        order: [
            ['likes', 'DESC']
        ]
    })
    res.json(blogs)
})

router.post('/', tokenExtractor, async (req, res, next) => {
    try {
        const user = await User.findByPk(req.decodedToken.id)
        const blog = await Blog.create({ ...req.body, userId: user.id })
        res.json(blog)
    } catch(error) {
        next(error)
    }
})

router.delete('/:id', [tokenExtractor, blogFinder], async (req, res, next) => {
    try {
        const user = await User.findByPk(req.decodedToken.id)
        const blog = req.blog

        if (!user) return res.status(401).end()
        if (blog && user.id !== blog.userId) {
            return res.status(401).json({ error: 'user not authorised to perform this action' })
        }
        
        if (blog) await blog.destroy()
        res.status(204).end()
    } catch(error) {
        next(error)
    }
})

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