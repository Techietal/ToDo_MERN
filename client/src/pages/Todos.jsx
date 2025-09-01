import { useEffect, useState } from 'react';
import api from '../lib/api.js';
import TodoItem from '../components/TodoItem.jsx';
import TodoForm from '../components/TodoForm.jsx';


export default function Todos() {
    const [todos, setTodos] = useState([]);


    async function load() {
        const { data } = await api.get('/todos');
        setTodos(data);
    }


    useEffect(() => { load(); }, []);


    async function add(title) {
        const { data } = await api.post('/todos', { title });
        setTodos((t) => [data, ...t]);
    }


    async function toggle(id, completed) {
        const { data } = await api.patch(`/todos/${id}`, { completed });
        setTodos((t) => t.map((x) => (x._id === id ? data : x)));
    }


    async function remove(id) {
        await api.delete(`/todos/${id}`);
        setTodos((t) => t.filter((x) => x._id !== id));
    }


    return (
        <div className="card">
            <h2>Your Tasks</h2>
            <TodoForm onAdd={add} />
            <ul>
                {todos.map((todo) => (
                    <TodoItem key={todo._id} todo={todo} onToggle={toggle} onRemove={remove} />)
                )}
            </ul>
        </div>
    );
}