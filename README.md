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
  - Manage services (create, edit, update).
  - Manage service zones (by ZIP code list or radius).
  - Assign zones to specific dates and set working hours.
  - View and manage all bookings.
  - Block off time for vacations or other reasons.
- **Scheduling Logic:**
  - Prevents double-booking of time slots.
  - Enforces a "one zone per day" rule.
  - Handles "out-of-zone" customers by providing contact information.
  - Implements a "hold" mechanism to temporarily reserve a slot while the customer completes the booking.

## Tech Stack

- **Framework:** [Next.js](https://nextjs.org/) (App Router)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **Database:** [Supabase](https://supabase.io/) (Postgres)
- **Geocoding:** [Mapbox](https://www.mapbox.com/)
- **Deployment:** [Netlify](https://www.netlify.com/)
- **Language:** TypeScript

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (version 18 or later)
- [npm](https://www.npmjs.com/)
- A [Supabase](https://supabase.io/) account
- A [Mapbox](https://www.mapbox.com/) account

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

Now, fill in the values in your `.env.local` file:

- `MAPBOX_PUBLICKEY`: Your public key from Mapbox.
- `SUPABASE_URL`: Your Supabase project URL.
- `SUPABASE_ANON_PUBLIC_KEY`: Your Supabase anonymous public key.
- `SUPABASE_SERVICE_ROLE_KEY`: Your Supabase service role key (found in your project's API settings).
- The `STRIPE_*` variables can be left blank for now.

### 4. Set up the Supabase database

1.  In your Supabase project, navigate to the **SQL Editor**.
2.  Click on **New query**.
3.  Copy the contents of `supabase/migrations/0001_initial_schema.sql` and paste it into the SQL editor.
4.  Run the query to create the necessary tables and functions.

### 5. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the application. The admin panel is available at [http://localhost:3000/admin](http://localhost:3000/admin).

## Deployment

This project is configured for easy deployment on [Netlify](https://www.netlify.com/).

1.  **Push your code to a GitHub repository.**
2.  **Create a new site on Netlify** and connect it to your GitHub repository.
3.  **Configure the build settings:**
    - **Build command:** `npm run build`
    - **Publish directory:** `.next`
    The `netlify.toml` file in this repository should configure this automatically.
4.  **Add your environment variables** in the Netlify site settings (under **Site configuration > Environment variables**). Make sure to add all the variables from your `.env.local` file.
5.  **Trigger a deploy.** Netlify will automatically build and deploy your site.

## Environment Variables

- `MAPBOX_PUBLICKEY`: **Required.** Public key for Mapbox geocoding.
- `SUPABASE_URL`: **Required.** URL of your Supabase project.
- `SUPABASE_ANON_PUBLIC_KEY`: **Required.** Anonymous public key for client-side Supabase access.
- `SUPABASE_SERVICE_ROLE_KEY`: **Required.** Service role key for server-side Supabase admin access.
- `STRIPE_SECRET_KEY`: *Optional.* Your Stripe secret key for payment processing.
- `STRIPE_PUBLISHABLE_KEY`: *Optional.* Your Stripe publishable key for the client-side Stripe integration.
- `STRIPE_WEBHOOK_SECRET`: *Optional.* Your Stripe webhook secret for verifying webhook events.
