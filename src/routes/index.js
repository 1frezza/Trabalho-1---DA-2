const express = require('express')
const router = express.Router()
const profsaudeRoutes = require('./prof-saude')

router.use(express.json())
router.use('/prof-saude', profsaudeRoutes)

module.exports = router
