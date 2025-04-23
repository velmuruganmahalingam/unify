/**
 * Plugin Configuration Module
 * Defines the configuration interface and default settings for plugins.
 * This module provides a standardized way to configure plugin behavior and settings.
 */

/**
 * Interface defining the configuration options available for plugins
 * @interface PluginConfig
 * @property enabled - Determines if the plugin is active
 * @property position - Optional positioning of the plugin in its container
 * @property settings - Optional custom settings specific to each plugin
 */
export interface PluginConfig {
    /** Whether the plugin is enabled or disabled */
    enabled: boolean;
    
    /** Optional position setting for plugin placement */
    position?: string;
    
    /** Optional custom settings as key-value pairs */
    settings?: Record<string, any>;
}

/**
 * Default configuration values for plugins
 * Used when specific configurations are not provided
 */
export const defaultConfig: PluginConfig = {
    enabled: true,
    position: 'left',
    settings: {}
};
