import { Router } from 'express'
import { PrismaClient } from '@prisma/client'
import { requireAuth } from '../middleware/auth.js'

const router = Router()
const prisma = new PrismaClient()

router.use(requireAuth)

router.get('/', async (req, res) => {
  const reflections = await prisma.reflection.findMany({
    where:   { userId: req.userId },
    orderBy: { createdAt: 'desc' },
    take:    10,
  })
  res.json(reflections)
})

router.post('/', async (req, res) => {
  const { answers } = req.body
  const reflection = await prisma.reflection.create({
    data: { answers, userId: req.userId },
  })
  res.status(201).json(reflection)
})

export default router
