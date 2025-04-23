/**
 * Plugin System Type Definitions
 * Defines the core types and interfaces for the plugin system.
 * These types ensure proper structure and type safety for all plugins.
 */

import { PluginConfig } from './config';
import { PluginLifecycle } from './lifecycle';

/**
 * Core Plugin Interface
 * Defines the structure and requirements for all plugins in the system.
 * 
 * @interface Plugin
 * @property id - Unique identifier for the plugin
 * @property name - Display name of the plugin
 * @property description - Optional description of the plugin's functionality
 * @property section - The section where the plugin should be rendered
 * @property component - The React component that implements the plugin
 * @property config - Optional configuration settings for the plugin
 * @property lifecycle - Optional lifecycle hooks for the plugin
 * @property order - Optional rendering order within its section
 * @property dependencies - Optional array of plugin IDs that this plugin depends on
 */
export interface Plugin {
    /** Unique identifier for the plugin */
    id: string;

    /** Display name of the plugin */
    name: string;

    /** Optional description of the plugin's functionality */
    description?: string;

    /** Section where the plugin should be rendered */
    section: 'header' | 'sidebar' | 'content' | 'footer';

    /** React component that implements the plugin */
    component: React.ComponentType<any>;

    /** Optional configuration settings */
    config?: PluginConfig;

    /** Optional lifecycle hooks */
    lifecycle?: PluginLifecycle;

    /** Optional rendering order within its section */
    order?: number;

    /** Optional array of plugin IDs that this plugin depends on */
    dependencies?: string[];
}
