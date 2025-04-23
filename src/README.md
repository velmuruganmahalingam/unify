# Unify Plugin System

## Overview

This project is a plugin-based application built with React. It provides a flexible architecture for integrating various plugins into different sections of the application, such as the header, sidebar, content, and footer.

## Architecture

- **React Components**: The application is structured using React components, with a focus on modularity and reusability.
- **Plugin System**: Plugins are dynamically loaded and organized by sections. Each plugin can be configured and managed through the settings panel.
- **Responsive Design**: The layout is responsive, ensuring a seamless experience across different screen sizes.

## How to Run the App

1. **Install Dependencies**: Ensure you have Node.js installed, then run the following command to install the necessary dependencies:
   npm install

2. **Start the Development Server: Use the following command to start the development server:
   npm start

3. **Access the Application: Open your browser and navigate to http://localhost:3000 to view the application.

Adding/Using Plugins
Plugin Registration: Plugins are registered in the pluginRegistry. Each plugin must have a unique ID, name, description, section, and component.

Plugin Configuration: Plugins can be configured through the settings panel. The configuration includes enabling/disabling the plugin and setting its position within the section.

Creating a New Plugin:

Define a new component for the plugin.

Export the plugin configuration object with the necessary properties.

Register the plugin in the pluginRegistry.

Folder Structure
src/components: Contains reusable React components.

src/pages: Contains page-level components, such as DemoPage.

src/plugins: Contains plugin-related files, including plugin types and registry.