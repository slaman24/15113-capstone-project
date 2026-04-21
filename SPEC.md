# Drip — App Specification

**Version:** 1.0  
**Platform:** React Native (Expo) — iOS, Android, Web  
**Design priority:** Simplicity

---

## Overview

Drip is a peer-to-peer laundry service app for college students. Users sign up as either a **Wearer** (someone who wants laundry done) or a **Washer** (someone who does laundry for others). After login the app routes each role to its own dedicated interface.

The Drip logo (`docs/drip_logo.png`) appears on the login/register screens and as the app icon asset.

---

## Tech Stack

| Concern          | Choice                                                      |
| ---------------- | ----------------------------------------------------------- |
| Framework        | Expo SDK 54 + Expo Router v6                                |
| Language         | TypeScript                                                  |
| Navigation       | Expo Router file-based routing                              |
| Local storage    | `@react-native-async-storage/async-storage`                 |
| Password hashing | `expo-crypto` (SHA-256 digest)                              |
| State            | React `useState` / `useContext` — no external state library |
| Styling          | React Native `StyleSheet` — no third-party UI library       |

---

## Project File Structure

```
app/
  _layout.tsx                  ← root layout; wraps AuthProvider
  index.tsx                    ← redirect: unauthenticated → /login
  login.tsx                    ← Login screen
  register.tsx                 ← Register screen
  (wearer)/
    _layout.tsx                ← bottom-tab layout for Wearers
    index.tsx                  ← Place Order
    orders.tsx                 ← My Orders
    profile.tsx                ← Profile & Logout
  (washer)/
    _layout.tsx                ← bottom-tab layout for Washers
    index.tsx                  ← Available Orders
    jobs.tsx                   ← My Jobs
    profile.tsx                ← Profile & Logout

context/
  auth-context.tsx             ← AuthContext: current user, login, logout, register

lib/
  storage.ts                   ← AsyncStorage read/write helpers
  hash.ts                      ← SHA-256 password hashing via expo-crypto
  seed.ts                      ← injects mock data on first launch

constants/
  theme.ts                     ← extended with Drip brand colours

assets/
  images/
    drip_logo.png              ← copied from docs/drip_logo.png
```

---

## Brand Colours (theme.ts additions)

```ts
drip: {
  teal:       '#1BBFC9',   // primary — outer blob / main brand colour
  lightAqua:  '#7ADDE8',   // backgrounds, cards, input focus ring
  darkTeal:   '#1A6B7A',   // mascot cap — headers, active tab indicator
  gold:       '#F0B429',   // cap brim accent — CTAs, highlights
  white:      '#FFFFFF',   // wordmark, text on teal backgrounds
  darkText:   '#1F2937',   // body text on light backgrounds
  mutedText:  '#6B7280',   // secondary labels, timestamps
  error:      '#DC2626',   // validation errors, cancelled badge
  success:    '#16A34A',   // done badge
}
```

---

## Data Models

### User

```ts
type Role = "wearer" | "washer";

interface User {
  id: string; // uuid v4
  username: string; // unique, case-insensitive
  passwordHash: string; // SHA-256 hex of password
  role: Role;
  displayName: string; // same as username on registration; editable later
  createdAt: string; // ISO 8601
}
```

### Order

```ts
type OrderStatus =
  | "pending" // Wearer placed, no Washer yet
  | "accepted" // Washer accepted
  | "in_progress" // Washer picked up
  | "done" // Washer marked complete
  | "cancelled"; // Wearer cancelled before acceptance

interface LaundryItem {
  label: string; // e.g. "Shirts", "Pants", "Towels"
  quantity: number;
}

interface Order {
  id: string;
  wearerId: string;
  washerId: string | null;
  items: LaundryItem[];
  pickupTime: string; // ISO 8601 — chosen by Wearer
  notes: string;
  status: OrderStatus;
  createdAt: string;
  updatedAt: string;
}
```

### StorageKeys

```ts
const STORAGE_KEYS = {
  USERS: "drip_users",
  ORDERS: "drip_orders",
  SESSION: "drip_session", // stores current user's id
};
```

---

## Authentication

### Storage & Security

- All users are stored in `AsyncStorage` under `drip_users` as a JSON array.
- Passwords are **never stored in plaintext**. On registration and on login-attempt the password is run through `expo-crypto.digestStringAsync(CryptoDigestAlgorithm.SHA256, password)` and only the resulting hex digest is stored or compared.
- The active session (current user `id`) is persisted in `AsyncStorage` under `drip_session` so the user remains logged in across app restarts.
- On app launch, `AuthContext` reads `drip_session`, finds the matching user in `drip_users`, and sets the session — no password is re-read from storage at this point.

### Registration Flow

1. User opens the app → redirected to `/login`.
2. User taps **"Create account"** → navigated to `/register`.
3. User enters:
   - **Username** (required, 3–30 characters, alphanumeric + underscores)
   - **Password** (required, ≥ 8 characters)
   - **Confirm Password** (must match)
   - **Role** — toggle between `Wearer` and `Washer`
