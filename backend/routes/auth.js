import { Router } from 'express'
import { ethers }  from 'ethers'
import jwt         from 'jsonwebtoken'
import { PrismaClient } from '@prisma/client'

const router = Router()
const prisma = new PrismaClient()

// POST /api/auth/verify
// Verifies a wallet signature and returns a JWT
router.post('/verify', async (req, res) => {
  try {
    const { address, signature, message } = req.body

    if (!address || !signature || !message) {
      return res.status(400).json({ error: 'address, signature, and message are required' })
    }

    // Recover the address that signed the message
    const recovered = ethers.verifyMessage(message, signature)

    if (recovered.toLowerCase() !== address.toLowerCase()) {
      return res.status(401).json({ error: 'Signature mismatch' })
    }

    // Find or create the user in the database
    const user = await prisma.user.upsert({
      where:  { address: address.toLowerCase() },
      update: {},
      create: { address: address.toLowerCase() },
    })

    const token = jwt.sign(
      { userId: user.id, address: user.address },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    )

    res.json({ token })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Authentication failed' })
  }
})

export default router
