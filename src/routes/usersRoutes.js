const express = require('express')
const router = express.Router()
const { v4: uuidv4 } = require('uuid')
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
      return "Usuário salvo!"
    } catch (err) {
      return "Erro ao salvar!";
    }
  }

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - id
 *         - nome
 *       properties:
 *         id:
 *           type: string
 *           description: O id é gerado automáticamente pelo cadastro do usuário
 *         nome:
 *           type: string
 *           description: Nome do Usuário
  *       example:
 *         id: afr0b6d0-a69b-4938-b116-f2e8e0d08542
 *         nome: Caio Hobold
 */

 /**
  * @swagger
  * tags:
  *   name: Users
  *   description: 
  *     API de Controle de Usuários
  *     **por Caio Hobold**
  */

 /**
 * @swagger
 * /users:
 *   get:
 *     summary: Retorna uma lista de todos os usuários
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: A lista de usuários
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 */

// GET "/users"
router.get('/', (req, res) =>{
    console.log("Método GET.");
    usersDB = carregarUsuarios();
    res.json(usersDB);
})

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Retorna um usuário pelo ID
 *     tags: [Users]
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
 *         contens:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       404:
 *         description: Usuário não encontrado
 */

// GET "/users/1"
router.get('/:id', (req, res) => {
    const id = req.params.id
    usersDB = carregarUsuarios();
    var user = usersDB.find((user) => user.id === id )
    if(!user) return res.status(404).json({
        "erro": "Usuário não encontrado!"
    })
    res.json(user)
})

/**
 * @swagger
 * /users:
 *   post:
 *     summary: Cria um novo usuário
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       200:
 *         description: O usuário foi criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 */

// POST "/users" BODY { "nome": "Eragon"}
router.post('/', (req, res) => {
    const novoUsuario = {
        id: uuidv4(),
        ...req.body
    }
    console.log(novoUsuario);
    usersDB = carregarUsuarios();
    usersDB.push(novoUsuario)
    let resultado = salvarUsuarios();
    console.log(resultado);
    return res.json(novoUsuario)
})

/**
 * @swagger
 * /users/{id}:
 *  put:
 *    summary: Atualiza um usuário pelo ID
 *    tags: [Users]
 *    parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *        required: true
 *        description: ID do usuário
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/User'
 *    responses:
 *      200:
 *        description: O usuário foi atualizado com sucesso
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/User'
 *      404:
 *        description: Usuário não encontrado
 */

// PUT "/users/1" BODY { "nome": "Eragon"}
router.put('/:id', (req, res) => {
    const id = req.params.id
    const user = req.body
    usersDB = carregarUsuarios();
    const currentUser = usersDB.find((user) => user.id === id )
    const currentIndex = usersDB.findIndex((user) => user.id === id )
    if(!currentUser) 
        return res.status(404).json({
        "erro": "Usuário não encontrado!"
    })
    usersDB[currentIndex] = user
    let resultado = salvarUsuarios();
    console.log(resultado);
    return res.json(user)
})

/**
 * @swagger
 * /users/{id}:
 *   delete:
 *     summary: Remove um usuário pelo ID
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID do usuário
 *     responses:
 *       200:
 *         description: O usuário foi removido com sucesso
 *         content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/User'
 *       404:
 *         description: Usuário não encontrado
 */

// DELETE "/users/1"
router.delete('/:id', (req, res) => {
    const id = req.params.id
    usersDB = carregarUsuarios();
    const currentUser = usersDB.find((user) => user.id === id )
    const currentIndex = usersDB.findIndex((user) => user.id === id )
    if(!currentUser) return res.status(404).json({
        "erro": "Usuário não encontrado!"
    })
    var deletado = usersDB.splice(currentIndex, 1)
    let resultado = salvarUsuarios();
    console.log(resultado);
    res.json(deletado)
})

module.exports = router