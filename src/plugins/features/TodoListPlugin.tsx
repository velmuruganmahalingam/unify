/**
 * Todo List Plugin Module
 * Implements a simple todo list with event communication capabilities.
 * Demonstrates plugin state management and event bus integration.
 */

import React, { useState } from 'react';
import { Plugin } from '../types';
import { pluginEventBus } from '../eventBus';

/**
 * Interface defining the structure of a todo item
 * @property id - Unique identifier for the todo item
 * @property text - Content of the todo item
 * @property completed - Completion status of the todo item
 */
interface Todo {
    id: number;
    text: string;
    completed: boolean;
}

/**
 * TodoList Component
 * A React component that implements a todo list with add and toggle functionality.
 * Features:
 * - Add new todos with enter key or button click
 * - Toggle todo completion status
 * - Event emission for todo changes
 * - Real-time UI updates
 */
const TodoListComponent: React.FC = () => {
    /** State for managing todo items */
    const [todos, setTodos] = useState<Todo[]>([]);
    /** State for managing new todo input */
    const [newTodo, setNewTodo] = useState('');

    /**
     * Adds a new todo item to the list
     * Emits 'todo:added' event when a new todo is added
     */
    const addTodo = () => {
        if (newTodo.trim()) {
            const todo = {
                id: Date.now(),
                text: newTodo,
                completed: false
            };
            setTodos([...todos, todo]);
            setNewTodo('');
            // Emit event when todo is added
            pluginEventBus.publish('todo:added', todo);
        }
    };

    /**
     * Toggles the completion status of a todo item
     * @param id - ID of the todo item to toggle
     * Emits 'todo:toggled' event when a todo's status is changed
     */
    const toggleTodo = (id: number) => {
        const updatedTodos = todos.map(todo => 
            todo.id === id ? { ...todo, completed: !todo.completed } : todo
        );
        setTodos(updatedTodos);
        // Emit event when todo is toggled
        pluginEventBus.publish('todo:toggled', id);
    };

    return (
        <div className="p-4 border rounded-lg shadow-sm">
            <h2 className="text-lg font-semibold mb-2">Todo List Plugin</h2>
            <div className="flex gap-2 mb-4">
                <input
                    type="text"
                    value={newTodo}
                    onChange={(e) => setNewTodo(e.target.value)}
                    className="flex-1 px-3 py-1 border rounded"
                    placeholder="Add new todo"
                    onKeyDown={(e) => e.key === 'Enter' && addTodo()}
                />
                <button 
                    onClick={addTodo}
                    className="px-4 py-1 bg-blue-500 text-white rounded"
                >
                    Add
                </button>
            </div>
            <ul className="space-y-2">
                {todos.map(todo => (
                    <li 
                        key={todo.id}
                        className="flex items-center gap-2"
                    >
                        <input
                            type="checkbox"
                            checked={todo.completed}
                            onChange={() => toggleTodo(todo.id)}
                        />
                        <span className={todo.completed ? 'line-through' : ''}>
                            {todo.text}
                        </span>
                    </li>
                ))}
            </ul>
        </div>
    );
};

/**
 * Todo List Plugin Configuration
 * Exports the plugin configuration for the todo list component.
 * 
 * Features:
 * - Unique identifier
 * - Display name and description
 * - Section placement
 * - Component reference
 * - Plugin configuration
 * - Rendering order
 */
export const TodoListPlugin: Plugin = {
    id: 'todo-list',
    name: 'Todo List',
    description: 'A todo list plugin with event communication',
    section: 'content',
    component: TodoListComponent,
    config: {
        enabled: true,
        position: 'bottom',
        settings: {}
    },
    order: 2
};