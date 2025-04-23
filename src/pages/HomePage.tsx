/**
 * Home Page Component
 * The main landing page component that organizes and displays plugins in different sections.
 * It uses PluginContainer components to render plugins in their respective sections:
 * header, sidebar, content, and footer.
 */

import React from 'react';
import { PluginContainer } from '../components/PluginContainer/PluginContainer';
import { pluginRegistry } from '../plugins/registry';

/**
 * HomePage Component
 * Renders the main page layout with plugin containers for different sections.
 * Uses the plugin registry to fetch and display plugins based on their designated sections.
 * 
 * Layout Structure:
 * - Header section at the top
 * - Content area with sidebar and main content
 * - Footer section at the bottom
 * 
 * @component
 * @example
 * ```tsx
 * <HomePage />
 * ```
 */
export const HomePage: React.FC = () => {
    return (
        <div className="page-container">
            {/* Header section plugins */}
            <PluginContainer 
                section="header" 
                plugins={pluginRegistry.getPluginsBySection('header')} 
            />
            
            {/* Main content layout with sidebar and content area */}
            <div className="content-layout">
                {/* Sidebar section plugins */}
                <PluginContainer 
                    section="sidebar" 
                    plugins={pluginRegistry.getPluginsBySection('sidebar')} 
                />
                
                {/* Main content section plugins */}
                <PluginContainer 
                    section="content" 
                    plugins={pluginRegistry.getPluginsBySection('content')} 
                />
            </div>
            
            {/* Footer section plugins */}
            <PluginContainer 
                section="footer" 
                plugins={pluginRegistry.getPluginsBySection('footer')} 
            />
        </div>
    );
};