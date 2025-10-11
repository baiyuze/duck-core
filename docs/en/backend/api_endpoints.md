# API Endpoints

This document lists the API endpoints exposed by the backend service. All endpoints are prefixed with `/api`.

## Authentication

-   `POST /users/login`: User login.
-   `POST /users/register`: User registration.

## Users

-   `GET /users/`: Get a list of users.
-   `PUT /users/:id`: Update a user's role.
-   `DELETE /users/`: Delete a user.
-   `GET /users/auth`: Test JWT authentication.

## Roles

-   `GET /roles/`: Get a list of roles.
-   `POST /roles/`: Create a new role.
-   `DELETE /roles/`: Delete a role.
-   `PUT /roles/:id`: Update a role.
-   `PUT /roles/permissions/:id`: Update the permissions for a role.

## Permissions

-   `GET /permissions/`: Get a list of permissions.
-   `POST /permissions/`: Create a new permission.
-   `DELETE /permissions/`: Delete a permission.
-   `PUT /permissions/:id`: Update a permission.

## Departments

-   `GET /departments/`: Get a list of departments.
-   `POST /departments/`: Create a new department.
-   `DELETE /departments/`: Delete a department.
-   `PUT /departments/:id`: Update a department.
-   `POST /departments/:id/users`: Bind a user to a department.

## Dictionaries

-   `GET /dicts/`: Get a list of dictionaries.
-   `POST /dicts/`: Create a new dictionary.
-   `DELETE /dicts/`: Delete a dictionary.
-   `PUT /dicts/:id`: Update a dictionary.
-   `GET /dicts/:code`: Get options for a dictionary by its code.

## RPC

-   `GET /rpc/test`: Test RPC call.
