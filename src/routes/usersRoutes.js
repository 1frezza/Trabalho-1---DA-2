const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');

var usersDB = carregarUsuarios();

function carregarUsuarios() {
    try {
        return JSON.parse(fs.readFileSync('./src/db/users.json', 'utf8'));
    } catch (err) {
        return [];
    }
}

function salvarUsuarios() {
    try {
        fs.writeFileSync('./src/db/users.json', JSON.stringify(usersDB, null, 2));
        return "Usuário salvo!";
    } catch (err) {
        return "Erro ao salvar!";
    }
}

/**
 * @swagger
 * components:
 *   schemas:
 *     Usuários:
 *       type: object
 *       required:
 *         - id
 *         - nome
 *         - email
 *         - user
 *         - pwd
 *         - level
 *         - status
 *       properties:
 *         id:
 *           type: string
 *           description: O ID é gerado automaticamente.
 *         nome:
 *           type: string
 *           description: Nome do usuário.
 *         email:
 *           type: string
 *           description: E-mail do usuário.
 *         user:
 *           type: string
 *           description: Nome de identificação do usuário.
 *         pwd:
 *           type: string
 *           description: Senha do usuário.
 *         level:
 *           type: string
 *           description: Perfil de acesso do usuário.
 *         status:
 *           type: string
 *           description: Status atual do usuário.
 *       example:
 *         id: "afr0b6d0-a69b-4938-b116-f2e8e0d08542"
 *         nome: "Caio Hobold"
 *         email: "caio.hobold@nextfit.com.br"
 *         user: "caio.hobold"
 *         pwd: "afr0b6d0-a69b-4938-b116-f2e8e0d08542"
 *         level: "admin"
 *         status: "on"
 */

/**
 * @swagger
 * tags:
 *   name: Usuários
 *   description: API para gerenciamento de usuários. Criado por Caio Hobold
 */

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Retorna uma lista de todos os usuários
 *     tags: [Usuários]
 *     responses:
 *       200:
 *         description: A lista de usuários
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Usuários'
 */

// GET "/users"
router.get('/', (req, res) => {
    console.log("Método GET.");
    usersDB = carregarUsuarios();
    res.json(usersDB);
});

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Retorna um usuário pelo ID
 *     tags: [Usuários]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID do usuário
 *     responses:
 *       200:
 *         description: Um usuário pelo ID
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Usuários'
 *       404:
 *         description: Usuário não encontrado
 */

// GET "/users/1"
router.get('/:id', (req, res) => {
    const id = req.params.id;
    usersDB = carregarUsuarios();
    var user = usersDB.find((user) => user.id === id);
    if (!user) return res.status(404).json({
        "erro": "Usuário não encontrado!"
    });
    res.json(user);
});

/**
 * @swagger
 * /users:
 *   post:
 *     summary: Cria um novo usuário
 *     tags: [Usuários]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Usuários'
 *     responses:
 *       201:
 *         description: O usuário foi criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Usuários'
 */

// POST "/users" BODY { "nome": "Eragon"}
router.post('/', (req, res) => {
    const idGerado = uuidv4();
    const novoUsuario = {
        id: idGerado,
        pwd: idGerado,
        ...req.body
    };
    console.log(novoUsuario);
    usersDB = carregarUsuarios();
    usersDB.push(novoUsuario);
    let resultado = salvarUsuarios();
    console.log(resultado);
    return res.status(201).json(novoUsuario);
});

/**
 * @swagger
 * /users/{id}:
 *   put:
 *     summary: Atualiza um usuário pelo ID
 *     tags: [Usuários]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID do usuário
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Usuários'
 *     responses:
 *       200:
 *         description: O usuário foi atualizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Usuários'
 *       404:
 *         description: Usuário não encontrado
 */

// PUT "/users/1" BODY { "nome": "Eragon"}
router.put('/:id', (req, res) => {
    const id = req.params.id;
    const user = req.body;
    usersDB = carregarUsuarios();
    const currentUser = usersDB.find((user) => user.id === id);
    const currentIndex = usersDB.findIndex((user) => user.id === id);
    if (!currentUser) 
        return res.status(404).json({
            "erro": "Usuário não encontrado!"
        });
    usersDB[currentIndex] = { ...currentUser, ...user }; // Atualiza os dados do usuário
    let resultado = salvarUsuarios();
    console.log(resultado);
    return res.json(usersDB[currentIndex]);
});

/**
 * @swagger
 * /users/{id}:
 *   delete:
 *     summary: Remove um usuário pelo ID
 *     tags: [Usuários]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID do usuário
 *     responses:
 *       204:
 *         description: O usuário foi removido com sucesso
 *       404:
 *         description: Usuário não encontrado
 */

// DELETE "/users/1"
router.delete('/:id', (req, res) => {
    const id = req.params.id;
    usersDB = carregarUsuarios();
    const currentUser = usersDB.find((user) => user.id === id);
    const currentIndex = usersDB.findIndex((user) => user.id === id);
    if (!currentUser) return res.status(404).json({
        "erro": "Usuário não encontrado!"
    });
    usersDB.splice(currentIndex, 1);
    let resultado = salvarUsuarios();
    console.log(resultado);
    res.status(204).json(); // Resposta 204 sem corpo
});

module.exports = router;
