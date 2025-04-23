/**
 * Plugin Container Component
 * A container component that renders plugins for a specific section of the application.
 * It handles the dynamic rendering of plugin components based on their configuration.
 */

import React from 'react';
import { Plugin } from '../../plugins/types';

/**
 * Props interface for the PluginContainer component
 * @property section - The section identifier where plugins should be rendered
 * @property plugins - Array of plugin configurations to be rendered in this container
 */
interface PluginContainerProps {
    section: string;
    plugins: Plugin[];
}

/**
 * PluginContainer Component
 * Renders a collection of plugins within a specified section.
 * Each plugin is wrapped in a div with appropriate styling and data attributes.
 * 
 * @component
 * @example
 * ```tsx
 * <PluginContainer 
 *   section="content" 
 *   plugins={[plugin1, plugin2]} 
 * />
 * ```
 */
export const PluginContainer: React.FC<PluginContainerProps> = ({ section, plugins }) => {
    return (
        <div className="plugin-container" data-section={section}>
            {plugins.map(plugin => {
                // Dynamically render each plugin component with its configuration
                const PluginComponent = plugin.component;
                return (
                    <div key={plugin.id} className="plugin-wrapper">
                        <PluginComponent {...plugin.config} />
                    </div>
                );
            })}
        </div>
    );
};