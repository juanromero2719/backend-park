import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import codigoTotpRoutes from './src/codigo_totp/routes/codigoTotpRoutes.js'
import userRoutes from './src/user/routes/userRoutes.js'

const app = express()
const port = 3000

app.use(express.json())
app.use(cors({
  origin: process.env.CORS_ORIGINS ? process.env.CORS_ORIGINS.split(',') : true,
  credentials: true,
}))

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.use('/api/user', userRoutes)
app.use('/api/codigo-totp', codigoTotpRoutes)

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})