4. On submit, validate all fields (see Error Handling). If valid:
   - Hash password.
   - Confirm username is not already taken (case-insensitive).
   - Persist new `User` to `drip_users`.
   - Write `id` to `drip_session`.
   - Navigate to the correct interface based on role.

### Login Flow

1. User enters **Username** and **Password**.
2. On submit:
   - Find user by username (case-insensitive) in `drip_users`.
   - Hash the entered password; compare to stored `passwordHash`.
   - If match: write `id` to `drip_session`, navigate to role interface.
   - If no match: display inline error (see Error Handling).

### Logout

- Available from the **Profile** tab in both interfaces.
- Clears `drip_session` from `AsyncStorage` and sets `AuthContext` user to `null`.
- App redirects to `/login`.

---

## Screen Specifications

### `/login` — Login Screen

**Layout:**

- Drip logo centred at top (from `assets/images/drip_logo.png`)
- `TextInput` for Username
- `TextInput` for Password (`secureTextEntry`)
- **Log In** button (primary, full-width)
- **"Don't have an account? Create one"** link → `/register`

**Behaviour:**

- Inputs trimmed before validation.
- Disable button while request is processing.
- Show inline error below the form on failure.

---

### `/register` — Register Screen

**Layout:**

- Back arrow → `/login`
- Drip logo (smaller, top)
- `TextInput` for Username
- `TextInput` for Password (`secureTextEntry`)
- `TextInput` for Confirm Password (`secureTextEntry`)
- Role toggle — two tappable pills: **Wearer** | **Washer**
  - Selected pill: filled blue background, white text
  - Unselected: outlined, blue text
- **Create Account** button (primary, full-width)

---

### `(wearer)` — Wearer Interface

#### Tab 1 · Place Order (`(wearer)/index.tsx`)

- Heading: **"Place a Laundry Order"**
- **Item picker:** list of common items (Shirts, Pants, Socks, Towels, Bedding, Other) each with `+` / `−` quantity controls. Only items with quantity > 0 are included in the order.
- **Pickup time:** a simple text input accepting a date/time string (e.g. `"Tomorrow 10am"`) — kept simple for the demo.
- **Notes:** optional multi-line `TextInput` (max 200 characters).
- **Submit Order** button — disabled if no items selected; disabled while submitting.
- On success: show a confirmation message with the order ID, reset form.

#### Tab 2 · My Orders (`(wearer)/orders.tsx`)

- Flat list of the logged-in Wearer's orders, sorted by `createdAt` descending.
- Each card shows: order ID (last 6 chars), items summary, pickup time, status badge.
- Status badge colours:
  - `pending` → grey
  - `accepted` → teal (`#1BBFC9`)
  - `in_progress` → amber
  - `done` → green
  - `cancelled` → red
- Tapping a card shows a modal/detail view with full item list and notes.
- A **Cancel** button is visible on cards with status `pending`.

#### Tab 3 · Profile (`(wearer)/profile.tsx`)

- Shows display name and username (read-only in v1).
- **Log Out** button.

---

### `(washer)` — Washer Interface

#### Tab 1 · Available Orders (`(washer)/index.tsx`)

- Flat list of all orders with status `pending`, sorted by `createdAt` ascending (oldest first).
- Each card shows: order ID (last 6 chars), items summary, pickup time, Wearer display name.
- **Accept** button on each card.
- On accept: order `status` → `accepted`, `washerId` set to current user. Card disappears from this list.

#### Tab 2 · My Jobs (`(washer)/jobs.tsx`)

- Flat list of orders assigned to the logged-in Washer (`washerId === currentUser.id`).
- Status pipeline buttons:
  - When `accepted` → **"Mark Picked Up"** button → `in_progress`
  - When `in_progress` → **"Mark Done"** button → `done`
  - When `done` → no action button
- Each card shows: order ID (last 6 chars), Wearer display name, items summary, pickup time, status badge.

#### Tab 3 · Profile (`(washer)/profile.tsx`)

- Shows display name and username (read-only in v1).
- **Log Out** button.

---

## Mock Data (`lib/seed.ts`)

Seeded automatically on first app launch (checked via an `AsyncStorage` key `drip_seeded`).

### Mock Users

| Username        | Password (plaintext) | Role   | Display Name |
| --------------- | -------------------- | ------ | ------------ |
| `alex_w`        | `laundry123`         | Wearer | Alex W.      |
| `jamie_w`       | `campus456`          | Wearer | Jamie W.     |
| `morgan_washer` | `cleanit789`         | Washer | Morgan       |
| `riley_washer`  | `sudsy2024`          | Washer | Riley        |

> Passwords above are for **demo purposes only** and are stored as SHA-256 hashes. They are documented here to enable login during demos.

### Mock Orders

