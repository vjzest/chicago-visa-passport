# Chicago Passport & Visa Expedite

Welcome to the Chicago Passport & Visa Expedite project, a modern web application built using Next.js, Shadcn, Tailwind CSS, and TypeScript. It is designed to help users apply for and manage their U.S. passports. It provides different services like new passport applications, renewals, child passports, and handling of lost or damaged passports. The application guides users through the process, helps them fill out the necessary forms, and manages their cases.

## Tech Stack & Major Libraries

- **Framework:** [Next.js](https://nextjs.org/) (React framework)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/) with [Shadcn/ui](https://ui.shadcn.com/) for component primitives.
- **State Management:** [Zustand](https://github.com/pmndrs/zustand) for global and persistent state.
- **Form Handling:** [React Hook Form](https://react-hook-form.com/) for managing form state and validation, coupled with [Zod](https://zod.dev/) for schema validation.
- **HTTP Requests:** [Axios](https://axios-http.com/) with `axios-cache-interceptor` for caching API requests.
- **UI Components:**
  - [Radix UI](https://www.radix-ui.com/): Primitives for building accessible components (used by Shadcn).
  - [Lucide React](https://lucide.dev/): Icon library.
  - [Sonner](https://sonner.emilkowal.ski/): For toast notifications.
- **Utilities:**
  - `date-fns` & `date-fns-tz`: For date manipulation and timezone handling.
  - `clsx` & `tailwind-merge`: For conditional class name management.

## Folder Structure

- **`/` (Root):** Contains configuration files for Next.js (`next.config.mjs`), TypeScript (`tsconfig.json`), Tailwind CSS (`tailwind.config.ts`), ESLint (`.eslintrc.json`), and Prettier (`.prettierrc`).
- **`/public`:** Stores static assets like images, SVGs, and documents that are publicly accessible.
- **`/src/app`:** The main application directory for Next.js App Router.
  - **`/(client)`:** Contains client-side routes like the dashboard, settings, and application forms.
  - **`/(home)`:** Contains public-facing pages like the homepage, about us, contact, etc.
- **`/src/components`:** Reusable React components, organized by feature or page (e.g., `auth`, `dashboard`, `globals`).
- **`/src/data`:** Holds static data used throughout the application, such as the detailed information for different passport services in `services.ts`.
- **`/src/hooks`:** Contains custom React hooks for shared logic.
- **`/src/lib`:** Core application logic, configurations, and utilities.
  - **`/config`:** Axios instance configuration.
  - **`/constants`:** Application-wide constants like image paths and navigation links.
  - **`/endpoints`:** API fetching logic, organized by resource (e.g., `cases`, `user`).
  - **`/types`:** TypeScript type definitions and interfaces.
  - **`/utils`:** Utility functions for various tasks.
- **`/src/store`:** Global state management using Zustand, with separate stores for authentication, case data, and application state.
- **`/src/svgs`:** Stores SVG files that are used as React components.
- **`/src/types`:** Global TypeScript type definitions.

## Core Logic Deep Dive

### State Management (`src/store`)

The application uses Zustand for efficient and lightweight state management. State is modularized into several stores:

- **`useAuthStore`:** Manages authentication state, including `isLoggedIn` status. It persists the state to `localStorage`.
- **`useCaseStore`:** A comprehensive store that holds all data related to a user's passport application case. This includes form data, user details, billing information, and tracking status. It also persists to `localStorage`.
- **`useDataStore`:** Caches master data fetched from the server, such as service types, service levels, and additional services, to avoid redundant API calls.
- **`usePassportApplicationStore`:** Manages the state for the multi-step passport application form, persisting data to `sessionStorage` to retain form state across page reloads within a session.

### Custom Hooks (`src/hooks`)

- **`useCheckToken`:** Checks for a user token in `localStorage` on application load to determine if the user is logged in. It verifies the token with the backend and updates the auth state.
- **`useFetchStoreData`:** Fetches and populates the `useDataStore` with essential data like service types and levels when the application loads.
- **`useHydration`:** A simple utility hook to prevent server-side rendering mismatches by confirming when the component has mounted on the client.
- **`useSidebarToggle`:** Manages the open/closed state of the dashboard sidebar, persisting the user's preference in `localStorage`.
- **`useStore`:** A generic hook to safely access Zustand store data in a way that avoids hydration errors with server-rendered components.
- **`useMediaQuery`:** A hook to track whether the viewport matches a given CSS media query.

### Utilities & Configuration (`src/lib`)

- **`lib/config/axios.ts`:** Configures a global Axios instance. It includes an interceptor to automatically attach the auth token to requests and another interceptor to handle 401 Unauthorized errors by logging the user out and redirecting to the login page. It also sets up caching for GET requests.
- **`lib/endpoints/endpoint.ts`:** Defines classes (`GeneralFetchApi`, `CasesFetchApi`, etc.) that encapsulate API calls for different parts of the application, providing a clean and organized way to interact with the backend.
- **`lib/form-schema.ts`:** Contains Zod schemas for form validation. The `generateFormSchema` function dynamically creates a Zod schema from a configuration object, allowing for flexible and reusable form structures.
- **`lib/utils.ts`:** A collection of helper functions for common tasks like:
  - `cn`: Merging and applying conditional Tailwind CSS classes.
  - `camelCaseToNormalCase` / `normalToCamelcase`: String case conversions.
  - `getFormattedDateAndTime`: Date formatting.
  - `formatName`, `isValidEmail`, `validateUSZip`: Input formatting and validation.
- **`lib/date.ts`:** Provides utility functions for date calculations, such as checking if a date is a certain number of years in the past (`isMoreThanYearsAgo`) and calculating age (`calculateAge`).

## Routing Overview

The project uses the Next.js App Router. Routes are organized into groups:

- **Home Routes (`(home)`):** These are the public-facing marketing and informational pages, such as `/home`, `/about-us`, `/contact-us`, and detailed pages for each passport service.
- **Client Routes (`(client)`):** These routes are for authenticated users and include the main application logic, such as the multi-step application form (`/apply`), the user dashboard (`/dashboard`), and account settings (`/dashboard/settings`).

## Installation

Ensure you have [pnpm](https://pnpm.io/installation) installed on your machine.

1.  Clone the repository:
    ```bash
    git clone <repo url>
    ```
2.  Navigate to the project directory:
    ```bash
    cd <folder name>
    ```
3.  Install dependencies:
    ```bash
    pnpm install
    ```

## Running the Development Server

Start the development server with the following command:

```bash
pnpm dev
```

Visit [http://localhost:3000](http://localhost:3000) to view the application in development mode.

## Building for Production

To create an optimized production build, run:

```bash
pnpm build
```
