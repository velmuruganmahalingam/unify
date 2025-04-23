/**
 * Todo Plugin Module
 * Implements a basic todo list functionality with event communication.
 * Provides task management capabilities with real-time updates.
 */

import React, { useState } from 'react';
import { Plugin } from '../types';
import { pluginEventBus } from '../eventBus';

/**
 * Interface defining the structure of a todo item
 * @property id - Unique identifier for the todo item
 * @property text - The content/description of the todo item
 * @property completed - Boolean flag indicating completion status
 */
interface TodoItem {
    id: number;
    text: string;
    completed: boolean;
}

/**
 * TodoComponent
 * A React component that implements a todo list with basic CRUD operations.
 * Features:
 * - Add new todos
 * - Toggle todo completion status
 * - Event emission for plugin communication
 */
const TodoComponent: React.FC = () => {
    /** State for managing the list of todos */
    const [todos, setTodos] = useState<TodoItem[]>([]);
    /** State for managing the new todo input field */
    const [newTodo, setNewTodo] = useState('');

    /**
     * Adds a new todo item to the list
     * Emits 'todo:added' event when successful
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
            // Emit event for other plugins
            pluginEventBus.publish('todo:added', todo);
        }
    };

    /**
     * Toggles the completion status of a todo item
     * @param id - The ID of the todo item to toggle
     */
    const toggleTodo = (id: number) => {
        setTodos(todos.map(todo => 
            todo.id === id ? { ...todo, completed: !todo.completed } : todo
        ));
    };

    return (
        <div className="p-4 border rounded-lg shadow-sm">
            <h2 className="text-lg font-semibold mb-2">Todo List</h2>
            <div className="flex gap-2 mb-4">
                <input
                    type="text"
                    value={newTodo}
                    onChange={(e) => setNewTodo(e.target.value)}
                    className="flex-1 px-3 py-1 border rounded"
                    placeholder="Add new todo"
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
 * Todo Plugin Configuration
 * Exports the plugin configuration for the todo list functionality.
 * 
 * Configuration includes:
 * - Plugin identification
 * - Display settings
 * - Position in content area
 * - Maximum todo items limit
 */
export const TodoPlugin: Plugin = {
    id: 'todo-list',
    name: 'Todo List',
    description: 'A todo list plugin with event communication',
    section: 'content',
    component: TodoComponent,
    config: {
        enabled: true,
        position: 'bottom',
        settings: {
            maxTodos: 10
        }
    },
    order: 2
};