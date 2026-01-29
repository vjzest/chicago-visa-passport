# Jet Passports Admin Panel

This is the admin panel for the Jet Passports application, built with Next.js and TypeScript.

## Development Tools

This project is built with a modern tech stack, including:

- **Framework:** Next.js
- **Language:** TypeScript
- **Styling:** Tailwind CSS, shadcn/ui
- **State Management:** Zustand
- **Form Handling:** React Hook Form, Zod
- **Tables:** Tanstack Table
- **Rich Text Editing:** Tiptap, React Quill
- **API Communication:** Axios
- **Linting & Formatting:** ESLint, Prettier

## Folder Structure

The project follows a standard Next.js `app` directory structure. Here's a breakdown of the key folders:

- **`/public`**: Contains static assets like images and icons.

- **`/src/app`**: The core of the application, with route-based folder organization.
  - **`/(auth)`**: Handles authentication-related pages, such as the login page.
  - **`/(plain)`**: Contains pages with a minimal layout, like the case data view for printing.
  - **`/(site)`**: The main application layout, containing all the protected routes and features.
    - **`/cases`**: Manages everything related to cases, including viewing by status, user, and individual case details.
    - **`/configure`**: A section for administrators to configure various aspects of the application, such as contact info, email templates, fees, and policies.
    - **`/manage-roles`**: Allows for the creation and management of user roles and permissions.
    - **`/manage-users`**: Provides tools for adding, editing, and managing admin users.
    - **Other folders**: Each folder in `(site)` corresponds to a specific feature, such as `blogs`, `faq`, `files`, `forms`, etc.

- **`/src/components`**: Contains all the reusable React components.
  - **`/globals`**: Houses globally used components like the admin panel layout, custom table, buttons, and form elements.
  - **`/pages`**: Contains components that are specific to a particular page or feature.
  - **`/ui`**: Includes the UI components from shadcn/ui, such as `Button`, `Card`, `Input`, etc.

- **`/src/hooks`**: Custom React hooks used throughout the application, like `use-access` for handling user permissions.

- **`/src/interfaces`**: Defines TypeScript interfaces for data structures like `IAdmin`, `IRole`, `IStatus`, etc.

- **`/src/lib`**: A library of utility functions, constants, and configuration files.
  - **`/constants`**: Contains constant values like US states.
  - **`menu-list.ts`**: Defines the sidebar navigation menu.
  - **`utils.ts`**: A collection of helper functions for tasks like date formatting and string manipulation.

- **`/src/services`**: Manages services used for the application.
  - **`/axios`**: Configures the Axios instance for making API requests.
  - **`/end-points`**: Defines the API endpoints for different services.

- **`/src/store`**: Contains the Zustand store for global state management, such as the admin user's information and access permissions.

- **`/src/types`**: Defines various TypeScript types used across the application.

## Getting Started

To get started with the development, you'll need to have Node.js and pnpm installed.
- Note : make sure you have necessary env variables from the ``.env.template`` file.

1. **Install dependencies:**
   ```bash
   pnpm install
   ```

2. **Run the development server:**
   ```bash
   pnpm dev
   ```

The application will be available at `http://localhost:3000` or 3001, 3002 so on when the port is occupied.

## How to Make Changes

To make changes to the application, you should first identify the relevant section based on the folder structure. For example:

- To modify a UI component, look in `/src/components/ui`. The project uses shadcn components for many reusable components.
- To change the logic of a specific page, navigate to the corresponding folder in `/src/app/(site)`.
- To add a new API endpoint, create a new file in `/src/services/end-points`. Use the functions by importing wherever necessary.

## Important Notes:

- By default we use a cache to store axios call data for a few seconds to prevent any api calls caused by mishandled renders. If you are adding a new API call, which is also a refresh function, then make sure to use the option ``cache: false`` so that it fetches new data after changes even within few seconds.

- In case you are adding a rich text editor use `tiptap` instead of `react-quill` as it is more modern and safe.
