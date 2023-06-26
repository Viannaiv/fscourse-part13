const router = require('express').Router()
const { Blog, User, ReadingList } = require('../models')

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

module.exports = router