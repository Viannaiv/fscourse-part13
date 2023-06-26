const router = require('express').Router()
const { Blog, User, ReadingList } = require('../models')
const { tokenExtractor } = require('../util/middleware')

router.post('/', async (req, res, next) => {
    try {
        const body = req.body
        const user = await User.findByPk(body.user_id)
        const blog = await Blog.findByPk(body.blog_id)
        if (!user || !blog) {
            return res.status(400).json(
                { error: 'Provide existing user_id and blog_id: matching user or blog does not exists' }
            )
        }
        const readingList = await ReadingList.create({ userId: user.id, blogId: blog.id })
        res.json(readingList)
    } catch(error) {
        next(error)
    }
})

router.put('/:id', tokenExtractor, async (req, res, next) => {
    let readingList = null

    try {
        readingList = await ReadingList.findByPk(req.params.id)
    } catch (error) {
        next(error)
    }

    const user = await User.findByPk(req.decodedToken.id)

    if (!user || (readingList && user.id !== readingList.userId)) {
        return res.status(401).json({ error: 'not authorised to perform this action' })
    }

    if (readingList) {
        try {
            if (!req.body.read && req.body.read !== false) throw Error('read not found in request body')
            readingList.read = req.body.read
            await readingList.save()
            res.json(readingList)
        } catch(error) {
            next(error)
        }
    } else {
        res.status(404).end()
    }
})

module.exports = router