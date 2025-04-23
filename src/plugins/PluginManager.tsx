/**
 * Plugin Manager Module
 * Manages the lifecycle, state, and rendering of plugins within specified sections.
 * Handles plugin loading, state persistence, and error boundaries.
 */

import React, { useEffect, useState } from 'react';
import { Plugin } from './types';
import { pluginRegistry } from './registry';
import { pluginEventBus } from './eventBus';

/**
 * Props interface for the PluginManager component
 * @property section - The section identifier where plugins should be rendered
 */
interface PluginManagerProps {
    section: string;
}

/**
 * PluginManager Component
 * Manages the rendering and lifecycle of plugins within a specified section.
 * Features:
 * - Dynamic plugin loading
 * - State persistence
 * - Error handling
 * - Event bus integration
 */
export const PluginManager: React.FC<PluginManagerProps> = ({ section }) => {
    /** State for managing loaded plugins */
    const [plugins, setPlugins] = useState<Plugin[]>([]);
    /** State for managing error messages */
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        /**
         * Loads plugins for the specified section and restores their state
         */
        const loadPlugins = () => {
            try {
                const sectionPlugins = pluginRegistry.getPluginsBySection(section);
                setPlugins(sectionPlugins);
                
                // Restore saved state for each plugin
                sectionPlugins.forEach(plugin => {
                    const savedState = localStorage.getItem(`plugin_state_${plugin.id}`);
                    if (savedState) {
                        pluginEventBus.publish(`${plugin.id}:restore`, JSON.parse(savedState));
                    }
                });
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to load plugins');
            }
        };

        loadPlugins();

        // Subscribe to plugin state changes
        const unsubscribe = pluginEventBus.subscribe('plugin:stateChange', ({ pluginId, state }) => {
            localStorage.setItem(`plugin_state_${pluginId}`, JSON.stringify(state));
        });

        // Cleanup subscription on unmount
        return () => {
            unsubscribe();
        };
    }, [section]);

    if (error) {
        return (
            <div className="p-4 bg-red-100 text-red-700 rounded">
                Error loading plugins: {error}
            </div>
        );
    }

    return (
        <div className="plugin-manager">
            {plugins.map(plugin => {
                const PluginComponent = plugin.component;
                return (
                    <div key={plugin.id} className="plugin-wrapper mb-4">
                        <ErrorBoundary>
                            <PluginComponent />
                        </ErrorBoundary>
                    </div>
                );
            })}
        </div>
    );
};

/**
 * ErrorBoundary Class Component
 * Catches and handles errors that occur within plugin components.
 * Prevents plugin errors from crashing the entire application.
 */
class ErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean }> {
    constructor(props: { children: React.ReactNode }) {
        super(props);
        this.state = { hasError: false };
    }

    /**
     * Updates state when an error occurs
     */
    static getDerivedStateFromError() {
        return { hasError: true };
    }

    /**
     * Logs caught errors to console
     * @param error - The error that was caught
     */
    componentDidCatch(error: Error) {
        console.error('Plugin Error:', error);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="p-4 bg-yellow-100 text-yellow-700 rounded">
                    Something went wrong with this plugin.
                </div>
            );
        }
        return this.props.children;
    }
}