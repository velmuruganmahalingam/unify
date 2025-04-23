/**
 * Plugin State Management Module
 * Provides functionality for persisting and retrieving plugin state data.
 * Uses localStorage for state persistence across sessions.
 */

/**
 * PluginStateManager Class
 * Static utility class for managing plugin state persistence.
 * Handles saving, loading, and clearing plugin states using localStorage.
 */
export class PluginStateManager {
    /**
     * Saves plugin state to localStorage
     * @param pluginId - Unique identifier of the plugin
     * @param state - State data to be saved
     * @throws Error if localStorage is not available or state serialization fails
     */
    static saveState(pluginId: string, state: any) {
        try {
            localStorage.setItem(`plugin_${pluginId}_state`, JSON.stringify(state));
        } catch (error) {
            console.error(`Failed to save state for plugin ${pluginId}:`, error);
        }
    }

    /**
     * Loads plugin state from localStorage
     * @param pluginId - Unique identifier of the plugin
     * @returns The parsed state data or null if no state exists or loading fails
     * @throws Error if localStorage is not available or state parsing fails
     */
    static loadState(pluginId: string) {
        try {
            const state = localStorage.getItem(`plugin_${pluginId}_state`);
            return state ? JSON.parse(state) : null;
        } catch (error) {
            console.error(`Failed to load state for plugin ${pluginId}:`, error);
            return null;
        }
    }

    /**
     * Clears plugin state from localStorage
     * @param pluginId - Unique identifier of the plugin whose state should be cleared
     */
    static clearState(pluginId: string) {
        localStorage.removeItem(`plugin_${pluginId}_state`);
    }
}