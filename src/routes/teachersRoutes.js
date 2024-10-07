const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');

// Carregar base de dados de professores
var TeachersDB = carregarProfessores();

function carregarProfessores() {
    try {
        return JSON.parse(fs.readFileSync('./src/db/teachers.json', 'utf8'));
    } catch (err) {
        return [];
    }
}

function salvarProfessores() {
    try {
        fs.writeFileSync('./src/db/teachers.json', JSON.stringify(TeachersDB, null, 2));
        return "Professores salvos!";
    } catch (err) {
        return "Erro ao salvar!";
    }
}

/**
 * @swagger
 * components:
 *   schemas:
 *     Professores:
 *       type: object
 *       required:
 *         - id
 *         - name
 *         - subject
 *         - phone_number
 *         - email
 *         - status
 *       properties:
 *         id:
 *           type: string
 *           description: O ID é gerado automaticamente.
 *         name:
 *           type: string
 *           description: Nome do professor.
 *         subject:
 *           type: string
 *           description: Matéria lecionada pelo professor.
 *         phone_number:
 *           type: string
 *           description: Número de telefone do professor.
 *         email:
 *           type: string
 *           description: E-mail do professor.
 *         status:
 *           type: string
 *           description: Status do professor (ativo ou inativo).
 *       example:
 *         id: "a7dcce7283c60a23c98a1d857ba1f7ca6db8271b"
 *         name: "Professor Xavier"
 *         subject: "Ciências"
 *         phone_number: "48 9999 1234"
 *         email: "xavier@escola.com"
 *         status: "ativo"
 */

/**
 * @swagger
 * tags:
 *   name: Professores
 *   description: API para gerenciamento de professores. Criado por Nicolas Martins Frezza
 */

/**
 * @swagger
 * /teachers:
 *   post:
 *     summary: Cria um novo professor
 *     tags: [Professores]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Nome do professor
 *               subject:
 *                 type: string
 *                 description: Matéria que o professor leciona
 *               phone_number:
 *                 type: string
 *                 description: Número de telefone do professor
 *               email:
 *                 type: string
 *                 description: E-mail do professor
 *               status:
 *                 type: string
 *                 description: Status do professor
 *             required:
 *               - name
 *               - subject
 *     responses:
 *       201:
 *         description: Professor criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Professores'
 *         examples:
 *           application/json:
 *             value:
 *               id: "a7dcce7283c60a23c98a1d857ba1f7ca6db8271b"
 *               name: "Professor Xavier"
 *               subject: "Ciências"
 *               phone_number: "48 9999 1234"
 *               email: "xavier@escola.com"
 *               status: "ativo"
 */
router.post('/', (req, res) => {
    const { name, subject, phone_number, email, status } = req.body;

    if (!name || !subject || !phone_number || !email || !status) {
        return res.status(400).json({ erro: "Todos os campos são obrigatórios!" });
    }

    const newTeacher = {
        id: uuidv4(), // Gerar um ID único
        name,
        subject,
        phone_number,
        email,
        status
    };

    TeachersDB.push(newTeacher);
    salvarProfessores();
    return res.status(201).json(newTeacher);
});

/**
 * @swagger
 * /teachers:
 *   get:
 *     summary: Retorna uma lista de todos os professores
 *     tags: [Professores]
 *     responses:
 *       200:
 *         description: A lista de professores
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Professores'
 */
router.get('/', (req, res) => {
    console.log("Método GET.");
    TeachersDB = carregarProfessores();
    res.json(TeachersDB);
});

/**
 * @swagger
 * /teachers/{id}:
 *   get:
 *     summary: Retorna um professor pelo ID
 *     tags: [Professores]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID do professor
 *     responses:
 *       200:
 *         description: Dados do professor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Professores'
 *       404:
 *         description: Professor não encontrado
 */
router.get('/:id', (req, res) => {
    const id = req.params.id;
    TeachersDB = carregarProfessores();
    const teacher = TeachersDB.find(t => t.id === id);
    if (!teacher) return res.status(404).json({ erro: "Professor não encontrado!" });
    res.json(teacher);
});

/**
 * @swagger
 * /teachers/{id}:
 *   put:
 *     summary: Atualiza os dados de um professor
 *     tags: [Professores]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID do professor
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Professores'
 *     responses:
 *       200:
 *         description: Professor atualizado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Professores'
 *       404:
 *         description: Professor não encontrado
 */
router.put('/:id', (req, res) => {
    const id = req.params.id;
    const { name, subject, phone_number, email, status } = req.body;

    TeachersDB = carregarProfessores();
    const currentIndex = TeachersDB.findIndex(teacher => teacher.id === id);
    if (currentIndex === -1) {
        return res.status(404).json({ erro: "Professor não encontrado!" });
    }

    const updatedTeacher = {
        id,
        name: name || TeachersDB[currentIndex].name,
        subject: subject || TeachersDB[currentIndex].subject,
        phone_number: phone_number || TeachersDB[currentIndex].phone_number,
        email: email || TeachersDB[currentIndex].email,
        status: status || TeachersDB[currentIndex].status
    };

    TeachersDB[currentIndex] = updatedTeacher;
    salvarProfessores();
    return res.json(updatedTeacher);
});

/**
 * @swagger
 * /teachers/{id}:
 *   delete:
 *     summary: Remove um professor
 *     tags: [Professores]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID do professor
 *     responses:
 *       204:
 *         description: Professor removido com sucesso
 *       404:
 *         description: Professor não encontrado
 */
router.delete('/:id', (req, res) => {
    const id = req.params.id;
    TeachersDB = carregarProfessores();
    const currentIndex = TeachersDB.findIndex(teacher => teacher.id === id);
    if (currentIndex === -1) {
        return res.status(404).json({ erro: "Professor não encontrado!" });
    }

    TeachersDB.splice(currentIndex, 1);
    salvarProfessores();
    res.status(204).send();
});

module.exports = router;
