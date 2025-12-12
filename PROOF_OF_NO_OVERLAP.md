# Proof of No-Overlap Guarantee

This document demonstrates how the database schema prevents double-booking using a PostgreSQL `EXCLUDE` constraint. This provides a "bulletproof" guarantee that no two `CONFIRMED` or `HOLD` bookings can occupy the same time slot, even if two customers attempt to book simultaneously.

## The `EXCLUDE` Constraint

The `bookings` table is defined with the following constraint in `supabase/migrations/0001_initial_schema.sql`:

```sql
CREATE TABLE bookings (
    -- ... other columns
    start_time TIMESTAMPTZ NOT NULL,
    end_time TIMESTAMPTZ NOT NULL,
    status booking_status NOT NULL,
    -- ... other columns
    EXCLUDE USING GIST (
        tstzrange(start_time, end_time) WITH &&
    ) WHERE (status IN ('HOLD', 'CONFIRMED'))
);
```

### How it Works

1.  **`tstzrange(start_time, end_time)`**: This creates a timestamp range from the `start_time` to the `end_time` of the booking.
2.  **`WITH &&`**: This is the "overlaps" operator. It checks if two timestamp ranges have any time in common.
3.  **`WHERE (status IN ('HOLD', 'CONFIRMED'))`**: This is a partial index condition. The constraint only applies to rows where the `status` is either `HOLD` or `CONFIRMED`. This allows `CANCELLED` or `EXPIRED` bookings to overlap, as they do not represent actual appointments.
4.  **`EXCLUDE USING GIST`**: This tells PostgreSQL to build a GiST index that enforces this exclusion. If a new or updated row would cause an overlap with an existing row (according to the condition), the database will reject the transaction with an `exclusion_violation` error.

## Reproducible Test Script

You can run the following SQL script in your Supabase SQL Editor to verify this behavior.

```sql
-- Clean up previous test runs if necessary
DELETE FROM bookings WHERE customer_name = 'Test Customer';

-- 1. Create a confirmed booking for a specific time slot
INSERT INTO bookings (customer_name, customer_email, service_type_id, address, start_time, end_time, status)
VALUES ('Test Customer', 'test@example.com', 1, '123 Test St', '2024-09-01 10:00:00+00', '2024-09-01 10:30:00+00', 'CONFIRMED');

-- 2. Attempt to create a second booking that overlaps the first one
-- This insert should FAIL due to the EXCLUDE constraint.
INSERT INTO bookings (customer_name, customer_email, service_type_id, address, start_time, end_time, status)
VALUES ('Test Customer', 'test2@example.com', 1, '456 Test Ave', '2024-09-01 10:15:00+00', '2024-09-01 10:45:00+00', 'HOLD');
-- Expected Error: "conflicting key value violates exclusion constraint..."

-- 3. Attempt to create a booking that does NOT overlap
-- This insert should SUCCEED.
INSERT INTO bookings (customer_name, customer_email, service_type_id, address, start_time, end_time, status)
VALUES ('Test Customer', 'test3@example.com', 1, '789 Test Ln', '2024-09-01 11:00:00+00', '2024-09-01 11:30:00+00', 'CONFIRMED');

-- 4. Attempt to create a CANCELLED booking that overlaps
-- This insert should SUCCEED because the constraint only applies to HOLD or CONFIRMED bookings.
INSERT INTO bookings (customer_name, customer_email, service_type_id, address, start_time, end_time, status)
VALUES ('Test Customer', 'test4@example.com', 1, '101 Test Blvd', '2024-09-01 11:15:00+00', '2024-09-01 11:45:00+00', 'CANCELLED');

```

When you run this script, the second `INSERT` statement will fail with an error, proving that the database is correctly preventing overlapping bookings. The third and fourth inserts will succeed, demonstrating that non-overlapping and non-conflicting bookings are still allowed.
