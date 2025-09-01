import { useState } from 'react';


export default function TodoForm({ onAdd }) {
    const [title, setTitle] = useState('');
    return (
        <div className="row" style={{ marginBottom: 12 }}>
            <input
                placeholder="Add a task..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                onKeyDown={(e) => {
                    if (e.key === 'Enter' && title.trim()) {
                        onAdd(title.trim());
                        setTitle('');
                    }
                }}
            />
            <button className="add" onClick={() => { if (title.trim()) { onAdd(title.trim()); setTitle(''); } }}>Add</button>
        </div>
    );
}