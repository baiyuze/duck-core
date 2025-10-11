# Data Models

This document describes the main data models used in the backend service.

## User

Represents a user of the application.

| Field       | Type      | Description                                  |
| :---------- | :-------- | :------------------------------------------- |
| `ID`        | `int`     | Primary key.                                 |
| `Name`      | `string`  | User's name.                                 |
| `Account`   | `string`  | User's account name for login.               |
| `Password`  | `string`  | User's hashed password.                      |
| `Roles`     | `[]*Role` | Roles assigned to the user (many-to-many).   |
| `Departments` | `[]*Department` | Departments the user belongs to (many-to-many). |
| `Phone`     | `string`  | User's phone number.                         |
| `Email`     | `string`  | User's email address.                        |
| `CreateTime`| `time.Time` | Timestamp of user creation.                |
| `UpdateTime`| `time.Time` | Timestamp of last user update.             |

## Role

Represents a user role, which is a collection of permissions.

| Field         | Type            | Description                                    |
| :------------ | :-------------- | :--------------------------------------------- |
| `ID`          | `int`           | Primary key.                                   |
| `Name`        | `string`        | Name of the role.                              |
| `Users`       | `[]*User`       | Users with this role (many-to-many).           |
| `Permissions` | `[]*Permission` | Permissions granted by this role (many-to-many). |
| `Description` | `string`        | A description of the role.                     |
| `CreateTime`  | `time.Time`     | Timestamp of role creation.                    |
| `UpdateTime`  | `time.Time`     | Timestamp of last role update.                 |

## Permission

Represents a specific permission that can be granted to a role.

| Field         | Type      | Description                        |
| :------------ | :-------- | :--------------------------------- |
| `ID`          | `int`     | Primary key.                       |
| `Name`        | `string`  | Name of the permission.            |
| `Roles`       | `[]*Role` | Roles that have this permission (many-to-many). |
| `Description` | `string`  | A description of the permission.   |
| `CreateTime`  | `time.Time` | Timestamp of permission creation.  |
| `UpdateTime`  | `time.Time` | Timestamp of last permission update. |

## Department

Represents a department or team within the organization.

| Field         | Type      | Description                               |
| :------------ | :-------- | :---------------------------------------- |
| `ID`          | `int`     | Primary key.                              |
| `Name`        | `string`  | Name of the department.                   |
| `ParentID`    | `int`     | ID of the parent department (for tree structure). |
| `Sort`        | `int`     | Sort order.                               |
| `Status`      | `uint8`   | Status (1=enabled, 0=disabled).           |
| `Description` | `string`  | A description of the department.          |
| `Users`       | `[]*User` | Users in this department (many-to-many).  |
| `CreateTime`  | `time.Time` | Timestamp of department creation.         |
| `UpdateTime`  | `time.Time` | Timestamp of last department update.      |

## Dict

Represents a dictionary of key-value pairs.

| Field         | Type          | Description                               |
| :------------ | :------------ | :---------------------------------------- |
| `ID`          | `int`         | Primary key.                              |
| `Name`        | `string`      | Name of the dictionary.                   |
| `En`          | `string`      | English name of the dictionary.           |
| `Code`        | `string`      | Unique code for the dictionary.           |
| `Description` | `string`      | A description of the dictionary.          |
| `Items`       | `[]*DictItem` | Items in the dictionary (one-to-many).    |
| `CreateTime`  | `time.Time`   | Timestamp of dictionary creation.         |
| `UpdateTime`  | `time.Time`   | Timestamp of last dictionary update.      |

## DictItem

Represents an item within a dictionary.

| Field      | Type     | Description                               |
| :--------- | :------- | :---------------------------------------- |
| `ID`       | `int`    | Primary key.                              |
| `DictCode` | `string` | Foreign key to the `Dict` model.          |
| `Value`    | `string` | The value of the item.                    |
| `LabelZh`  | `string` | Chinese label for the item.               |
| `LabelEn`  | `string` | English label for the item.               |
| `Sort`     | `int`    | Sort order.                               |
| `Status`   | `string` | Status (e.g., '1' for enabled).           |
