# Manual Testing Plan

This document provides a set of manual test cases to verify the core functionality of the Mobile Mechanic Booking application.

## 1. Prerequisites: Seeding the Database

Before running these tests, you need to seed your Supabase database with some initial data. This will create a service, a zone, and a schedule for testing.

1.  Navigate to the **SQL Editor** in your Supabase project dashboard.
2.  Click **New query**.
3.  Paste and run the following SQL script:

```sql
-- This script is safe to run multiple times.

-- Create a sample service (if it doesn't exist)
INSERT INTO service_types (id, name, description, duration_minutes, price_cents, active)
VALUES (1, 'Standard Oil Change', 'Includes up to 5 quarts of synthetic-blend oil and a new filter.', 45, 6500, true)
ON CONFLICT (id) DO NOTHING;

-- Create a sample zone for Austin, TX (if it doesn't exist)
INSERT INTO zones (id, name, type, zip_codes, active)
VALUES (1, 'Austin Metro', 'zip_list', ARRAY['78701', '78702', '78703', '78704', '78705'], true)
ON CONFLICT (id) DO NOTHING;

-- Assign the 'Austin Metro' zone to tomorrow's date
-- This uses a bit of SQL magic to always use tomorrow's date for the assignment.
INSERT INTO zone_day_assignments (date, zone_id, working_start_time, working_end_time, is_closed, allow_mixed)
VALUES (current_date + interval '1 day', 1, '09:00:00', '17:00:00', false, false)
ON CONFLICT (date) DO UPDATE SET
  zone_id = 1,
  working_start_time = '09:00:00',
  working_end_time = '17:00:00',
  is_closed = false,
  allow_mixed = false;
```

## 2. Test Cases

### Test Case 1: Successful In-Zone Booking

**Goal:** Verify a customer can successfully book an appointment within a defined service area.

1.  **Navigate** to the application's home page.
2.  **Click** the "Book Now" button.
3.  **Select** the "Standard Oil Change" service.
4.  **Enter** an address within the "Austin Metro" zone (e.g., "1100 Congress Ave, Austin, TX 78701").
5.  **Click** "Check Availability".
6.  **Select** tomorrow's date on the calendar.
7.  **Verify** that a list of time slots is displayed (e.g., 9:00 AM, 9:15 AM, etc.).
8.  **Select** the first available time slot (e.g., 9:00 AM).
9.  **Fill out** the customer details form and click "Confirm Booking".
10. **Expected Result:** You should be redirected to the booking confirmation page. In your Supabase dashboard, a new entry should appear in the `bookings` table with a `CONFIRMED` status.

### Test Case 2: Out-of-Zone Flow

**Goal:** Verify the out-of-zone contact form is shown for addresses outside the service area.

1.  **Start** from the service selection page.
2.  **Select** the "Standard Oil Change" service.
3.  **Enter** an address outside the defined zone (e.g., "100 Main Street, Dallas, TX 75201").
4.  **Click** "Check Availability".
5.  **Expected Result:** The page should display the "Outside Our Service Area" message, along with contact links and a request form. The availability calendar should **not** be visible.

### Test Case 3: Double-Booking Prevention

**Goal:** Verify that two customers cannot book the same time slot.

1.  **Open** the booking availability page for tomorrow in two separate browser tabs (or windows).
2.  In **Tab 1**, select the 10:00 AM time slot to proceed to the checkout page. **Do not submit yet.**
3.  In **Tab 2**, select the same 10:00 AM time slot.
4.  **Complete** the booking in Tab 2 by filling out the form and clicking "Confirm Booking". The booking should succeed.
5.  **Return** to Tab 1 and complete the booking for the same 10:00 AM slot.
6.  **Expected Result:** The booking in Tab 1 should fail with an error message like "Slot is no longer available".

### Test Case 4: Admin Time-Blocking

**Goal:** Verify an admin can block off time, making it unavailable for booking.

1.  **Log in** to the admin panel.
2.  **Navigate** to the "Blocks" page.
3.  **Create** a new block for tomorrow from 1:00 PM to 2:00 PM.
4.  **Open** the customer booking flow in a new private browser window.
5.  **Navigate** to the availability page for tomorrow.
6.  **Expected Result:** The time slots between 1:00 PM and 2:00 PM should not be available for booking.

### Test Case 5: Mobile UI/UX

**Goal:** Verify the application is clean and usable on a mobile device.

1.  **Open** your browser's developer tools and switch to a mobile device view (e.g., iPhone 12/13).
2.  **Navigate** through the entire customer booking flow, from the home page to the confirmation page.
3.  **Log in** to the admin panel and navigate through the different management pages.
4.  **Expected Result:** All pages should be readable and easy to navigate. Form inputs should be usable, and there should be no visual glitches or overlapping elements.
