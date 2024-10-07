const express = require('express');
const router = express.Router();
const fs = require('fs');

let teachersDB = carregarProfessores();

// Função para carregar professores do arquivo
function carregarProfessores() {
    try {
        return JSON.parse(fs.readFileSync('./src/db/teachers.json', 'utf8'));
    } catch (err) {
        return [];
    }
}

// Função para salvar professores no arquivo
function salvarProfessores() {
    try {
        fs.writeFileSync('./src/db/teachers.json', JSON.stringify(teachersDB, null, 2));
        return "Professores salvos!";
    } catch (err) {
        return "Erro ao salvar!";
    }
}

/**
 * @swagger
 * components:
 *   schemas:
 *     Teacher:
 *       type: object
 *       required:
 *         - id
 *         - name
 *         - matéria
 *       properties:
 *         id:
 *           type: integer
 *           description: O ID é gerado automaticamente e é incremental.
 *         name:
 *           type: string
 *           description: Nome do professor
 *         matéria:
 *           type: string
 *           description: Matéria que o professor leciona
 *       example:
 *         id: 1
 *         name: Nicolas
 *         matéria: Programação
 */

/**
 * @swagger
 * tags:
 *   name: Professores
 *   description: API para gerenciamento de professores
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
 *               matéria:
 *                 type: string
 *                 description: Matéria que o professor leciona
 *             required:
 *               - name
 *               - matéria
 *     responses:
 *       201:
 *         description: Professor criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Teacher'
 *         examples:
 *           application/json:
 *             value:
 *               id: 1
 *               name: Caio Hobold
 *               matéria: Matemática
 */
router.post('/', (req, res) => {
    // Verifica se req.body está definido
    if (!req.body) {
        return res.status(400).json({ erro: "O corpo da requisição está indefinido." });
    }

    const { name, matéria } = req.body; // Extraindo name e matéria do corpo da requisição
    if (!name || !matéria) {
        return res.status(400).json({ erro: "Nome e matéria são obrigatórios!" });
    }

    // Gerar ID incremental
    const nextId = teachersDB.length > 0 ? Math.max(...teachersDB.map(t => t.id)) + 1 : 1;

    const novoProfessor = {
        id: nextId, // O ID é gerado automaticamente
        name,
        matéria
    };

    teachersDB.push(novoProfessor);
    let resultado = salvarProfessores();
    console.log(resultado);
    return res.status(201).json(novoProfessor); // Retorna o novo professor criado
});


router.post('/', (req, res) => {
    // Verifica se req.body está definido
    if (!req.body) {
        return res.status(400).json({ erro: "O corpo da requisição está indefinido." });
    }

    const { name, matéria } = req.body; // Extraindo name e matéria do corpo da requisição
    if (!name || !matéria) {
        return res.status(400).json({ erro: "Nome e matéria são obrigatórios!" });
    }

    // Gerar ID incremental
    const nextId = teachersDB.length > 0 ? Math.max(...teachersDB.map(t => t.id)) + 1 : 1;

    const novoProfessor = {
        id: nextId,
        name,
        matéria
    };

    teachersDB.push(novoProfessor);
    let resultado = salvarProfessores();
    console.log(resultado);
    return res.status(201).json(novoProfessor);
});

/**
 * @swagger
 * /teachers:
 *   get:
 *     summary: Retorna todos os professores
 *     tags: [Professores]
 *     responses:
 *       200:
 *         description: Lista de professores
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Teacher'
 */
router.get('/', (req, res) => {
    console.log("Método GET.");
    teachersDB = carregarProfessores();
    res.json(teachersDB);
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
 *           type: integer
 *         required: true
 *         description: ID do professor
 *     responses:
 *       200:
 *         description: Dados do professor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Teacher'
 *       404:
 *         description: Professor não encontrado
 */
router.get('/:id', (req, res) => {
    const id = parseInt(req.params.id);
    teachersDB = carregarProfessores();
    const professor = teachersDB.find(t => t.id === id);
    if (!professor) return res.status(404).json({ erro: "Professor não encontrado." });
    res.json(professor);
});

/**
 * @swagger
 * /teachers/{id}:
 *   put:
 *     summary: Atualiza um professor
 *     tags: [Professores]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID do professor
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Teacher'
 *     responses:
 *       200:
 *         description: Professor atualizado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Teacher'
 *       404:
 *         description: Professor não encontrado
 */
router.put('/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const { name, matéria } = req.body;

    teachersDB = carregarProfessores();
    const currentIndex = teachersDB.findIndex(t => t.id === id);
    if (currentIndex === -1) return res.status(404).json({ erro: "Professor não encontrado." });

    teachersDB[currentIndex] = { id, name, matéria };
    let resultado = salvarProfessores();
    console.log(resultado);
    return res.json(teachersDB[currentIndex]);
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
 *           type: integer
 *         required: true
 *         description: ID do professor
 *     responses:
 *       204:
 *         description: Professor removido
 *       404:
 *         description: Professor não encontrado
 */
router.delete('/:id', (req, res) => {
    const id = parseInt(req.params.id);
    teachersDB = carregarProfessores();
    const currentIndex = teachersDB.findIndex(t => t.id === id);
    if (currentIndex === -1) return res.status(404).json({ erro: "Professor não encontrado." });

    teachersDB.splice(currentIndex, 1);
    let resultado = salvarProfessores();
    console.log(resultado);
    res.status(204).send();
});

module.exports = router;
