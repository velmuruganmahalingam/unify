/**
 * Plugin Lifecycle Interface
 * Defines the lifecycle hooks available for plugins in the application.
 * These hooks allow plugins to execute code at specific points during their lifecycle.
 */

/**
 * Interface defining the lifecycle methods available to plugins
 * @interface PluginLifecycle
 */
export interface PluginLifecycle {
    /**
     * Called when a plugin is mounted/initialized
     * Use this hook to set up any necessary resources or state
     */
    onMount?: () => void;

    /**
     * Called when a plugin is being unmounted/destroyed
     * Use this hook to clean up any resources or subscriptions
     */
    onUnmount?: () => void;

    /**
     * Called when a plugin's props are updated
     * @param prevProps - The previous props before the update
     * Use this hook to handle prop changes and update plugin state
     */
    onUpdate?: (prevProps: any) => void;
}