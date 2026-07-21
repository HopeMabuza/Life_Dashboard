import { Router } from 'express'
import { PrismaClient } from '@prisma/client'
import { requireAuth } from '../middleware/auth.js'

const router = Router()
const prisma = new PrismaClient()

router.use(requireAuth)

router.get('/', async (req, res) => {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const habits = await prisma.habit.findMany({
    where:   { userId: req.userId },
    include: { completions: { where: { date: { gte: today } } } },
    orderBy: { createdAt: 'asc' },
  })

  const result = habits.map(h => ({
    ...h,
    completedToday: h.completions.length > 0,
    completions: undefined,
  }))

  res.json(result)
})

router.post('/', async (req, res) => {
  const { name, area } = req.body
  const habit = await prisma.habit.create({
    data: { name, area, userId: req.userId },
  })
  res.status(201).json(habit)
})

// Toggle today's completion
router.post('/:id/toggle', async (req, res) => {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const habit = await prisma.habit.findFirst({
    where: { id: req.params.id, userId: req.userId },
    include: { completions: { where: { date: { gte: today } } } },
  })

  if (!habit) return res.status(404).json({ error: 'Not found' })

  if (habit.completions.length > 0) {
    // Un-toggle: remove today's log and decrement streak
    await prisma.habitLog.delete({ where: { id: habit.completions[0].id } })
    await prisma.habit.update({ where: { id: habit.id }, data: { streak: { decrement: 1 } } })
  } else {
    // Toggle on: add log and increment streak
    await prisma.habitLog.create({ data: { habitId: habit.id } })
    await prisma.habit.update({ where: { id: habit.id }, data: { streak: { increment: 1 } } })
  }

  res.status(204).send()
})

router.delete('/:id', async (req, res) => {
  await prisma.habit.deleteMany({ where: { id: req.params.id, userId: req.userId } })
  res.status(204).send()
})

export default router
