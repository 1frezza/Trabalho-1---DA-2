const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');

// Carregar base de dados de estudantes
var StudentsDB = carregarEstudantes();

function carregarEstudantes() {
    try {
        return JSON.parse(fs.readFileSync('./src/db/students.json', 'utf8'));
    } catch (err) {
        return [];
    }
}

function salvarEstudantes() {
    try {
        fs.writeFileSync('./src/db/students.json', JSON.stringify(StudentsDB, null, 2));
        return "Estudantes salvos!";
    } catch (err) {
        return "Erro ao salvar!";
    }
}

/**
 * @swagger
 * components:
 *   schemas:
 *     Student:
 *       type: object
 *       required:
 *         - id
 *         - name
 *         - age
 *         - parents
 *         - phone_number
 *         - special_needs
 *         - status
 *       properties:
 *         id:
 *           type: string
 *           description: O ID é gerado automaticamente.
 *         name:
 *           type: string
 *           description: Nome do estudante.
 *         age:
 *           type: string
 *           description: Idade do estudante.
 *         parents:
 *           type: string
 *           description: Pais ou responsáveis pelo estudante.
 *         phone_number:
 *           type: string
 *           description: Número de telefone para contato.
 *         special_needs:
 *           type: string
 *           description: Necessidades especiais (se houver).
 *         status:
 *           type: string
 *           description: Status do estudante (ativo ou inativo).
 *       example:
 *         id: "7a6cc1282c5f6ec0235acd2bfa780145aa2a67fd"
 *         name: "Bingo Heeler"
 *         age: "6"
 *         parents: "Bandit Heeler e Chilli Heeler"
 *         phone_number: "48 9696 5858"
 *         special_needs: "Síndrome de Down"
 *         status: "on"
 */

/**
 * @swagger
 * /students:
 *   get:
 *     summary: Retorna uma lista de todos os estudantes
 *     tags: [Students]
 *     responses:
 *       200:
 *         description: A lista de estudantes
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Student'
 */
router.get('/', (req, res) => {
    console.log("Método GET.");
    StudentsDB = carregarEstudantes();
    res.json(StudentsDB);
});

/**
 * @swagger
 * /students/{id}:
 *   get:
 *     summary: Retorna um estudante pelo ID
 *     tags: [Students]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID do estudante
 *     responses:
 *       200:
 *         description: Dados do estudante
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Student'
 *       404:
 *         description: Estudante não encontrado
 */
router.get('/:id', (req, res) => {
    const id = req.params.id;
    StudentsDB = carregarEstudantes();
    const student = StudentsDB.find(student => student.id === id);
    if (!student) {
        return res.status(404).json({ erro: "Estudante não encontrado!" });
    }
    res.json(student);
});

/**
 * @swagger
 * /students:
 *   post:
 *     summary: Cria um novo estudante
 *     tags: [Students]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Nome do estudante
 *               age:
 *                 type: string
 *                 description: Idade do estudante
 *               parents:
 *                 type: string
 *                 description: Pais ou responsáveis
 *               phone_number:
 *                 type: string
 *                 description: Número de telefone
 *               special_needs:
 *                 type: string
 *                 description: Necessidades especiais (se houver)
 *             required:
 *               - name
 *               - age
 *               - parents
 *               - phone_number
 *     responses:
 *       201:
 *         description: Estudante criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Student'
 */
router.post('/', (req, res) => {
    const { name, age, parents, phone_number, special_needs } = req.body;

    // Verificar se todos os campos obrigatórios estão preenchidos
    if (!name || !age || !parents || !phone_number) {
        return res.status(400).json({ erro: "Todos os campos obrigatórios devem ser preenchidos!" });
    }

    const newStudent = {
        id: uuidv4(),
        name,
        age,
        parents,
        phone_number,
        special_needs: special_needs || null, // Campo opcional
        status: "on" // Status padrão
    };

    StudentsDB = carregarEstudantes();
    StudentsDB.push(newStudent);
    let resultado = salvarEstudantes();
    console.log(resultado);
    return res.status(201).json(newStudent);
});

/**
 * @swagger
 * /students/{id}:
 *   put:
 *     summary: Atualiza os dados de um estudante
 *     tags: [Students]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID do estudante
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Student'
 *     responses:
 *       200:
 *         description: Estudante atualizado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Student'
 *       404:
 *         description: Estudante não encontrado
 */
router.put('/:id', (req, res) => {
    const id = req.params.id;
    const { name, age, parents, phone_number, special_needs, status } = req.body;

    StudentsDB = carregarEstudantes();
    const currentStudent = StudentsDB.find(student => student.id === id);
    if (!currentStudent) {
        return res.status(404).json({ erro: "Estudante não encontrado!" });
    }

    // Atualizar os dados do estudante
    currentStudent.name = name || currentStudent.name;
    currentStudent.age = age || currentStudent.age;
    currentStudent.parents = parents || currentStudent.parents;
    currentStudent.phone_number = phone_number || currentStudent.phone_number;
    currentStudent.special_needs = special_needs || currentStudent.special_needs;
    currentStudent.status = status || currentStudent.status;

    salvarEstudantes();
    return res.json(currentStudent);
});

/**
 * @swagger
 * /students/{id}:
 *   delete:
 *     summary: Remove um estudante
 *     tags: [Students]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID do estudante
 *     responses:
 *       204:
 *         description: Estudante removido com sucesso
 *       404:
 *         description: Estudante não encontrado
 */
router.delete('/:id', (req, res) => {
    const id = req.params.id;
    StudentsDB = carregarEstudantes();
    const currentIndex = StudentsDB.findIndex(student => student.id === id);
    if (currentIndex === -1) {
        return res.status(404).json({ erro: "Estudante não encontrado!" });
    }

    const deletedStudent = StudentsDB.splice(currentIndex, 1);
    salvarEstudantes();
    res.status(204).json(deletedStudent);
});

module.exports = router;
