/**
 * Plugin Lazy Loading Module
 * Provides functionality for dynamically loading plugins on demand.
 * This helps reduce initial bundle size and improve application performance.
 */

/**
 * Dynamically loads a plugin by its ID
 * @param pluginId - The unique identifier of the plugin to load
 * @returns Promise resolving to the loaded plugin component
 * @throws Error if plugin loading fails
 * 
 * @example
 * ```ts
 * const MyPlugin = await lazyLoadPlugin('my-plugin-id');
 * ```
 */
export const lazyLoadPlugin = async (pluginId: string) => {
    try {
        // Dynamically import the plugin module
        const plugin = await import(`./plugins/${pluginId}`);
        return plugin.default;
    } catch (error) {
        // Log and re-throw loading errors
        console.error(`Failed to load plugin ${pluginId}:`, error);
        throw error;
    }
};

/**
 * Type definition for a lazily loaded plugin
 * Represents a promise that resolves to a React component
 */
export type LazyPlugin = Promise<React.ComponentType<any>>;