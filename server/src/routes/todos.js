import express from 'express';
import Todo from '../models/Todo.js';
import { auth } from '../middleware/auth.js';


const router = express.Router();
router.use(auth);


// List
router.get('/', async (req, res) => {
const todos = await Todo.find({ user: req.userId }).sort('-createdAt');
res.json(todos);
});


// Create
router.post('/', async (req, res) => {
const { title } = req.body;
if (!title) return res.status(400).json({ message: 'Title required' });
const todo = await Todo.create({ user: req.userId, title });
res.status(201).json(todo);
});


// Update
router.patch('/:id', async (req, res) => {
const { id } = req.params;
const { title, completed } = req.body;
const update = {};
if (title !== undefined) update.title = title;
if (completed !== undefined) update.completed = completed;
const todo = await Todo.findOneAndUpdate({ _id: id, user: req.userId }, { $set: update }, { new: true });
if (!todo) return res.status(404).json({ message: 'Not found' });
res.json(todo);
});


// Delete
router.delete('/:id', async (req, res) => {
const { id } = req.params;
const todo = await Todo.findOneAndDelete({ _id: id, user: req.userId });
if (!todo) return res.status(404).json({ message: 'Not found' });
res.json({ ok: true });
});


export default router;