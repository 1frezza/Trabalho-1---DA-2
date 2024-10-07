const express = require('express')
const router = express.Router()
const { v4: uuidv4 } = require('uuid')
const fs = require('fs');

var appointmentsDB = carregarAgendamentos();

function carregarAgendamentos() {
    try {
      return JSON.parse(fs.readFileSync('./src/db/appointments.json', 'utf8'));
    } catch (err) {
      return [];
    }
}

function salvarAgendamentos() {
    try {
      fs.writeFileSync('./src/db/appointments.json', JSON.stringify(appointmentsDB, null, 2));
      return "Agendamento salvo!";
    } catch (err) {
      return "Erro ao salvar!";
    }
}

/**
 * @swagger
 * components:
 *   schemas:
 *     Agendamento em saúde:
 *       type: object
 *       required:
 *         - id
 *         - specialty
 *         - comments
 *         - date
 *         - student
 *         - professional
 *       properties:
 *         id:
 *           type: string
 *           description: O id é gerado automaticamente pelo cadastro do agendamento
 *         specialty:
 *           type: string
 *           description: Especialidade
 *         comments:
 *           type: string
 *           description: Comentários
 *         date:
 *           type: string
 *           description: Data
 *         student:
 *           type: string
 *           description: Estudante
 *         professional:
 *           type: string
 *           description: Profissional
 *       example:
 *         "id": "7a6cc1282c5f6ec0235acd2bfa780145aa2a67fd"
 *         "specialty": "Fisioterapeuta"
 *         "comments": "Realizar sessão"
 *         "date": "2023-08-15 16:00:00"
 *         "student": "Bingo Heeler"
 *         "professional": "Winton Blake"
 * 
 */

 /**
  * @swagger
  * tags:
  *   name: Agendamento em saúde
  *   description: API para gerenciamento de agendamentos em saúde. Criado por Kauam Sant`Ana
  */

 /**
 * @swagger
 * /appointments:
 *   get:
 *     summary: Retorna uma lista de todos os agendamentos
 *     tags: [Agendamento em saúde]
 *     responses:
 *       200:
 *         description: A lista de agendamentos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Agendamento em saúde'
 */

// GET "/appointments"
router.get('/', (req, res) =>{
    console.log("Método GET.");
    appointmentsDB = carregarAgendamentos();
    res.json(appointmentsDB);
})

/**
 * @swagger
 * /appointments/{id}:
 *   get:
 *     summary: Retorna um agendamento pelo ID
 *     tags: [Agendamento em saúde]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID do agendamento
 *     responses:
 *       200:
 *         description: Um agendamento pelo ID
 *         contents:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Agendamento em saúde'
 *       404:
 *         description: Agendamento não encontrado
 */

// GET "/appointments/:id"
router.get('/:id', (req, res) => {
    const id = req.params.id
    appointmentsDB = carregarAgendamentos();
    var appointment = appointmentsDB.find((appointment) => appointment.id === id )
    if(!appointment) return res.status(404).json({
        "erro": "Agendamento não encontrado!"
    })
    res.json(appointment)
})

/**
 * @swagger
 * /appointments:
 *   post:
 *     summary: Cria um novo agendamento
 *     tags: [Agendamento em saúde]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Agendamento em saúde'
 *     responses:
 *       200:
 *         description: O agendamento foi criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Agendamento em saúde'
 */

// POST "/appointments" BODY { "nome": "Eragon" }
router.post('/', (req, res) => {
    const idGerado = uuidv4();
    const novoAgendamento = {
        id: idGerado,
        pwd: idGerado,
        ...req.body
    }
    console.log(novoAgendamento);
    appointmentsDB = carregarAgendamentos();
    appointmentsDB.push(novoAgendamento)
    let resultado = salvarAgendamentos();
    console.log(resultado);
    return res.json(novoAgendamento)
})

/**
 * @swagger
 * /appointments/{id}:
 *  put:
 *    summary: Atualiza um agendamento pelo ID
 *    tags: [Agendamento em saúde]
 *    parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *        required: true
 *        description: ID do agendamento
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/Agendamento em saúde'
 *    responses:
 *      200:
 *        description: O agendamento foi atualizado com sucesso
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Agendamento em saúde'
 *      404:
 *        description: Agendamento não encontrado
 */

// PUT "/appointments/:id" BODY { "nome": "Eragon" }
router.put('/:id', (req, res) => {
    const id = req.params.id
    const appointment = req.body
    appointmentsDB = carregarAgendamentos();
    const currentAppointment = appointmentsDB.find((appointment) => appointment.id === id )
    const currentIndex = appointmentsDB.findIndex((appointment) => appointment.id === id )
    if(!currentAppointment) 
        return res.status(404).json({
        "erro": "Agendamento não encontrado!"
    })
    appointmentsDB[currentIndex] = appointment
    let resultado = salvarAgendamentos();
    console.log(resultado);
    return res.json(appointment)
})

/**
 * @swagger
 * /appointments/{id}:
 *   delete:
 *     summary: Remove um agendamento pelo ID
 *     tags: [Agendamento em saúde]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID do agendamento
 *     responses:
 *       200:
 *         description: O agendamento foi removido com sucesso
 *         content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Agendamento em saúde'
 *       404:
 *         description: Agendamento não encontrado
 */

// DELETE "/appointments/:id"
router.delete('/:id', (req, res) => {
    const id = req.params.id
    appointmentsDB = carregarAgendamentos();
    const currentAppointment = appointmentsDB.find((appointment) => appointment.id === id )
    const currentIndex = appointmentsDB.findIndex((appointment) => appointment.id === id )
    if(!currentAppointment) return res.status(404).json({
        "erro": "Agendamento não encontrado!"
    })
    var deletado = appointmentsDB.splice(currentIndex, 1)
    let resultado = salvarAgendamentos();
    console.log(resultado);
    res.json(deletado)
})

module.exports = router
