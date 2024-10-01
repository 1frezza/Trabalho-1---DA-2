const express = require('express')
const app = express()
const cors = require("cors");

app.use(cors());

//swagger
const swaggerUI = require("swagger-ui-express");
const swaggerJsDoc = require("swagger-jsdoc");

const routes = require('./routes')

const hostname = '127.0.0.1';
const port = 3000;

//swagger
const options = {
	definition: {
		openapi: "3.0.0",
		info: {
			title: "API de Gestão de Ensino Especial",
			version: "1.0.0",
			description: `API para demonstração de Documentação API via Swagger.  
            
            ### TD 01    
            Disciplina: DAII 2024.02 Turma 02  
            Equipe: Caio Hobold, Nicolas Frezza, Gustavo Pessi, Jhulia Fermo, Kauan Rosso, Kauam Sant'ana
			`,
      license: {
        name: 'Licenciado para DAII',
      },
      contact: {
        name: 'André F Ruaro'
      },
		},
		servers: [
			{
				url: "http://localhost:3000/api/",
        description: 'Development server',
			},
		],
	},
	apis: ["./src/routes/*.js"],
};

const specs = swaggerJsDoc(options);

app.use('/api', routes)
//swagger
app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(specs));



app.listen(port, () => {
  console.log(`Server running at http://${hostname}:${port}/`)
})