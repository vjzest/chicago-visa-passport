## Jet Passports Server

This project is a Node.js application for handling the server of Jet Passports, written in TypeScript using MongoDB as primary DB and redis for cache.

## Project Structure

The project is organized into the following directories:

- **`/config`**: Contains configuration files for different parts of the application.

  - `database.ts`: Configuration for the MongoDB connection.
  - `redis.ts`: Configuration for Redis.

- **`/controllers`**: Handles the incoming requests and sends responses. The logic is separated based on user roles (`admin`, `common`, `user`).

  - `/admin`: Controllers for administrative functionalities.
  - `/common`: Controllers for functionalities shared between different roles.
  - `/user`: Controllers for user-specific actions.

- **`/dist`**: This directory contains the compiled JavaScript code from the TypeScript source files.

- **`/interfaces`**: Defines TypeScript interfaces used throughout the application to ensure type safety.

- **`/middlewares`**: Contains middleware functions that are executed before the request reaches the controller.

  - `auth.middleware.ts`: Handles authentication and authorization.
  - `error.middleware.ts`: A centralized error handler.

- **`/models`**: Defines the Mongoose schemas and models for the MongoDB database. Each file corresponds to a collection in the database.

- **`/public`**: Stores static files that can be served to the client.

- **`/routes`**: Defines the API endpoints and maps them to the corresponding controllers. The structure mirrors the `controllers` directory, with subdirectories for `admin`, `common`, and `user` routes.

- **`/services`**: Contains the core business logic of the application. Services are called by the controllers and interact with the models. This separates the business logic from the request/response handling.

- **`/templates`**: Contains templates (e.g., EJS files) that can be used for generating dynamic content like emails or reports.

- **`/types`**: Holds custom TypeScript type definitions used across the project.

- **`/utils`**: A collection of utility functions and helper scripts for various tasks.
  - `cron.ts`, `fedex-tracking-cron.ts`: Scripts for scheduled tasks.
  - `fedex.ts`, `s3.ts`: Helpers for interacting with external services.
  - `pdf.ts`: Utility for PDF generation.

## Key Files in Root

- `index.ts`: The main entry point of the application.
- `package.json`: Lists the project dependencies and scripts.
- `tsconfig.json`: The configuration file for the TypeScript compiler.
- `.gitignore`: Specifies which files and directories to ignore in version control.

## Getting Started

### Prerequisites

- Node.js
- pnpm
- Redis (can still work without it, but needs in case of redis usage)

### Installation

1. Clone the repository.
2. Install dependencies:
   ```bash
   pnpm install
   ```
3. Set up your environment variables by creating a `.env` file.
4. Start the development server:
   ```bash
   pnpm run dev
   ```

## Services

This section provides an overview of the services located in the `services` directory.

### Admin Services (`/services/admin`)

- **`accounts.service.ts`**: Handles fetching user account data for administrative purposes.
- **`additional.service.ts`**: Manages the creation, modification, and retrieval of additional services that can be attached to a case.
- **`admins.service.ts`**: Manages administrator accounts, including creation, updates, and retrieval. It also handles logic for finding and assigning case managers.
- **`auth.service.ts`**: Manages authentication for administrators, including login and profile data retrieval.
- **`blogs.service.ts`**: Handles the business logic for creating, updating, and finding blog posts.
- **`cases-duplication.service.ts`**: Provides functionality to detect, review, and manage potential duplicate cases to ensure data integrity.
- **`cases-ppt-doc.service.ts`**: Manages the lifecycle of passport documents within a case, including approval, rejection, and expert review workflows.
- **`cases-query.service.ts`**: Implements complex querying and filtering logic to retrieve case data based on various criteria for administrative views.
- **`cases-updation.service.ts`**: Contains a wide range of functions for modifying existing cases, such as updating case managers, statuses, service levels, and handling related payments and notifications.
- **`cases.service.ts`**: Handles core case operations like manual payment charges, tracking email events, and processing initial order submissions.
- **`config.service.ts`**: Manages global application settings, including FedEx options, legal policies (T&C, privacy), and payment gateway configurations.
- **`contact-info.service.ts`**: Manages the publicly displayed contact information for the business.
- **`dashboard.service.ts`**: Provides data for the admin dashboard, such as fetching FAQs.
- **`faq.service.ts`**: Manages the full lifecycle of Frequently Asked Questions (FAQs).
- **`fedex-packages.service.ts`**: Handles the tracking and management of FedEx shipments related to cases, including identifying delays.
- **`files.service.ts`**: Manages the uploading, retrieval, and deletion of both general and case-specific files.
- **`forms.service.ts`**: Provides logic for creating and managing dynamic forms and their fields within the application.
- **`loa.service.ts`**: Manages the upload, update, and retrieval of Letter of Authorization (LOA) documents.
- **`logs.service.ts`**: Handles the creation and retrieval of system-wide activity logs.
- **`nmi.payment.service.ts`**: Implements the payment processing logic using the NMI gateway, handling various transaction types and complex payment scenarios.
- **`processor.service.ts`**: Manages the configuration of different payment processors and gateways.
- **`promo.service.ts`**: Handles the creation, management, and validation of promotional codes.
- **`reports.service.ts`**: Generates various administrative reports on cases, transactions, and case manager performance.
- **`roles.service.ts`**: Manages user roles and their associated permissions within the application.
- **`service-levels.service.ts`**: Manages the different tiers of service levels offered to users.
- **`service-types.service.ts`**: Manages the types of passport services offered and their specific requirements.
- **`shippings.service.ts`**: Manages the shipping locations used for processing applications.
- **`status.service.ts`**: Manages the various statuses and sub-statuses that a case can transition through.
- **`transaction.service.ts`**: Handles the creation of transaction records, particularly for refunds and voids, and updates the associated case.

### Common Services (`/services/common`)

- **`cases.service.ts`**: Handles the initial creation of a case, including user creation, payment processing, and sending initial confirmation emails. It serves as the primary entry point for new applications.
- **`contact.service.ts`**: Manages the submission and resolution of contact or consultation requests from users.
- **`contingent.service.ts`**: Manages the process for handling incomplete or "contingent" cases, primarily by sending reminder emails to users to complete their applications.
- **`mail.service.ts`**: Provides a centralized service for sending emails through the Brevo (formerly Sendinblue) API. It handles various email types, including templated invoices and plain text messages, and can track email delivery events.
- **`promo.service.ts`**: Contains logic for validating and retrieving details about a specific promotional code.
- **`tracking.service.ts`**: Provides a common interface for tracking shipments, currently using the FedEx API.

### User Services (`/services/user`)

- **`accounts.service.ts`**: Manages user-specific account operations, such as retrieving profile information and handling password updates.
- **`addresses.service.ts`**: Handles the creation, retrieval, updating, and deletion of user shipping addresses.
- **`auth.service.ts`**: Manages the entire user authentication lifecycle, including login, signup, email verification, and password reset functionality using OTPs.
- **`case.service.ts`**: Contains logic for user interactions with their cases, such as viewing case details, submitting documents for review, updating tracking information, and requesting cancellations.
- **`nmi-api-client.service.ts`**: Provides a dedicated client for making direct API calls to the NMI payment gateway.
- **`passport-form.service.ts`**: Manages the multi-step passport application form. It handles saving progress for each section, calculating completion percentage, and triggering the automated filling of the official government PDF form.
- **`serial.service.ts`**: Responsible for generating unique, random 8-digit case numbers to avoid collisions.
- **`service-types.service.ts`**: Fetches the list of available passport service types to be displayed to the user.
- **`transactions.service.ts`**: Retrieves a user's transaction history and invoice details for their cases.
