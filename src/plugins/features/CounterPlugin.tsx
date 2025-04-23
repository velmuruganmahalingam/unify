/**
 * Counter Plugin Module
 * Implements a simple counter with persistent state and event bus integration.
 * Demonstrates plugin lifecycle management and state persistence.
 */

import React, { useState, useEffect } from 'react';
import { Plugin } from '../types';
import { pluginEventBus } from '../eventBus';

/**
 * Counter Component
 * A React component that implements a counter with increment/decrement functionality.
 * Features:
 * - Persistent state using localStorage
 * - Event bus integration for external control
 * - Automatic state restoration on mount
 */
const CounterComponent: React.FC = () => {
    /** State to track the current count value */
    const [count, setCount] = useState(0);

    useEffect(() => {
        // Lifecycle: Mount - Restore saved state
        const savedCount = localStorage.getItem('counter_state');
        if (savedCount) {
            setCount(parseInt(savedCount, 10));
        }

        // Subscribe to external reset events
        const unsubscribe = pluginEventBus.subscribe('counter:reset', () => {
            setCount(0);
        });

        return () => {
            // Lifecycle: Unmount - Save state and cleanup
            localStorage.setItem('counter_state', count.toString());
            unsubscribe();
        };
    }, [count]);

    return (
        <div className="p-4 border rounded-lg shadow-sm">
            <h2 className="text-lg font-semibold mb-2">Counter Plugin</h2>
            <div className="flex items-center gap-4">
                <button 
                    onClick={() => setCount(prev => prev - 1)}
                    className="px-3 py-1 bg-red-500 text-white rounded"
                >
                    -
                </button>
                <span className="text-xl">{count}</span>
                <button 
                    onClick={() => setCount(prev => prev + 1)}
                    className="px-3 py-1 bg-green-500 text-white rounded"
                >
                    +
                </button>
            </div>
        </div>
    );
};

/**
 * Counter Plugin Configuration
 * Exports the plugin configuration for the counter component.
 * 
 * Features:
 * - Unique identifier
 * - Display name and description
 * - Section placement
 * - Component reference
 * - Plugin configuration
 * - Rendering order
 */
export const CounterPlugin: Plugin = {
    id: 'counter',
    name: 'Counter',
    description: 'A simple counter plugin',
    section: 'content',
    component: CounterComponent,
    config: {
        enabled: true,
        position: 'top',
        settings: {}
    },
    order: 1
};