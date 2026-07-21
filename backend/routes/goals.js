import { Router } from 'express'
import { PrismaClient } from '@prisma/client'
import { requireAuth } from '../middleware/auth.js'

const router = Router()
const prisma = new PrismaClient()

router.use(requireAuth)

router.get('/', async (req, res) => {
  const now   = new Date()
  const goals = await prisma.goal.findMany({
    where:   { userId: req.userId, month: now.getMonth() + 1, year: now.getFullYear() },
    orderBy: { createdAt: 'desc' },
  })
  res.json(goals)
})

router.post('/', async (req, res) => {
  const { title, area } = req.body
  const now  = new Date()
  const goal = await prisma.goal.create({
    data: {
      title, area,
      month:  now.getMonth() + 1,
      year:   now.getFullYear(),
      userId: req.userId,
    },
  })
  res.status(201).json(goal)
})

router.patch('/:id', async (req, res) => {
  await prisma.goal.updateMany({
    where: { id: req.params.id, userId: req.userId },
    data:  req.body,
  })
  res.status(204).send()
})

router.delete('/:id', async (req, res) => {
  await prisma.goal.deleteMany({ where: { id: req.params.id, userId: req.userId } })
  res.status(204).send()
})

export default router
