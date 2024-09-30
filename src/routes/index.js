const express = require('express');
const app = express(); 

const usersRoutes = require('./routes/usersRoutes'); 
const teachersRoute = require('./routes/teachersRoutes'); 

// swagger
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger/swagger.json'); // Verifique o caminho para o arquivo swagger.json


app.use(express.json());  


app.use('/api/users', usersRoutes);       // rota de usuários
app.use('/api/teachers', teachersRoute);  // rota de professores

// rota da documentação swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
