const express = require('express')
const app = express()

const { PORT } = require('./util/config')
const { connectToDatabase } = require('./util/db')

const blogsRouter = require('./controllers/blogs')

const errorHandler = (error, req, res, next) => {
	console.error(error.name, ':', error.message)
  
	if (error.name === 'SequelizeValidationError') {
	  	return res.status(400).json({ error })
	} else if (error.name === 'SequelizeDatabaseError') {
		return res.status(400).json({ error })
 	} else if (error.message === 'likes not found in request body') {
		return res.status(400).json({ error: error.message })
	}
	
	next(error)
}

app.use(express.json())
app.use('/api/blogs', blogsRouter)
app.use(errorHandler)

const start = async () => {
  await connectToDatabase()
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })
}

start()