import express from 'express'
import userRoutes from './user/routes/userRoutes.js'

const app = express()
const port = 3000

app.use(express.json())

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.use('/api/user', userRoutes)

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})