/**
 * Demo Page Module
 * A demonstration page that showcases the plugin system functionality.
 * Provides a realistic page layout with responsive design for all screen sizes.
 */

import React, { useState } from 'react';
import { PluginContainer } from '../components/PluginContainer/PluginContainer';
import { pluginRegistry } from '../plugins/registry';
import { PluginSettings } from '../components/PluginSettings/PluginSettings';
import { Plugin } from '../plugins/types';

/**
 * DemoPage Component
 * Renders a demonstration interface showing plugin system capabilities.
 * Features:
 * - Dynamic plugin loading and organization by sections
 * - Plugin settings management
 * - Error handling for plugin operations
 * - Responsive layout for different screen sizes
 */
export const DemoPage: React.FC = () => {
    /** Type definition for plugin sections */
    type PluginSection = 'header' | 'sidebar' | 'content' | 'footer';
    
    /** Available plugin sections */
    const sections: PluginSection[] = ['header', 'sidebar', 'content', 'footer'];

    /** State for managing plugins and their configurations */
    const [plugins, setPlugins] = useState<Plugin[]>(() => {
        const sections = ['header', 'sidebar', 'content', 'footer'] as const;
        return sections.flatMap(section => pluginRegistry.getPluginsBySection(section));
    });
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    /** Error state for handling plugin operations */
    const [error, setError] = useState<string | null>(null);
    
    /**
     * Updates plugin settings
     * @param enabled - Whether the plugin should be enabled
     * @param section - The section where the plugin should be displayed
     * @param pluginId - The ID of the plugin to update
     */
    const handleSettingsChange = (
        enabled: boolean,
        section: PluginSection | undefined,
        pluginId: string
    ) => {
        try {
            setPlugins(prevPlugins => 
                prevPlugins.map(plugin => 
                    plugin.id === pluginId 
                        ? { ...plugin, config: { ...plugin.config, enabled }, section: section || plugin.section } 
                        : plugin
                )
            );
        } catch (err) {
            setError('Failed to update plugin settings');
            console.error(err);
        }
    };

    /**
     * Filters plugins by section
     * @param section - The section to filter by
     * @returns Array of plugins for the specified section
     */
    const getPluginsBySection = (section: PluginSection) => {
        return plugins.filter(plugin => plugin.section === section);
    };

    return (
        <div className="min-h-screen flex flex-col">
            {/* Header Section - Full Width */}
            <section className="w-full bg-blue-50 p-4 border-b">
                <h2 className="text-xl font-semibold mb-3">Header Plugins</h2>
                <PluginContainer 
                    section="header" 
                    plugins={getPluginsBySection('header')}
                />
            </section>

            {/* Main Content Area */}
            <div className="flex-grow flex flex-col lg:flex-row">
                {/* Mobile Navigation Toggle */}
                <div className="lg:hidden p-4 bg-gray-100">
                    <button 
                        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                        className="w-full py-2 px-4 bg-blue-500 text-white rounded-lg"
                    >
                        Toggle Sidebar
                    </button>
                </div>

                {/* Sidebar - Responsive */}
                <section className={`
                    ${isSidebarOpen ? 'block' : 'hidden'} 
                    lg:block w-full lg:w-64 bg-gray-50 p-4 border-b lg:border-r lg:border-b-0
                `}>
                    <h2 className="text-xl font-semibold mb-3">Sidebar Plugins</h2>
                    <PluginContainer 
                        section="sidebar" 
                        plugins={getPluginsBySection('sidebar')}
                    />
                </section>

                {/* Main Content - Flexible Width */}
                <div className="flex-1 flex flex-col lg:flex-row">
                    {/* Content Area */}
                    <section className="flex-1 bg-white p-4 order-1 lg:order-none">
                        <h2 className="text-xl font-semibold mb-3">Content Plugins</h2>
                        <PluginContainer 
                            section="content" 
                            plugins={getPluginsBySection('content')}
                        />
                    </section>

                    {/* Settings Panel - Responsive */}
                    <section className="w-full lg:w-80 bg-gray-50 p-4 border-t lg:border-l lg:border-t-0">
                        <h2 className="text-xl font-semibold mb-3">Plugin Settings</h2>
                        <div className="space-y-4">
                            {plugins.map(plugin => (
                                <PluginSettings
                                    key={plugin.id}
                                    plugin={plugin}
                                    onSettingsChange={(enabled, section) => 
                                        handleSettingsChange(enabled, section, plugin.id)}
                                />
                            ))}
                        </div>
                    </section>
                </div>
            </div>

            {/* Footer Section - Full Width */}
            <section className="w-full bg-gray-100 p-4 border-t mt-auto">
                <h2 className="text-xl font-semibold mb-3">Footer Plugins</h2>
                <PluginContainer 
                    section="footer" 
                    plugins={getPluginsBySection('footer')}
                />
            </section>
        </div>
    );
};
