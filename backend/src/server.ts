import express from 'express'
import cors from 'cors'
import path from 'path'
import { checksRouter } from './routes/checks'

const app = express()
const PORT = parseInt(process.env.PORT ?? '3001', 10)

app.use(cors())
app.use(express.json())

app.use('/api/checks', checksRouter)
app.get('/api/health', (_req, res) => res.json({ status: 'ok', version: '1.0.0' }))

if (process.env.NODE_ENV === 'production') {
  const staticPath = path.join(__dirname, '../../frontend/dist')
  app.use(express.static(staticPath))
  app.get('*', (_req, res) => res.sendFile(path.join(staticPath, 'index.html')))
}

app.listen(PORT, () => {
  console.log(`\n🚀 DeployChecker backend: http://localhost:${PORT}`)
  if (process.env.NODE_ENV !== 'production') {
    console.log(`   Frontend dev server:    http://localhost:5173\n`)
  }
})
