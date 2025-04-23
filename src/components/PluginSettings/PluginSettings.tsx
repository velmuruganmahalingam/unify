/**
 * Plugin Settings Component Module
 * Provides a user interface for configuring individual plugin settings.
 * Allows users to enable/disable plugins and change their section placement.
 */

import React from 'react';
import { Plugin } from '../../plugins/types';

/**
 * Props interface for the PluginSettings component
 * @property plugin - The plugin configuration to be modified
 * @property onSettingsChange - Callback function for handling setting changes
 */
interface PluginSettingsProps {
    /** Plugin instance to be configured */
    plugin: Plugin;
    
    /** Callback function triggered when settings are changed
     * @param enabled - Whether the plugin should be enabled
     * @param section - Optional new section for the plugin
     */
    onSettingsChange: (enabled: boolean, section?: 'header' | 'sidebar' | 'content' | 'footer') => void;
}

/**
 * PluginSettings Component
 * Renders a configuration panel for individual plugins.
 * Provides controls for:
 * - Enabling/disabling the plugin
 * - Changing the plugin's section placement
 * 
 * @component
 * @example
 * ```tsx
 * <PluginSettings 
 *   plugin={myPlugin}
 *   onSettingsChange={(enabled, section) => handleChange(enabled, section)}
 * />
 * ```
 */
export const PluginSettings: React.FC<PluginSettingsProps> = ({ plugin, onSettingsChange }) => {
    return (
        <div className="p-4 border rounded">
            <h3 className="font-medium">{plugin.name}</h3>
            <div className="space-y-3">
                {/* Plugin enable/disable toggle */}
                <label className="flex items-center">
                    <input
                        type="checkbox"
                        checked={plugin.config?.enabled}
                        onChange={(e) => onSettingsChange(e.target.checked)}
                        className="mr-2"
                    />
                    Enable Plugin
                </label>
                
                {/* Section selection dropdown */}
                <div>
                    <label className="block text-sm">Section:</label>
                    <select 
                        value={plugin.section}
                        onChange={(e) => onSettingsChange(
                            plugin.config?.enabled || false, 
                            e.target.value as 'header' | 'sidebar' | 'content' | 'footer'
                        )}
                        className="mt-1 block w-full p-2 border rounded"
                    >
                        <option value="header">Header</option>
                        <option value="sidebar">Sidebar</option>
                        <option value="content">Content</option>
                        <option value="footer">Footer</option>
                    </select>
                </div>
            </div>
        </div>
    );
};