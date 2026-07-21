import { Router } from 'express'
import { PrismaClient } from '@prisma/client'
import { requireAuth } from '../middleware/auth.js'

const router = Router()
const prisma = new PrismaClient()

router.use(requireAuth)

router.get('/', async (req, res) => {
  const tasks = await prisma.task.findMany({
    where:   { userId: req.userId },
    orderBy: { createdAt: 'desc' },
  })
  res.json(tasks)
})

router.post('/', async (req, res) => {
  const { title, area, priority } = req.body
  const task = await prisma.task.create({
    data: { title, area, priority: priority ?? 'medium', userId: req.userId },
  })
  res.status(201).json(task)
})

router.patch('/:id', async (req, res) => {
  const task = await prisma.task.updateMany({
    where: { id: req.params.id, userId: req.userId },
    data:  req.body,
  })
  res.json(task)
})

router.delete('/:id', async (req, res) => {
  await prisma.task.deleteMany({
    where: { id: req.params.id, userId: req.userId },
  })
  res.status(204).send()
})

export default router
