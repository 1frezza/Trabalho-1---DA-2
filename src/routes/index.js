const express = require('express');
const router = express.Router();
const appointmentsRoutes = require('./appointmentsRoutes');

router.use(express.json());
router.use('/appointments', appointmentsRoutes);  // Ajuste o prefixo aqui

module.exports = router;
