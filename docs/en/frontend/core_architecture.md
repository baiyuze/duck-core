# Core Architecture

The core of the frontend application is built using an Entity-Component-System (ECS) architecture. This design pattern promotes data-oriented programming and provides a flexible and extensible foundation for the application.

## Core Class

The `Core` class is the central orchestrator of the application. It manages the state, systems, and entities.

-   **`stateStore`**: A central store for all the components' data, organized by component type. Each component type is a `Map` where the key is the entity ID and the value is the component data.
-   **`system`**: An array of systems that are updated on each frame.
-   **`entityManager`**: An instance of the `Entity` class, responsible for creating and managing entities.
-   **`dsls`**: An array of `DSL` objects, which are used to initialize the components of the entities.

## Entity

An `Entity` is a unique identifier. In this application, the entity ID is also used to generate a unique color for picking objects on the canvas.

-   **`generateId()`**: Creates a new entity ID and converts it to a unique RGBA color.
-   **`rgbaToId()`**: Converts an RGBA color back to an entity ID.

## Component

A `Component` is a piece of data that can be attached to an entity. Components are simple data containers and do not contain any logic.

Examples of components include:

-   `Position`: The x and y coordinates of an entity.
-   `Size`: The width and height of an entity.
-   `Color`: The color of an entity.
-   `Rotation`: The rotation angle of an entity.
-   `Img`: The image data for an entity.
-   `Polygon`: The vertices of a polygon entity.

## System

A `System` contains the logic that operates on entities with specific components.

-   **`update(components: StateStore)`**: The main update method for a system. It receives the entire `stateStore` and can query and modify the components.
-   **`getComponentsByEntityId(components: StateStore, entityId: string)`**: A helper method to retrieve all the components for a given entity.

The `RenderSystem` is a key system that is responsible for drawing the entities on the canvas. It has different renderers for different entity types (e.g., `RectRender`, `EllipseRender`, `ImgRender`).
