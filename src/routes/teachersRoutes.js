const express = require('express');
const router = express.Router();

let teachers = []; 

// GET 
router.get('/', (req, res) => {
    res.json(teachers);
});

// GET by id
router.get('/:id', (req, res) => {
    const teacher = teachers.find(t => t.id === parseInt(req.params.id));
    if (!teacher) return res.status(404).send('Professor não encontrado.');
    res.json(teacher);
});

// POST
router.post('/', (req, res) => {
    const teacher = {
        id: teachers.length + 1,
        name: req.body.name,
        subject: req.body.subject
    };
    teachers.push(teacher);
    res.status(201).json(teacher);
});

// PUT
router.put('/:id', (req, res) => {
    const teacher = teachers.find(t => t.id === parseInt(req.params.id));
    if (!teacher) return res.status(404).send('Professor não encontrado.');

    teacher.name = req.body.name;
    teacher.subject = req.body.subject;
    res.json(teacher);
});

// DELETE
router.delete('/:id', (req, res) => {
    const teacherIndex = teachers.findIndex(t => t.id === parseInt(req.params.id));
    if (teacherIndex === -1) return res.status(404).send('Professor não encontrado.');

    teachers.splice(teacherIndex, 1);
    res.status(204).send();
});

module.exports = router;