| ID (suffix) | Wearer  | Items               | Pickup Time   | Status        | Washer        |
| ----------- | ------- | ------------------- | ------------- | ------------- | ------------- |
| `…aaa001`   | alex_w  | 3 Shirts, 2 Pants   | Tomorrow 10am | `pending`     | —             |
| `…aaa002`   | alex_w  | 5 Socks, 1 Towel    | Today 3pm     | `accepted`    | morgan_washer |
| `…aaa003`   | jamie_w | 2 Shirts, 1 Bedding | Wed 9am       | `in_progress` | riley_washer  |
| `…aaa004`   | jamie_w | 4 Pants             | Last Friday   | `done`        | morgan_washer |
| `…aaa005`   | alex_w  | 1 Bedding           | Mon 8am       | `cancelled`   | —             |

---

## Error Handling

### Authentication Errors

| Condition                            | Message shown to user                                                                     |
| ------------------------------------ | ----------------------------------------------------------------------------------------- |
| Username field empty                 | "Username is required."                                                                   |
| Password field empty                 | "Password is required."                                                                   |
| Username < 3 or > 30 characters      | "Username must be 3–30 characters."                                                       |
| Username contains invalid characters | "Username may only contain letters, numbers, and underscores."                            |
| Password < 8 characters (register)   | "Password must be at least 8 characters."                                                 |
| Confirm password does not match      | "Passwords do not match."                                                                 |
| Username already taken (register)    | "That username is already taken. Please choose another."                                  |
| Username not found (login)           | "Incorrect username or password."                                                         |
| Password hash mismatch (login)       | "Incorrect username or password." _(same message as above — avoids username enumeration)_ |
| AsyncStorage read/write failure      | "Something went wrong. Please try again."                                                 |

### Order Errors

| Condition                   | Message shown to user                              |
| --------------------------- | -------------------------------------------------- |
| No items selected           | "Please add at least one item to your order."      |
| Pickup time empty           | "Please enter a pickup time."                      |
| Notes exceed 200 characters | "Notes must be 200 characters or fewer."           |
| Order submit fails          | "Could not place your order. Please try again."    |
| Accept order fails          | "Could not accept this order. Please try again."   |
| Status update fails         | "Could not update order status. Please try again." |

All error messages are displayed inline (below the relevant input or at the bottom of the form), never as alerts.

---

## Acceptance Criteria

### AC-1 · Authentication

- [ ] A new user can register with a unique username, password ≥ 8 characters, and a selected role.
- [ ] After successful registration the user is immediately taken to the correct interface for their role.
- [ ] A registered user can log in using their username and password.
- [ ] After successful login the user is taken to the correct interface for their role.
- [ ] Passwords are stored as SHA-256 hashes; no plaintext password exists anywhere in `AsyncStorage`.
- [ ] The session persists across app restarts until the user logs out.
- [ ] After logout the user is returned to the login screen and cannot access role screens without re-authenticating.
- [ ] Registration with a duplicate username shows an appropriate error and does not create a second account.
- [ ] Login with wrong credentials shows the same generic error message for both "username not found" and "wrong password" cases.

### AC-2 · Wearer Interface

- [ ] A Wearer can select item types and quantities and place an order.
- [ ] The Place Order form resets after successful submission.
- [ ] A Wearer can see all of their own orders with correct statuses.
- [ ] A Wearer can cancel a `pending` order; cancelled orders show the `cancelled` status.
- [ ] A Wearer cannot see another user's orders.
- [ ] A Wearer cannot access the Washer interface.

### AC-3 · Washer Interface

- [ ] A Washer can see all `pending` orders from all Wearers.
- [ ] A Washer can accept a `pending` order; it then appears in My Jobs.
- [ ] A Washer can progress a job from `accepted` → `in_progress` → `done`.
- [ ] A Washer cannot see jobs accepted by other Washers in their My Jobs list.
- [ ] A Washer cannot access the Wearer interface.

### AC-4 · Mock Data

- [ ] On first launch, four mock users and five mock orders are present without any manual setup.
- [ ] Each mock user listed in the spec can log in with the documented plaintext password.
- [ ] Mock orders appear in the correct lists (pending orders visible to Washers, etc.).

### AC-5 · Branding

- [ ] The Drip logo is visible on the Login screen and the Register screen.
- [ ] The app uses the Drip brand colour palette for primary buttons, badges, and the role toggle.

### AC-6 · Error Handling

- [ ] Every error condition listed in the Error Handling section produces the exact message specified.
- [ ] Error messages appear inline; no native `Alert` dialogs are used for validation errors.
- [ ] Action buttons (Log In, Create Account, Submit Order, Accept, Mark Picked Up, Mark Done) are disabled while an async operation is in flight.

---

## Out of Scope (v1)

- Push notifications
- Real-time updates (no WebSockets or polling)
- Payment processing
- Photo upload
- Ratings and reviews
- Password reset / forgot password flow
- Dark mode
- Editing display name or password after registration
