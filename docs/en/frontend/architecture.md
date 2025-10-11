# Frontend Architecture

This document provides an overview of the frontend architecture.

## Technology Stack

-   **Framework**: [React](https://reactjs.org/)
-   **Build Tool**: [Vite](https://vitejs.dev/)
-   **Language**: [TypeScript](https://www.typescriptlang.org/)
-   **Styling**: CSS Modules (`.module.scss`)

## Project Structure

The `frontend/src` directory is organized as follows:

-   **/assets**: Static assets like images and icons.
-   **/Canvas**: Contains the main React component for the drawing canvas.
-   **/Core**: The core logic of the application, built on an Entity-Component-System (ECS) architecture.
-   **/Plugins**: A directory for plugins that can extend the core functionality.
-   **main.tsx**: The entry point of the React application.
-   **App.tsx**: The root React component.

## Core Concepts

The application is centered around a canvas where users can interact with various objects. The core logic is designed to be highly modular and extensible, using an Entity-Component-System (ECS) pattern.

-   **Entity**: A general-purpose object, which is essentially an ID.
-   **Component**: A block of data that can be associated with an entity. For example, `Position`, `Color`, `Size`.
-   **System**: The logic that operates on entities with a certain set of components. For example, the `RenderSystem` is responsible for drawing entities that have `Position` and `Size` components.

This architecture separates data (Components) from logic (Systems), making it easier to add new features and manage complexity.
