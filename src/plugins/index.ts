/**
 * Plugin Registration Entry Point
 * This file serves as the central registration point for all plugins in the application.
 * It imports plugins from their respective locations and registers them with the plugin registry.
 */

import { pluginRegistry } from './registry';
import { DemoFormPlugin } from './features/DemoFormPlugin';

// Register all available plugins
// Add new plugin registrations here as they are developed
pluginRegistry.register(DemoFormPlugin);