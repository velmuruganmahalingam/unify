/**
 * Plugin Event Bus Module
 * Implements a publish/subscribe (pub/sub) pattern for plugin communication.
 * Allows plugins to communicate with each other through events without direct coupling.
 */

/**
 * Type definition for event handler functions
 * @param data - The data passed with the event
 */
type EventHandler = (data: any) => void;

/**
 * PluginEventBus Class
 * Manages event subscriptions and publications between plugins.
 * Implements a simple pub/sub pattern with error handling and cleanup methods.
 */
class PluginEventBus {
    /** Map to store event handlers for each event type */
    private events: Map<string, EventHandler[]> = new Map();
    
    /**
     * Subscribes to an event
     * @param event - The event name to subscribe to
     * @param handler - The callback function to execute when event occurs
     * @returns Function to unsubscribe from the event
     */
    subscribe(event: string, handler: EventHandler) {
        if (!this.events.has(event)) {
            this.events.set(event, []);
        }
        this.events.get(event)?.push(handler);

        // Return unsubscribe function
        return () => {
            const handlers = this.events.get(event);
            if (handlers) {
                const index = handlers.indexOf(handler);
                if (index > -1) {
                    handlers.splice(index, 1);
                }
            }
        };
    }
    
    /**
     * Publishes an event with data
     * @param event - The event name to publish
     * @param data - The data to pass to event handlers
     */
    publish(event: string, data: any) {
        const handlers = this.events.get(event);
        if (handlers) {
            handlers.forEach(handler => {
                try {
                    handler(data);
                } catch (error) {
                    console.error(`Error in event handler for ${event}:`, error);
                }
            });
        }
    }

    /**
     * Clears all handlers for a specific event
     * @param event - The event name to clear
     */
    clear(event: string) {
        this.events.delete(event);
    }

    /**
     * Clears all events and their handlers
     */
    clearAll() {
        this.events.clear();
    }
}

// Create a singleton instance for global use
export const pluginEventBus = new PluginEventBus();

// Export types for TypeScript support
export type { EventHandler };