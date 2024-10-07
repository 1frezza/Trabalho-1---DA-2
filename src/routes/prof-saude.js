const express = require('express');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const router = express.Router();
const profissionaisFilePath = path.resolve(__dirname, '../db/prof_saude.json');

function loadProfissionais() {
    try {
        return JSON.parse(fs.readFileSync(profissionaisFilePath, 'utf8'));
    } catch (err) {
        return [];
    }
}

function saveProfissionais(profissionaisDB) {
    try {
        fs.writeFileSync(profissionaisFilePath, JSON.stringify(profissionaisDB, null, 2));
        return "Profissionais de saúde salvos com sucesso.";
    } catch (err) {
        console.error("Erro ao salvar profissionais:", err);
        return "Erro ao salvar profissionais.";
    }
}

/**
 * @swagger
 * components:
 *   schemas:
 *     Profissionais da Saúde:
 *       type: object
 *       required:
 *         - id
 *         - name
 *         - specialty
 *         - contact
 *         - phone_number
 *         - status
 *       properties:
 *         id:
 *           type: string
 *           description: O id é gerado automaticamente
 *         name:
 *           type: string
 *           description: Nome do Profissional.
 *         specialty:
 *           type: string
 *           description: Especialidade do Profissional.
 *         contact:
 *           type: string
 *           description: Email de contato do profissional.
 *         phone_number:
 *           type: string
 *           description: Telefone de contato do profissional.
 *         status:
 *           type: string
 *           description: Status do profissional (on/off).
 *       example:
 *         id: "3b7ed1910cf4d78bbf1f07d013a9c252aeec6e42"
 *         name: "Larissa Mendes"
 *         specialty: "Nutricionista"
 *         contact: "lm.nutri@gmail.com"
 *         phone_number: "48 9999 1234"
 *         status: "on"
 */

/**
 * @swagger 
 * tags:
 *   name: Profissionais da Saúde
 *   description: API para gerenciamento de profissionais da saúde. Criado por Kauan Flávio Rosso.
 */

/**
 * @swagger
 * /prof-saude:
 *   get:
 *     summary: Retorna uma lista de todos os profissionais de saúde 
 *     tags: [Profissionais da Saúde]
 *     description: Este endpoint retorna uma lista de todos os profissionais de saúde. Criado por Kauan Flávio Rosso.
 *     responses:
 *       200:
 *         description: A lista de profissionais de saúde
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Profissionais da Saúde'
 */

// GET "/prof-saude"
router.get('/', (req, res) => {
    const profissionaisDB = loadProfissionais();
    res.json(profissionaisDB);
});

/**
 * @swagger
 * /prof-saude/{id}:
 *   get:
 *     summary: Retorna um profissional de saúde pelo ID 
 *     tags: [Profissionais da Saúde]
 *     description: Este endpoint retorna um profissional de saúde pelo ID. Criado por Kauan Flávio Rosso.
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID do profissional de saúde
 *     responses:
 *       200:
 *         description: Um profissional de saúde pelo ID
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Profissionais da Saúde'
 *       404:
 *         description: Profissional não encontrado
 */

// GET "/prof-saude/{id}"
router.get('/:id', (req, res) => {
    const id = req.params.id;
    const profissionaisDB = loadProfissionais();
    const profissional = profissionaisDB.find((prof) => prof.id === id);
    if (!profissional) return res.status(404).json({ "erro": "Profissional não encontrado!" });
    res.json(profissional);
});

/**
 * @swagger
 * /prof-saude:
 *   post:
 *     summary: Cria um novo profissional de saúde 
 *     tags: [Profissionais da Saúde]
 *     description: Este endpoint cria um novo profissional de saúde. Criado por Kauan Flávio Rosso.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Profissionais da Saúde'
 *     responses:
 *       200:
 *         description: O profissional foi criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Profissionais da Saúde'
 */

// POST "/prof-saude"
router.post('/', (req, res) => {
    const novoProfissional = {
        id: uuidv4(),
        ...req.body
    };
    const profissionaisDB = loadProfissionais();
    profissionaisDB.push(novoProfissional);
    const resultado = saveProfissionais(profissionaisDB);
    return res.json(novoProfissional);
});

/**
 * @swagger
 * /prof-saude/{id}:
 *   put:
 *     summary: Atualiza um profissional de saúde pelo ID 
 *     tags: [Profissionais da Saúde]
 *     description: Este endpoint atualiza um profissional de saúde pelo ID. Criado por Kauan Flávio Rosso.
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID do profissional de saúde
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Profissionais da Saúde'
 *     responses:
 *       200:
 *         description: O profissional de saúde foi atualizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Profissionais da Saúde'
 *       404:
 *         description: Profissional não encontrado
 */

// PUT "/prof-saude/{id}"
router.put('/:id', (req, res) => {
    const id = req.params.id;
    const profissionaisDB = loadProfissionais();
    const indiceAtual = profissionaisDB.findIndex((prof) => prof.id === id);
    if (indiceAtual === -1) 
        return res.status(404).json({ "erro": "Profissional não encontrado!" });

    // Atualizando o profissional
    const profissionalAtualizado = { id, ...req.body };
    profissionaisDB[indiceAtual] = profissionalAtualizado;
    const resultado = saveProfissionais(profissionaisDB);
    return res.json(profissionalAtualizado);
});

/**
 * @swagger
 * /prof-saude/{id}:
 *   delete:
 *     summary: Remove um profissional de saúde pelo ID 
 *     tags: [Profissionais da Saúde]
 *     description: Este endpoint remove um profissional de saúde pelo ID. Criado por Kauan Flávio Rosso.
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID do profissional de saúde
 *     responses:
 *       200:
 *         description: O profissional de saúde foi removido com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Profissionais da Saúde'
 *       404:
 *         description: Profissional não encontrado
 */

// DELETE "/prof-saude/{id}"
router.delete('/:id', (req, res) => {
    const id = req.params.id;
    const profissionaisDB = loadProfissionais();
    const indiceAtual = profissionaisDB.findIndex((prof) => prof.id === id);
    if (indiceAtual === -1) return res.status(404).json({ "erro": "Profissional não encontrado!" });

    const deletado = profissionaisDB.splice(indiceAtual, 1);
    saveProfissionais(profissionaisDB);
    res.json(deletado);
});

module.exports = router;
