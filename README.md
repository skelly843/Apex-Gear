# Mobile Mechanic Booking & Payment Website

This is a production-ready booking and payment website for a mobile mechanic, built with Next.js, Supabase, Mapbox, and Netlify. It is designed to be easily deployed and managed.

## Features

- **Customer Booking Flow:**
  - Select a service from a predefined list.
  - Enter an address, which is geocoded to determine a service zone.
  - View an availability calendar filtered by the assigned zone.
  - Select a time slot and provide customer details.
  - (Stubbed) Payment processing via Stripe.
  - View a booking confirmation page.
- **Admin Panel:**
  - Secure login via Supabase Auth.
  - Manage services (create, edit, update).
  - Manage service zones (by ZIP code list or radius).
  - Assign zones to specific dates and set working hours.
  - View and manage all bookings.
  - Block off time for vacations or other reasons.
- **Scheduling Logic:**
  - Prevents double-booking of time slots with a database-level guarantee.
  - Enforces a "one zone per day" rule.
  - Handles "out-of-zone" customers by providing contact information and a request form.
  - Implements a "hold" mechanism to temporarily reserve a slot, with automatic expiration after 10 minutes.
- **Security:**
  - Row Level Security (RLS) is enabled on all tables to protect sensitive data.
  - Admin access is restricted to authenticated users.

## Tech Stack

- **Framework:** [Next.js](https://nextjs.org/) (App Router)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **Database:** [Supabase](https://supabase.io/) (Postgres)
- **Authentication:** [Supabase Auth](https://supabase.io/docs/guides/auth)
- **Geocoding:** [Mapbox](https://www.mapbox.com/)
- **Deployment:** [Netlify](https://www.netlify.com/)
- **Language:** TypeScript

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (version 18 or later)
- [npm](https://www.npmjs.com/)
- A [Supabase](https://supabase.io/) account with a project created.
- A [Mapbox](https://www.mapbox.com/) account.

### 1. Clone the repository

```bash
git clone <repository-url>
cd <repository-directory>
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

Create a `.env.local` file by copying the example file:

```bash
cp .env.example .env.local
```

Now, fill in the values in your `.env.local` file with your project's keys.

### 4. Set up the Supabase database and Auth

1.  **Run the SQL Migrations:**
    *   In your Supabase project, navigate to the **SQL Editor**.
    *   Open and run the contents of `supabase/migrations/0001_initial_schema.sql`.
    *   Open and run the contents of `supabase/migrations/0002_rls_policies.sql`.

2.  **Create an Admin User:**
    *   Navigate to the **Authentication** section in your Supabase project dashboard.
    *   Click on **Add user** and create a new user with an email and password. This will be your admin login.
    *   **Important:** By default, new users require email confirmation. For simplicity during development, you can disable this by going to **Authentication -> Providers -> Email** and turning off the "Confirm email" toggle.

### 5. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser. The admin panel is at [http://localhost:3000/admin](http://localhost:3000/admin).

## Enabling Stripe Payments

This project is set up to allow for a simple "drop-in" activation of Stripe payments. When the Stripe environment variables are not set, the application uses a mock payment flow.

To enable live payments, follow these steps:

1.  **Sign up for a [Stripe](https://stripe.com) account.**
2.  **Get your API keys:**
    *   In your Stripe Dashboard, go to **Developers > API keys**.
    *   You will need the **Publishable key** and the **Secret key**.
3.  **Set the environment variables:**
    *   Add the following variables to your `.env.local` file and your Netlify site settings:
        *   `STRIPE_PUBLISHABLE_KEY`: Your Publishable key.
        *   `STRIPE_SECRET_KEY`: Your Secret key.
4.  **Set up the webhook:**
    *   In your Stripe Dashboard, go to **Developers > Webhooks**.
    *   Click **Add endpoint**.
    *   The endpoint URL will be `https://<your-deployed-site-url>/api/stripe-webhook`.
    *   Select the `checkout.session.completed` event.
    *   After creating the endpoint, you will get a **Signing secret**.
    *   Add this secret to your environment variables as `STRIPE_WEBHOOK_SECRET`.
5.  **Implement the API logic:**
    *   The placeholder logic in `/api/create-checkout-session/route.ts` and `/api/stripe-webhook/route.ts` will need to be replaced with the actual Stripe API calls. The current setup provides the necessary structure.

## Deployment

This project is configured for deployment on [Netlify](https://www.netlify.com/).

1.  Push your code to a GitHub repository.
2.  Create a new site on Netlify and connect it to your repository.
3.  Add your environment variables in the Netlify site settings.
4.  Trigger a deploy.

## Environment Variables

- `MAPBOX_PUBLIC_KEY`: **Required.** Public key for Mapbox geocoding.
- `SUPABASE_URL`: **Required.** URL of your Supabase project.
- `SUPABASE_ANON_KEY`: **Required.** Anonymous public key for client-side Supabase access.
- `SUPABASE_SERVICE_ROLE_KEY`: **Required.** Service role key for server-side Supabase admin access.
- `CRON_SECRET`: **Required.** A secret string to secure the scheduled function for expiring holds.
- `STRIPE_SECRET_KEY`: *Optional.* For payment processing.
- `STRIPE_PUBLISHABLE_KEY`: *Optional.* For client-side Stripe integration.
- `STRIPE_WEBHOOK_SECRET`: *Optional.* For verifying Stripe webhook events.
