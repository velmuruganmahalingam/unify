import { Plugin } from './types';

/**
 * Registry for managing plugins in the application.
 * Handles plugin registration, unregistration, and retrieval by section or ID.
 */
class PluginRegistry {
    /** Map to store plugins with their IDs as keys */
    private plugins: Map<string, Plugin> = new Map();
    
    /** Predefined valid sections where plugins can be placed */
    private sections: Set<string> = new Set(['header', 'sidebar', 'content', 'footer']);

    /**
     * Registers a new plugin in the registry.
     * @param plugin - The plugin to register
     * @throws Error if the plugin's section is invalid
     */
    register(plugin: Plugin): void {
        if (!this.sections.has(plugin.section)) {
            throw new Error(`Invalid section: ${plugin.section}`);
        }
        this.plugins.set(plugin.id, plugin);
    }

    /**
     * Removes a plugin from the registry.
     * @param pluginId - The ID of the plugin to unregister
     */
    unregister(pluginId: string): void {
        this.plugins.delete(pluginId);
    }

    /**
     * Retrieves a plugin by its ID.
     * @param pluginId - The ID of the plugin to retrieve
     * @returns The plugin if found, undefined otherwise
     */
    getPlugin(pluginId: string): Plugin | undefined {
        return this.plugins.get(pluginId);
    }

    /**
     * Retrieves all plugins assigned to a specific section.
     * @param section - The section to filter plugins by
     * @returns Array of plugins in the specified section
     */
    getPluginsBySection(section: string): Plugin[] {
        return Array.from(this.plugins.values())
            .filter(plugin => plugin.section === section);
    }
}

/** Singleton instance of the plugin registry */
export const pluginRegistry = new PluginRegistry();