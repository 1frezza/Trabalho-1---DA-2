const express = require('express');
const router = express.Router();  

const usersRoutes = require('./usersRoutes'); 
const teachersRoute = require('./teachersRoutes');
const studentsRoutes = require('./studentsRouter');
const profsaudeRoutes = require('./prof-saude');

// swagger
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('../swagger/swagger.json'); 


router.use('/users', usersRoutes);       // rota de usuários
router.use('/teachers', teachersRoute);  // rota de professores
router.use('/students', studentsRoutes);
router.use('/prof-saude', profsaudeRoutes);

// rota da documentação swagger
router.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

module.exports = router;  
