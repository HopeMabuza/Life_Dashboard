import 'dotenv/config'
import express from 'express'
import cors    from 'cors'

import authRoutes        from './routes/auth.js'
import taskRoutes        from './routes/tasks.js'
import habitRoutes       from './routes/habits.js'
import goalRoutes        from './routes/goals.js'
import reflectionRoutes  from './routes/reflections.js'

const app  = express()
const PORT = process.env.PORT ?? 3001

app.use(cors({ origin: 'http://localhost:5173' }))
app.use(express.json())

app.use('/api/auth',        authRoutes)
app.use('/api/tasks',       taskRoutes)
app.use('/api/habits',      habitRoutes)
app.use('/api/goals',       goalRoutes)
app.use('/api/reflections', reflectionRoutes)

app.get('/api/health', (_, res) => res.json({ ok: true }))

app.listen(PORT, () => console.log(`Backend running on http://localhost:${PORT}`))
