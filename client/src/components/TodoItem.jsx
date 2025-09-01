// client/src/components/TodoItem.jsx
export default function TodoItem({ todo, onToggle, onRemove }) {
    const handleToggle = () => onToggle(todo._id, !todo.completed);

    const handleKey = (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleToggle();
        }
    };

    return (
        <li
            className={`todo-box ${todo.completed ? 'is-complete' : ''}`}
            onClick={handleToggle}
            role="button"
            tabIndex={0}
            onKeyDown={handleKey}
            aria-pressed={todo.completed}
            aria-label={todo.completed ? 'Mark as not done' : 'Mark as done'}
        >
            {/* keep a checkbox for accessibility, but ignore clicks (box handles it) */}
            <input
                type="checkbox"
                checked={todo.completed}
                onChange={(e) => onToggle(todo._id, e.target.checked)}
                className="todo-check"
                tabIndex={-1}
                aria-hidden="true"
            />

            <span className="title">{todo.title}</span>

            {/* Delete icon (stops click from toggling) */}
            <button
                className="icon-btn"
                title="Delete"
                aria-label="Delete"
                onClick={(e) => {
                    e.stopPropagation();
                    onRemove(todo._id);
                }}
            >
                🗑
            </button>
        </li>
    );
}
