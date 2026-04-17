# Drip Laundry App — Product Specification

**Version**: 1.0 (MVP Release)  
**Last Updated**: April 2026  
**Status**: In Development

---

## Table of Contents

1. [Overview](#overview)
2. [User Personas](#user-personas)
3. [Core User Flows](#core-user-flows)
4. [Required Features & Behavior](#required-features--behavior)
5. [Visual & Interaction Design](#visual--interaction-design)
6. [Error Handling & Recovery](#error-handling--recovery)
7. [Acceptance Criteria](#acceptance-criteria)
8. [Technical Considerations](#technical-considerations)
9. [Phase 2+ Features (Out of Scope)](#phase-2-features-out-of-scope)

---

## Overview

### Vision

**Drip** is a peer-to-peer laundry service platform that makes doing laundry stress-free and accessible for college students. We connect students in need of laundry help (Senders) with trusted local launderers (Sudsers), giving students their time back so they can focus on what matters most.

### Mission Statement

To lighten the load. Make laundry fun. Build community.

### Target Audience

- **Primary**: College students ages 18–24, busy with classes/extracurriculars, willing to pay for convenience
- **Secondary**: College-town launderers looking for flexible income opportunities
- **Geography**: College towns (initially pilot markets)

### Product Positioning

- **Tone**: Playful, approachable, relatable—laundry is a universal pain point, and we make it fun
- **Value Props**:
  - **For Senders**: Flexible scheduling, affordable pricing, trusted network, real-time visibility
  - **For Sudsers**: Flexible income, build client relationships, own schedule
  - **For Community**: Support local peer economy, reduce campus stress

### MVP Scope (This Release)

✅ **In Scope**:

- Sender onboarding (sign up, phone verification)
- Sudser onboarding (sign up, phone verification)
- Browse available Sudsers (directory with basic info: name, rating, hourly rate, reviews count)
- Filter Sudsers by service type (wash & fold, dry cleaning, delicates, rush)
- Sender creates booking request (select Sudser → select services → pick up date/time → confirm)
- Sudser dashboard (view incoming booking requests, accept/decline)
- Order details view (Sender + Sudser can see booking info, location, notes)
- Authentication (email/password, secure logout)
- User profiles (Sender: address, preferences; Sudser: rates, services, availability)
- In-app notifications (booking confirmed, accepted, reminder before pickup)
- Home screens (Sender: "Book a wash"; Sudser: "View requests")

❌ **Out of Scope** (Phase 2+):

- Real-time order tracking / GPS tracking
- In-app payments (mock data only, no Stripe/Square integration)
- Ratings & reviews system
- In-app messaging / chat
- Search/filter by location (Sudser proximity)
- Recurring/subscription orders
- Order history & past bookings
- Admin dashboard

---

## User Personas

### 1. **Maya — First-Time Sender** ⭐

**Age**: 19 | **Year**: Sophomore | **Tech Comfort**: Medium

**Background**

- Overwhelmed with midterms and extracurriculars
- Has never used a peer-service app before (nervous about trust)
- Laundry pile is getting out of control; parents suggested hiring help
- Lives in dorm with limited laundry facilities

**Goals**

- Get laundry done without thinking about it
- Feel confident that a trusted person is handling her clothes
- Easy, intuitive experience—doesn't want to read a manual
- See clear pricing upfront; no surprises

**Pain Points**

- Worried about someone she doesn't know handling personal items
- Anxious about entering credit card info / payment security
- Doesn't want complicated steps; wants to "just book it"
- Fear of flaky Sudsers, last-minute cancellations

**Platform Expectations**

- Simple, clear flow: pick someone → pick services → pick time → done
- Lots of visual cues and reassurance (ratings, verified badges, reviews)
- Friendly language, not corporate
- Clear instructions for pickup/handoff
- Playful, not intimidating

**Jobs to Be Done**

- "Help me get my laundry done without thinking."
- "Make me feel safe trusting a stranger with my clothes."
- "Give me my time back so I can study."

**Typical Flow**

1.  Opens app, sees "Browse Sudsers" (feels overwhelmed by choices)
2.  Looks at top 3 rated Sudsers, reads reviews, picks one with most 5-stars
3.  Selects "Wash & Fold, Regular" + "Delicates Hand Wash"
4.  Picks Friday 5pm pickup, Monday 10am return
5.  Confirms order, gets confirmation notification
6.  Feels relieved; goes back to studying

---

### 2. **James — Returning Sender** 🔄

**Age**: 22 | **Year**: Senior | **Tech Comfort**: High

**Background**

- Used to book laundry services in his freshman year, then got busy
- Now senior, managing two internships + thesis project
- Knows exactly what he wants; doesn't have time to think about it
- Trusts Drip process now; would book weekly if easier

**Goals**

- Book laundry in under 2 minutes
- Consistent, predictable experience (same Sudser, same time slot)
- Quick re-booking without re-entering data
- Wants to optimize his workflow (book mid-week, pickup Friday)

**Pain Points**

- Can't remember which Sudser did his dry cleaning last time
- UI should help him "make the same booking as last time"
- Tired of scrolling through all Sudsers; wants to see favorites
- If checkout takes more than 3 taps, he'll forget and hand-wash

**Platform Expectations**

- Speed optimized; minimal clicks
- "Book Again" or show recent Sudsers prominently
- Favorites / saved Sudsers
- Maybe auto-fill his typical order (wash & fold + delicates)
- Quick confirmation (maybe just a confirmation modal, not a whole page)

**Jobs to Be Done**

- "Let me re-book my regular Sudser in seconds."
- "Remember my preferences so I don't have to."

**Typical Flow**

1.  Opens app, sees "Recent Sudsers: Sarah (4.9⭐)"
2.  Taps Sarah, taps "Book Again" (pre-selects his typical services)
3.  Changes date to next Friday
4.  Confirms in 1 tap → Get notification "Booked!"
5.  Closes app; done in 30 seconds

---

### 3. **DeAndre — New Sudser** 🌟

**Age**: 20 | **Year**: Junior | **Tech Comfort**: Medium

**Background**

- Grew up doing laundry for his family, has a knack for it
- Heard about Drip from a friend who uses it as a Sender
- Wants flexible income during school; might do this full-time post-college
- First time using a service provider app (Uber/DoorDash-like)
- Nervous about technical setup, payment logistics, taxes

**Goals**

- Understand how to accept/decline orders, manage his schedule
- Feel confident he'll get paid fairly and on time
- Build reputation and get good reviews
- Make money without too much overhead (no equipment upfront)

**Pain Points**

- Worried about being scammed or not getting paid
- Unclear on logistics: how/when does customer pay, how/when does he get paid
- Concerned about liability if something gets damaged
- Doesn't know what to charge or how other Sudsers price

**Platform Expectations**

- Clear onboarding: "Here's how to get started"
- Instructions for accepting/declining orders
- Dashboard showing: incoming requests, accepted orders, payment status
- Notifications so he doesn't miss orders
- Help determining pricing
- Clear terms about liability / damages

**Jobs to Be Done**

- "Help me start earning money doing what I'm good at."
- "Make it easy to manage my orders without confusion."
- "Show me that this is a legitimate, trustworthy platform."

**Typical Flow**

1.  Signs up, enters service types (wash & fold, basic delicates, rush available)
2.  Sets hourly rate ($18/hr for standard, $25/hr for rush)
3.  Completes profile with location, availability
4.  Sees dashboard: "Waiting for first order..."
5.  Notification: "New order from Maya!" Shows pickup time, services, address
6.  Accepts (green button), app confirms; waits for pickup time

---

### 4. **Priya — Experienced Sudser** 👑

**Age**: 23 | **Year**: Post-Grad | **Tech Comfort**: High

**Background**

- Been doing laundry for income for 2+ years on Drip
- Built loyal client base, consistently booked
- Uses Drip to supplement her part-time job
- Manages 5–15 orders per week, juggles scheduling
- Wants to grow business, maybe hire assistants

**Goals**

- Maximize earnings by managing orders efficiently
- Maintain high ratings and client retention
- See trends: which services are most requested, peak booking times
- Grow from solo operator to small team

**Pain Points**

- When orders are too close together, it's hard to manage logistics
- Wants to see if she can negotiate rates with regular clients
- Needs clear income summary (earnings, hours worked, tips)
- Worried about losing orders to other Sudsers with lower rates

**Platform Expectations**

- Dashboard with clear order queue, time management
- Customer review/rating system (protect her reputation)
- Earnings breakdown (hourly, by order, tips)
- Maybe a way to set "minimum order size" to avoid low-value orders
- Fast accept/decline UI
- Visibility to search filters (e.g., "I'm the only one in a 2-mile radius who does dry cleaning")

**Jobs to Be Done**

- "Help me manage multiple orders without chaos."
- "Show me my earnings and help me grow this business."
- "Keep my reputation strong."

**Typical Flow**

1.  Opens app, sees dashboard with 8 pending orders for the week
2.  Checks calendar: Friday is booked (4 pickups), can fit 1–2 more
3.  Reviews pending orders, accepts 2 new ones (both wash & fold, good rates)
4.  Declines 1 order (too early in morning; she doesn't do 7am pickups)
5.  Views earnings summary: "$420 earned this week"
6.  Checks ratings: "4.9⭐ (87 reviews)" — feels good

---

## Core User Flows

### Flow 1: Authentication & Onboarding

#### Sender Sign-Up

```
1. User taps "Get Started" → Choose "I need laundry done" (Sender)
2. Enter email, create password
3. Enter phone number
4. Receive SMS verification code
5. Enter code to confirm
6. Onboarding complete:
   - Enter home address (for pickup/drop-off)
   - Grant location permission (optional for MVP)
   - Set notification preferences
7. Redirect to Home screen → "Browse Sudsers"
```

#### Sudser Sign-Up

```
1. User taps "Get Started" → Choose "I do laundry" (Sudser)
2. Enter email, create password
3. Enter phone number
4. Receive SMS verification code
5. Enter code to confirm
6. Onboarding complete:
   - Enter service area (city, address)
   - Select services offered (wash & fold, delicates, dry cleaning, rush)
   - Set hourly rate(s)
   - Set availability (days/times available for pickups)
   - Upload profile photo (optional)
7. Redirect to Dashboard → "Waiting for orders..."
```

#### Login / Logout

```
Login:
1. Tap "Log In"
2. Enter email + password
3. If 2FA enabled, verify phone code
4. Redirect to appropriate home screen (Sender or Sudser)

Logout:
1. Settings → "Log Out"
2. Confirmation modal: "Sign out of Drip?"
3. Confirm → Return to login/sign-up screen
```

---

### Flow 2: Sender Books a Wash

```
Home Screen (Sender):
 ↓
Tap "Browse Sudsers" or "Book Now"
 ↓
Browse Screen (List all Sudsers in area):
  - Show: Name, photo, rating (⭐), review count, hourly rate, services
  - Tap to view Sudser detail (reviews, availability, full bio)
 ↓
Tap Sudser name → Sudser Detail Screen:
  - Full profile, recent reviews, service breakdown, availability
  - Tap "Book with [Name]" button
 ↓
Service Selection Screen:
  - Checkboxes: Wash & Fold, Delicates, Dry Cleaning, Rush Service
  - Price breakdown updates in real-time
 ↓
Date & Time Selection:
  - Pickup date/time (calendar picker)
  - Return date/time (calendar picker)
  - Price estimate shown (hours estimate × rate)
 ↓
Booking Confirmation Screen:
  - Summary: Sudser name, services, pickup/return times, total price (estimated)
  - Special notes field (optional: "Stain on favorite sweater, please be careful")
  - Tap "Confirm Booking" → Success
 ↓
Confirmation Screen:
  - "✅ Booking Confirmed!"
  - Sudser name + phone number (for coordination)
  - Calendar reminder set
  - Tap "View Order Details" or "Done" (back to home)
 ↓
Push notification sent to Sender: "Your booking is confirmed. Sarah will pick up Friday at 5 PM."
```

---

### Flow 3: Sudser Receives & Accepts Order

```
Sudser Dashboard (waiting screen):
 ↓
Notification received: "📬 New booking request from Maya"
 ↓
Sudser taps notification OR opens app
 ↓
Order Details Screen:
  - Sender name, address, phone
  - Services requested (wash & fold, delicates, rush?)
  - Pickup date/time, return date/time
  - Special notes
  - Price (what Sudser will receive)
  - "Accept" and "Decline" buttons
 ↓
If Accept:
  - Modal confirms: "Confirm that you'll pick up from Maya at 5 PM Friday?"
  - Tap "Accept" → Order moves to "Accepted Orders" on dashboard
  - Push notification sent to Sender: "Sarah accepted your booking!"
  - Calendar event added for Sudser
 ↓
If Decline:
  - Modal: "Why are you declining? (optional feedback)"
  - Tap "Decline" → Order removed from requests
  - Drip notifies Sender and suggests other Sudsers
```

---

### Flow 4: Sudser Dashboard (Active Orders)

```
Sudser Home Screen:
 ↓
Tabs: "Pending Requests" | "Accepted Orders" | "Completed"
 ↓
Accepted Orders tab shows:
  - List of orders chronologically (pickup date soonest first)
  - Each row: Sender name, pickup time, return time, services, status
  - Tap to expand and see details
 ↓
On Order Details:
  - All info from above
  - Status badge: "Pickup in 2 days" or "Ready for pickup tomorrow"
  - Navigation/contact button: "Call Sender"
  - Confirmation: "I'll be ready for pickup Friday at 5 PM" (button to mark ready)
  - View earnings on this order (if Phase 2 considers per-order display)
```

---

## Required Features & Behavior

### 1. Authentication & Account Management

#### 1.1 Signup (Sender)

**Behavior**:

- User selects "I need laundry done"
- Enters email (validated for format), password (min 8 chars, 1 upper, 1 number), confirms password
- Enters phone number (validated format for US numbers initially)
- SMS sent with 6-digit confirmation code (expires in 10 minutes)
- User enters code; if correct, account created
- User prompted for optional address (used for Sudser matching in Phase 2)
- Redirected to Home screen

**User Benefit**: Quick, secure sign-up with phone verification reduces fraud

#### 1.2 Signup (Sudser)

**Behavior**:

- User selects "I do laundry"
- Enters email, password, phone number (same validation as Sender)
- SMS verification
- Prompted to enter: service area (city), services offered (checkboxes), hourly rate(s), availability (time slots)
- Optional: profile photo upload
- Account created; redirect to Dashboard

**User Benefit**: Clear service setup so customers know what to expect

#### 1.3 Login

**Behavior**:

- Email + password form
- On success, shows Home screen (Sender) or Dashboard (Sudser)
- Session persists for 30 days (or until logout)
- If 2FA enabled (future), verify phone code after password

**User Benefit**: Secure access without re-entering credentials every time

#### 1.4 Logout

**Behavior**:

- Settings → "Log Out"
- Confirmation modal
- Session cleared locally; redirected to login screen

**User Benefit**: Security; prevents unauthorized access on shared devices

#### 1.5 User Profile (Sender)

**Behavior**:

- View/edit name, email, phone, address, profile photo
- Set notification preferences (push, SMS, email)
- View saved payment methods (Phase 2)
- View booking history (Phase 2)

**User Benefit**: Customization; control over how Drip contacts them

#### 1.6 User Profile (Sudser)

**Behavior**:

- View/edit name, email, phone, profile photo
- Edit service offerings, hourly rates, availability
- View current rating (Phase 2) and review count (Phase 2)
- View earnings summary (Phase 2)
- Set notification preferences

**User Benefit**: Manage business info; stay connected to performance metrics

---

### 2. Browse & Discover (Sender)

#### 2.1 Browse Sudsers (Directory)

**Behavior**:

- Sender home displays "Browse Available Sudsers"
- List shows all Sudsers in area (mock data for MVP; no real geolocation filter)
- Each card shows: profile photo, name, ⭐ rating (mock 3–5 stars), review count (mock 10–100), hourly rate, services offered
- Cards are tappable; lead to Sudser detail

**User Benefit**: Quick visual scan of available options; helps Maya compare at a glance

#### 2.2 Sudser Detail View

**Behavior**:

- Tap Sudser card → Detail view
- Shows: full name, photo, bio/about section, services + pricing, hours available, recent reviews (Phase 2: real reviews; MVP: mock)
- "Book with [Name]" button visible
- If Sender has booked with this Sudser before, show "Book again" prompt

**User Benefit**: Build trust via reviews and detailed profile; reduces friction for repeat bookings

#### 2.3 Filter / Search (MVP: Basic)

**Behavior**:

- Top of browse screen has filter chip: "Service type: All"
- Tap to filter: "Wash & Fold" | "Delicates" | "Dry Cleaning" | "Rush"
- List updates to show only Sudsers offering selected service
- "Sort by" option: "Rating" or "Price" (low to high)

**User Benefit**: James (returning Sender) finds his Sudser faster; Maya (first-time) feels less overwhelmed

---

### 3. Booking Flow (Sender Creates Order)

#### 3.1 Start Booking

**Behavior**:

- After selecting Sudser, "Book with [Name]" button shown
- Tapping opens Service Selection screen
- Loader briefly shows "Loading [Sudser]'s availability..."

**User Benefit**: Clear call-to-action; shows progress

#### 3.2 Service Selection

**Behavior**:

- Checkboxes: "Wash & Fold ($18/item)", "Hand Wash Delicates (+$5/item)", "Dry Cleaning (+$3/item)", "Rush (+$10 surcharge)"
- Real-time price calculation displayed at bottom: "Estimated total: $50–75 (depending on load size)"
- Note: MVP uses estimated pricing; Phase 2 will be exact after payment integration

**User Benefit**: Transparency; Maya knows what she's paying for before booking

#### 3.3 Date/Time Selection

**Behavior**:

- Two date pickers: "Pickup date" and "Return date"
- Time pickers: "Pickup time" (from Sudser's available slots), "Return time" (from Sudser's available slots)
- Validation: return date must be >= pickup date; return time must be at least 24 hours after pickup
- Display updated estimate based on duration

**User Benefit**: Flexibility; ensures realistic turnaround expectations

#### 3.4 Special Notes

**Behavior**:

- Optional text field: "Any special instructions for [Sudser]? (e.g., 'Stain on favorite sweater, please be careful')"
- Character limit: 200 chars
- Visible to Sudser on order details

**User Benefit**: Reduces anxiety; Senders can communicate specific concerns

#### 3.5 Confirmation

**Behavior**:

- Review screen shows: Sudser name, services, pickup/return times, estimated price, special notes
- "Confirm Booking" button (prominent, playful design)
- On tap: API call to book; if successful, confirmation screen; if failed, error handling (see Error Handling section)
- Confirmation screen: "✅ Booking confirmed! Sarah will pick up Friday at 5 PM." with order ID
- Send push notification to Sender + Sudser

**User Benefit**: Maya feels relief; order is locked in, calendar reminder set

---

### 4. Sudser Order Management

#### 4.1 Incoming Requests

**Behavior**:

- Sudser Dashboard has tab: "Pending Requests"
- Shows all new booking requests (not yet accepted/declined)
- Each row: Sender name, pickup time, services, price
- Tap to expand and see full details (address, special notes, sender contact)
- "Accept" and "Decline" buttons on detail view

**User Benefit**: DeAndre can decide if he has capacity; Priya can quickly triage

#### 4.2 Accept Order

**Behavior**:

- On Pending Request detail, tap "Accept"
- Confirmation modal: "Confirm you'll pick up from [Sender] at [time] on [date]?"
- On confirm, order moves to "Accepted Orders" tab
- Push notification sent to Sender: "Sarah accepted your booking!"
- Calendar event created on Sudser's device

**User Benefit**: Order is locked in; both parties have confirmation

#### 4.3 Decline Order

**Behavior**:

- Tap "Decline" → Modal appears: "Why are you declining this order?" (optional multi-choice: Too early, Too late, Already booked, Don't offer service, Other)
- Tap "Decline" to confirm (optional: reason is sent to Drip analytics; does not notify Sender)
- Order removed from Sudser's queue
- Drip notifies Sender: "Sarah isn't available. [2 other Sudsers offer these services]"

**User Benefit**: Sudsers keep control over schedule; Senders are redirected to alternatives quickly

#### 4.4 Accepted Orders Dashboard

**Behavior**:

- "Accepted Orders" tab shows list of all accepted bookings, sorted by pickup date (soonest first)
- Each row: Sender name, pickup date/time, return date/time, status badge (e.g., "Pickup in 3 days"), quick-view services
- Tap to see full details: address, special notes, contact, price
- Status updates: "Pickup in X days" → "Ready for pickup today" → "Completed" (Phase 2)

**User Benefit**: Priya sees all her work at a glance; can plan logistics

#### 4.5 Mark Ready for Pickup

**Behavior**:

- On accepted order detail, show "Mark Ready for Pickup" button (appears 1 day before scheduled pickup)
- Tap → Confirmation: "Confirm the laundry is ready for pickup?"
- On confirm, status changes to "Ready for pickup" (color change, badge update)
- Push notification sent to Sender: "Your laundry is ready for pickup!"

**User Benefit**: Manages expectation for both parties; Sender knows when to pick up

---

### 5. Order Details & Status

#### 5.1 Sender View Order Details

**Behavior**:

- After booking, "Tap to view order details" or navigate via Home → "Active Orders" → select order
- Display: Sudser name/photo, services, pickup time/address, return time/address, special notes, status, Sudser phone number
- Status badges: "Confirmed" (blue), "Completed" (green), "Pending" (gray)
- "Cancel Order" link (if before pickup; see cancellation in Phase 2+)

**User Benefit**: Clear reference; Maya has Sudser's contact info if needed

#### 5.2 Sudser View Order Details

**Behavior**:

- Same fields: Sender name/photo, address, services, times, special notes, price
- Sudser contact not shown to Sudser (only to Sender)
- Status badges + timestamps
- "Call Sender" quick button (uses native phone app if available)

**User Benefit**: All info in one place; quick contact option

---

### 6. Notifications

#### 6.1 In-App Notifications

**Behavior**:

- Notifications appear as dismissible toasts (bottom of screen for 3–5 seconds)
- Examples: "Order confirmed!", "New booking request!", "Time to pick up laundry!"
- Tap toast to navigate to relevant screen

**User Benefit**: Non-intrusive updates; user can take action if desired

#### 6.2 Push Notifications

**Behavior**:

- User can opt-in to push notifications in Settings
- Examples:
  - **Sender**: "Sarah accepted your booking", "Your laundry is ready for pickup", "Reminder: Pickup at 5 PM today"
  - **Sudser**: "New booking request from Maya", "Reminder: Pickup from Maya in 1 hour"
- Deep link on tap to relevant screen (order details, pending request, etc.)

**User Benefit**: Never miss an update; optional to control noise

---

### 7. Error States (Listed in Detail Below)

See **Error Handling & Recovery** section for comprehensive error scenarios.

---

## Visual & Interaction Design

### Design Language: "Playful & Bubbly"

Drip's visual identity should feel **fun, approachable, and trustworthy**—like talking to a friendly peer, not a corporation. This is especially important for Maya (nervous first-timer) and college-aged users who want an app that feels genuine, not sterile.

#### Color Palette (Suggested)

- **Primary**: Vibrant teal/turquoise (`#00D4FF` or similar) — fresh, water-related, approachable
- **Secondary**: Warm coral/orange (`#FF6B9D` or similar) — playful, friendly, energetic
- **Accent**: Soft lavender or mint — delightful micro-interactions
- **Neutrals**: Light gray backgrounds (`#F5F7FA`), dark text (`#2C3E50`)
- **Status Colors**:
  - Green (`#4CAF50`) for success/confirmed
  - Red (`#E74C3C`) for errors/decline
  - Blue (`#3498DB`) for pending/info
  - Yellow (`#F39C12`) for warnings

#### Typography

- **Headlines**: Rounded, friendly sans-serif (e.g., Poppins, Inter Rounded)
- **Body**: Clean, readable sans-serif (e.g., Inter, SF Pro Display)
- **Tone**: Conversational; avoid jargon ("Order number" → "Your booking ID")

#### Component Patterns

**Buttons**

- Primary (call-to-action): Vibrant color, rounded corners, slight shadow, animated on press (haptic feedback)
- Example: "Book Now" in teal with subtle grow animation on tap
- Loading state: Animated spinner inside button; "Booking..." text
- Disabled state: Grayed out, no interaction

**Cards**

- Rounded corners (12–16px radius), soft shadows, light background
- Example: Sudser card shows photo + name + ⭐ rating + "$18/hr"
- Hover state (mobile: press state): Slight scale-up + deeper shadow

**Modals**

- Rounded corners, semi-transparent backdrop
- Content centered with padding
- Close button (X) or "Cancel" button visible
- Playful headline with emoji or icon (e.g., ✅ Booking Confirmed!)

**Loading States**

- Skeleton screens (gray placeholder boxes) for browse screen content
- Animated spinner for short waits (1–5 seconds)
- Playful loading message (e.g., "Finding the best launderers..." or "Prepping your laundry...")

**Form Fields**

- Rounded borders, light color
- Clear label above field
- Error state: Red border + error message below (e.g., "Password must be 8+ characters")
- Success state: Green checkmark hint on validation

**Badges/Pills**

- Service type badges (e.g., "Wash & Fold", "Delicates") in secondary color, rounded
- Rating badges (⭐ 4.9, "87 reviews") in smaller font, neutral background

#### Micro-Interactions & Animation Guidelines

**Transitions**

- Page transitions: Smooth fade-in (200ms) or slide-up from bottom
- Button interactions: Rapid scale feedback (100ms) + haptic pulse
- List item animations: Stagger effect when loading (50ms delay between items)

**Haptic Feedback** (iOS)

- Button tap: Light haptic pulse (`light` or `medium`)
- Success confirmation: Notification haptic (double tap)
- Error alert: Warning haptic
- Form validation: Light haptic on field success

**Animation Examples**

1. **Booking Confirmation**: ✅ Check mark animates with bounce-in effect; celebration confetti (3–5 particles) optional
2. **Accept Order (Sudser)**: Green highlight flash on "Accepted Orders" row
3. **Loading List**: Skeleton cards fade in + stagger
4. **Form Submission**: Button text fades to "Booking..." with spinner; on success, ✅ check mark replaces spinner

**Playful Touches**

- Empty state illustrations (e.g., Sudser dashboard when no pending requests shows a cute, sleeping laundry basket)
- Success messages with personality (e.g., "🎉 You're all set! Sarah's got your back.")
- Small animations on notifications (toast slides in from left with slight bounce)
- Occasional easter eggs (e.g., long-press the Drip logo for surprise animation)

---

## Error Handling & Recovery

### Error Handling Philosophy

- **Inform**: Users always know what went wrong (specific, not generic)
- **Empower**: Users can take action to recover (retry, contact support, alternative action)
- **Reassure**: Playful tone + clear next steps reduce frustration
- **Resilience**: Graceful degradation (e.g., offline mode, local fallbacks)

### Error Categories & Handling

#### 1. **Network Errors**

**Scenario 1.1: No Internet Connection**

- **Detection**: Network call fails; no internet connectivity status
- **User Message**: "📡 No internet. Check your connection and try again."
- **Visual**: Red banner at top of screen with retry button
- **Recovery Actions**:
  - Auto-retry every 5 seconds (up to 3 times)
  - Manual retry button
  - Allow offline viewing of cached data (booking history, profiles)
- **Example**: Sender browses Sudsers, connection drops; list freezes; banner appears

**Scenario 1.2: Slow Network / Timeout**

- **Detection**: Network request takes >10 seconds
- **User Message**: "Slow connection. Waiting for Drip..." (brief patience message)
- **Visual**: Animated loading spinner (playful, rotating laundry basket icon)
- **Recovery Actions**:
  - Auto-retry if timeout reaches 30 seconds
  - Manual "Try Again" button
  - Timeout after 60 seconds → Error state with option to retry
- **Example**: Sudser is checking pending requests on LTE; spinner shows for 8 seconds, then loads

**Scenario 1.3: Server Error (5xx)**

- **Detection**: API returns 500, 502, 503, etc.
- **User Message**: "Something went wrong on our end. We're looking into it. Try again in a moment."
- **Visual**: Gray error state with icon + button
- **Recovery Actions**:
  - Manual retry button
  - "Contact Support" link if repeated failures
- **Example**: Booking API temporarily down; user taps "Try Again" after 30 seconds

---

#### 2. **Authentication & Login Errors**

**Scenario 2.1: Invalid Email/Password**

- **Detection**: API returns 401 Unauthorized
- **User Message**: "Email or password is incorrect. Try again."
- **Visual**: Red error text below password field; shake animation (light vibration)
- **Recovery Actions**:
  - "Forgot Password" link
  - Clear error on next edit
- **Example**: Maya enters wrong password; error appears; she taps "Forgot Password"

**Scenario 2.2: Account Doesn't Exist**

- **Detection**: Email not found in login attempt
- **User Message**: "No account found with this email. Want to sign up?"
- **Visual**: Modal with "Sign Up" and "Try Different Email" buttons
- **Recovery Actions**:
  - Redirect to signup
  - Allow re-entering email
- **Example**: James tries to log in with old work email; gets helpful redirect

**Scenario 2.3: Phone Verification Timeout**

- **Detection**: SMS code sent but not verified within 10 minutes
- **User Message**: "Code expired. We'll send a new one."
- **Visual**: "Resend Code" button enabled
- **Recovery Actions**:
  - Auto-resend SMS code
  - Manual "Resend Code" button
  - Allow re-entering phone number
- **Example**: DeAndre gets SMS code but doesn't check phone for 15 min; taps "Resend Code"

**Scenario 2.4: Invalid Phone Verification Code**

- **Detection**: User enters wrong 6-digit code 3+ times
- **User Message**: "Code incorrect. Check your SMS and try again. (Attempts left: 2)"
- **Visual**: Red error text; attempt counter below input
- **Recovery Actions**:
  - "Resend Code" button (after 3 failures)
  - Clear to try again
- **Example**: Priya enters wrong code twice; sees counter "Attempts left: 1"

**Scenario 2.5: Session Expired**

- **Detection**: User makes API call with expired token
- **User Message**: "Your session expired. Please log in again."
- **Visual**: Modal redirects to login screen
- **Recovery Actions**:
  - Redirect to login; pre-fill email if possible
  - Auto-save form draft (booking, etc.)
- **Example**: Sender is at checkout, app in background for 30 mins, returns to see "Please log in again"

---

#### 3. **Booking Errors**

**Scenario 3.1: Sudser No Longer Available**

- **Detection**: User selects Sudser, then that Sudser cancels account or goes offline before booking is submitted
- **User Message**: "[Sudser] is no longer available. Here are 3 similar Sudsers:"
- **Visual**: Warning modal + suggested alternatives
- **Recovery Actions**:
  - Suggest 3 similar Sudsers (same service, nearby rating)
  - Allow browsing again
- **Example**: Maya selects Sarah, walks away, returns 30 min later; Sarah dropped off app; Maya sees 3 alternatives

**Scenario 3.2: Requested Time Slot Unavailable**

- **Detection**: User tries to book time that Sudser just accepted for another order
- **User Message**: "[Sudser] is no longer available at that time. Here are other times they're available:"
- **Visual**: Calendar shows unavailable slot grayed out; lists available alternatives
- **Recovery Actions**:
  - Show alternative times
  - Suggest other Sudsers at requested time
- **Example**: James tries to book Friday 5pm; slot just got taken; app shows Friday 7pm available instead

**Scenario 3.3: Invalid Service Selection**

- **Detection**: User selects service that Sudser doesn't offer (shouldn't happen in normal flow, but UI bug)
- **User Message**: "[Sudser] doesn't offer [Service]. Please choose another Sudser or service."
- **Visual**: Error banner with confirmation button
- **Recovery Actions**:
  - Clear invalid selection
  - Redirect to browse Sudsers
- **Example**: Bug in UI allows user to select Dry Cleaning for Sudser who only does Wash & Fold

**Scenario 3.4: Booking Submission Fails**

- **Detection**: POST /bookings API call fails after user confirms
- **User Message**: "Booking failed. Your changes were saved. Try again?"
- **Visual**: Error modal + "Retry" and "Cancel" buttons
- **Recovery Actions**:
  - Retry submission
  - Save booking draft locally
  - Contact support if repeated failures
- **Example**: Exact moment Maya confirms, internet drops; error shows; she retries when connection returns

---

#### 4. **Location & Geolocation Errors**

**Scenario 4.1: Location Permission Denied**

- **Detection**: User denies OS permission for location
- **User Message**: "Drip needs location to show nearby Sudsers. Enable in Settings → Drip → Location."
- **Visual**: Informational modal with settings link
- **Recovery Actions**:
  - Link to phone Settings
  - Allow browsing without location (show all Sudsers, not filtered by proximity)
- **Example**: Maya denies location permission on iOS; sees all Sudsers instead of nearby ones

**Scenario 4.2: Location Service Unavailable**

- **Detection**: GPS is off or unavailable
- **User Message**: "Couldn't determine your location. Enable Location Services on your device."
- **Visual**: Yellow warning banner
- **Recovery Actions**:
  - Manual address entry instead of GPS
  - Link to Settings
- **Example**: DeAndre is indoors; GPS doesn't work; prompt to enter address manually

---

#### 5. **Sudser Cancellations & Rejections**

**Scenario 5.1: Sudser Declines Booking**

- **Detection**: Sudser taps "Decline" on pending request
- **User Message** (to Sender): "[Sudser] isn't available for this booking. Here are 2 alternative Sudsers:"
- **Visual**: Notification + suggested alternatives modal
- **Recovery Actions**:
  - View alternative Sudsers
  - Rebook with different Sudser
  - Adjust booking time and rebook with original Sudser
- **Example**: Sarah declines Maya's Friday booking; Maya sees alternatives for same time or different times

**Scenario 5.2: Sudser Cancels Accepted Order** _(Phase 2 feature, but error handling framework)_

- **Detection**: Sudser cancels after accepting booking
- **User Message** (to Sender): "[Sudser] cancelled your booking. Rebooking options:"
- **Visual**: Alert with alternatives + "Rebook" button
- **Recovery Actions**:
  - Automatic refund (Phase 2 payment)
  - Quick-rebooking with alternative (pre-fills date/time)
- **Example**: Sarah accepted Friday booking, but gets sick; cancels; Maya gets alert + alternatives

---

#### 6. **Form Validation Errors**

**Scenario 6.1: Invalid Email Format**

- **Detection**: Email doesn't match regex during signup
- **User Message**: "Enter a valid email (e.g., you@example.com)"
- **Visual**: Red error text below field; field has red border
- **Recovery Actions**:
  - Clear error on next keystroke
  - Field stays focused for correction
- **Example**: DeAndre accidentally types "deandre@yahocom"; sees error; corrects to "@yahoo.com"

**Scenario 6.2: Weak Password**

- **Detection**: Password < 8 chars, no uppercase, no number
- **User Message**: "Password must be 8+ characters with a number and uppercase letter."
- **Visual**: Real-time feedback below password field (turns red → yellow → green as requirements met)
- **Recovery Actions**:
  - Show password strength indicator
  - Allow retry
- **Example**: Priya types "password"; sees red error; changes to "Password123" → green check

**Scenario 6.3: Password Mismatch**

- **Detection**: "Confirm Password" field doesn't match "Password"
- **User Message**: "Passwords don't match. Try again."
- **Visual**: Error below "Confirm Password" field; hint appears as user types
- **Recovery Actions**:
  - Clear error on next keystroke in confirm field
- **Example**: Maya types password, then mistype confirmation; error appears; she corrects

**Scenario 6.4: Phone Number Format Invalid**

- **Detection**: Phone number doesn't match expected format (10 digits for US)
- **User Message**: "Enter a valid US phone number (10 digits): (555) 123-4567"
- **Visual**: Placeholder or hint shows format; error if invalid
- **Recovery Actions**:
  - Auto-format as user types (e.g., (555) 123-4567)
  - Allow retry
- **Example**: James enters "5551234567"; auto-formatted to "(555) 123-4567"

**Scenario 6.5: Missing Required Fields**

- **Detection**: User taps "Submit" without filling all required fields
- **User Message**: "Please fill in [field name]."
- **Visual**: Highlight empty fields with red border; shake animation
- **Recovery Actions**:
  - Focus on first empty field
  - Error clears on field fill
- **Example**: Sudser onboarding: user forgets to select services; error appears on "Services" checkbox

---

#### 7. **Data Validation & Edge Cases**

**Scenario 7.1: Return Date Before Pickup Date**

- **Detection**: User selects return date earlier than pickup date
- **User Message**: "Return date must be after pickup date."
- **Visual**: Red error below date picker; affected field highlighted
- **Recovery Actions**:
  - Suggest valid return dates (next day onward)
  - Allow manual correction
- **Example**: Sudser accidentally sets return date to Friday when pickup is Saturday; error guides correction

**Scenario 7.2: Booking Time Conflict**

- **Detection**: Sudser has overlapping bookings (shouldn't happen if logic is correct, but edge case)
- **User Message**: "This time overlaps with another booking. Please choose a different time."
- **Visual**: Gray-out conflicting time slots on calendar
- **Recovery Actions**:
  - Show available time slots
  - Allow rebooking
- **Example**: Priya has 2 bookings on Friday; system prevents a 3rd overlapping request

**Scenario 7.3: Rate Not Set (Sudser)**

- **Detection**: Sudser has no rate set; Sender tries to book
- **User Message**: "[Sudser] hasn't set their rates yet. Choose another Sudser."
- **Visual**: Informational modal
- **Recovery Actions**:
  - Show alternative Sudsers
  - Suggest contacting Sudser via email (Phase 2: in-app chat)
- **Example**: New Sudser DeAndre forgets to set rates; users can't book him

**Scenario 7.4: Profile Incomplete**

- **Detection**: Sudser hasn't completed required onboarding fields
- **User Message**: "Complete your profile before accepting orders: [Missing fields list]"
- **Visual**: Yellow banner on Dashboard; linked to incomplete profile sections
- **Recovery Actions**:
  - Redirect to settings/profile
  - Block order acceptance until complete
- **Example**: DeAndre didn't set availability; banner shows "Please set your availability"

---

#### 8. **Rate Limiting & Abuse Prevention**

**Scenario 8.1: Too Many Login Attempts**

- **Detection**: 5+ failed login attempts in 10 minutes from same IP/email
- **User Message**: "Too many login attempts. Try again in 15 minutes or reset your password."
- **Visual**: Modal with "Reset Password" button
- **Recovery Actions**:
  - Offer password reset
  - Wait period enforced
- **Example**: Attacker tries 5 passwords; gets locked out

**Scenario 8.2: Too Many SMS Codes Requested**

- **Detection**: User requests SMS code 5+ times in 10 minutes
- **User Message**: "Too many code requests. Try again in 10 minutes."
- **Visual**: Gray-out "Resend Code" button with countdown timer
- **Recovery Actions**:
  - Wait for timer to expire
  - Contact support option
- **Example**: DeAndre accidentally hits "Resend" 3 times in a row; locked out from resending for 10 min

**Scenario 8.3: Spam Bookings (Sudser Perspective)**

- **Detection**: Same Sender books + cancels 5+ times in 1 hour (Phase 2)
- **User Message** (to Sudser): "This Sender has cancelled multiple bookings. Be cautious."
- **Visual**: Yellow warning flag on booking request
- **Recovery Actions**:
  - Sudser can decline or report
  - Drip may flag account for review
- **Example**: Priya sees warning flag on booking from suspicious Sender

---

#### 9. **Session & Data Loss Prevention**

**Scenario 9.1: Session Timeout**

- **Detection**: User inactive for 30+ minutes
- **User Message**: "Your session expired for security. Log in again to continue."
- **Visual**: Modal with "Log In" button; auto-save form draft if possible
- **Recovery Actions**:
  - Auto-save form (booking form, profile edits, etc.)
  - Redirect to login (pre-fill email)
  - On login, restore form draft
- **Example**: James starts booking, gets call, returns 1 hour later; session expired; logs back in; form is pre-filled

**Scenario 9.2: App Crash During Booking (Local Save)**

- **Detection**: App force-closed before booking confirmation
- **User Message**: "Welcome back! Your booking was in progress. Continue booking or start over?"
- **Visual**: Modal with "Resume" and "Start Over" buttons
- **Recovery Actions**:
  - Restore booking form from local cache
  - Allow resume or discard
- **Example**: Maya is at checkout, app crashes; when she reopens, "Resume booking?" appears

---

### Error Message Guidelines

- **Tone**: Playful, never blaming the user
- **Clarity**: Specific problem, not generic ("Invalid email format" not "Error")
- **Action**: Always suggest next step ("Try again", "Reset password", "Contact support")
- **Brevity**: One sentence if possible; max two sentences
- **Visual**: Match error severity (red for critical, yellow for warning, blue for info)

**Good Examples**:

- ✅ "Password must be 8+ characters with a number." (specific, actionable)
- ✅ "Sarah just became unavailable. Here are 3 similar Sudsers:" (empathetic, helpful)
- ✅ "No internet? Your booking was saved. We'll send it when you're back online." (reassuring)

**Bad Examples**:

- ❌ "Error 400" (not user-friendly)
- ❌ "Something went wrong" (not specific)
- ❌ "Invalid input" (not actionable)

---

## Acceptance Criteria

### Feature: User Authentication (Sender Signup)

**Feature Description**: A new Sender can sign up for Drip using email, password, and phone verification.

**Acceptance Criteria**:

#### AC 1.1: Email Validation

- **Given**: User on signup screen
- **When**: User enters invalid email (no @ symbol, no domain)
- **Then**:
  - Red error text appears below email field: "Enter a valid email"
  - "Continue" button is disabled
  - Error clears when user corrects input
- **Edge Case**: User enters "test+tag@example.com" (plus addressing) → System accepts as valid

#### AC 1.2: Password Requirements

- **Given**: User enters password field during signup
- **When**: User types password with 7 characters (below 8-char minimum)
- **Then**:
  - Red indicator appears below field: "Password must be 8+ characters"
  - Real-time feedback as user types updates to show missing requirements (needs uppercase, number, etc.)
  - "Continue" button is disabled until all requirements met
- **When**: User enters "MyPassword123" (meets all requirements)
- **Then**:
  - Green checkmark appears next to password field
  - "Continue" button is enabled
- **Edge Case**: User pastes password longer than 128 chars → System truncates or shows warning

#### AC 1.3: Confirm Password Match

- **Given**: User fills password and confirm password fields
- **When**: User enters different password in confirm field (e.g., "MyPassword123" vs "MyPassword124")
- **Then**:
  - Red error text appears: "Passwords don't match"
  - "Continue" button disabled
- **When**: User corrects confirm password to match
- **Then**:
  - Error clears; button enabled

#### AC 1.4: Phone Number Formatting & Validation

- **Given**: User enters phone number field
- **When**: User types "5551234567" (10 digit US number)
- **Then**:
  - System auto-formats to "(555) 123-4567" as user types
  - Country code selector shown (default: US +1)
- **When**: User enters invalid format (letters, symbols, < 10 digits)
- **Then**:
  - Error text: "Enter a valid US phone number"
  - "Continue" button disabled

#### AC 1.5: SMS Code Reception & Entry

- **Given**: User enters valid email, password, phone number
- **When**: User taps "Send Code" button
- **Then**:
  - UI shows "Sending code..." (spinner)
  - SMS sent to phone with 6-digit code
  - UI transitions to "Enter Code" screen
  - Auto-fill detected if SMS opens code (iOS UX pattern)
- **When**: User enters 6-digit code within 10 minutes
- **Then**:
  - System validates code
  - If correct: "Code verified! ✅" → Redirect to profile setup
  - If incorrect: "Code incorrect. Attempts left: 2" (show remaining attempts)
  - If 3 incorrect: "Too many attempts. Tap 'Resend Code'" (disable input, show resend button)

#### AC 1.6: Profile Setup Completion

- **Given**: User verified phone number
- **When**: User lands on profile setup screen (address, notifications, etc.)
- **Then**:
  - Address field is optional (for MVP, note this as Phase 2 feature)
  - Notification preferences shown (push, SMS, email)
  - "Complete Signup" button visible
- **When**: User taps "Complete Signup"
- **Then**:
  - Account created in database
  - User redirected to Home screen for Sender
  - Success notification: "Welcome to Drip! 🎉"
  - Session established (user logged in automatically)

#### AC 1.7: Existing Email Handling

- **Given**: Email already exists in system
- **When**: User tries to sign up with that email
- **Then**:
  - Error message: "This email is already registered. [Log In] or [Reset Password]?"
  - Helpful modal with "Log In" and "Forgot Password" buttons

#### AC 1.8: Network Failure During Signup

- **Given**: User completes all fields and taps "Continue"
- **When**: Network request fails (timeout or server error)
- **Then**:
  - Error modal: "Signup failed. Check your connection and try again."
  - "Retry" button visible
  - Form data preserved
- **When**: User fixes network and taps "Retry"
- **Then**:
  - Request re-submitted; account created if successful

---

### Feature: Browse & Filter Sudsers (Sender)

**Feature Description**: A Sender can browse a list of available Sudsers, see key info, and filter by service type.

**Acceptance Criteria**:

#### AC 2.1: Sudsers List Display

- **Given**: Sender on Home screen
- **When**: Sender taps "Browse Sudsers"
- **Then**:
  - List loads showing 10–20 Sudsers per page
  - Each card displays: profile photo, name, star rating (e.g., ⭐ 4.8), review count (e.g., "24 reviews"), hourly rate (e.g., "$18/hr"), services (pill badges: "Wash & Fold", "Delicates", etc.)
  - Cards are in readable order (default: rating high to low, or random mix for MVP)
- **Edge Case**: No Sudsers available → Display: "No Sudsers available in your area. Check back soon!"

#### AC 2.2: Card Tap Navigation

- **Given**: Browse screen with Sudser cards visible
- **When**: Sender taps a card
- **Then**:
  - Page transitions smoothly (fade/slide) to Sudser detail screen
  - Sudser name, full profile, photo, bio visible
  - Recent reviews shown (MVP: mock reviews, Phase 2: real reviews)
  - "Book with [Name]" button prominent at bottom

#### AC 2.3: Service Filter

- **Given**: Browse screen
- **When**: Sender taps "Filter: All Services" chip at top
- **Then**:
  - Modal appears with filter options: "All", "Wash & Fold", "Delicates", "Dry Cleaning", "Rush"
- **When**: Sender selects "Dry Cleaning"
- **Then**:
  - Modal closes; list updates to show only Sudsers offering Dry Cleaning
  - Filter chip at top now shows "Filter: Dry Cleaning" (highlight color change)
  - Number of results shown (e.g., "8 Sudsers available")
- **Edge Case**: No Sudsers for selected filter → "No Sudsers offer [service] yet. Try another service."

#### AC 2.4: Sort Options

- **Given**: Browse screen
- **When**: Sender taps "Sort: Rating" dropdown (optional MVP feature)
- **Then**:
  - Menu appears: "Rating (High to Low)", "Price (Low to High)", "New"
- **When**: Sender selects "Price (Low to High)"
- **Then**:
  - List re-sorts; cheapest rates first
  - Sort label updates to show active sort

#### AC 2.5: Loading State

- **Given**: User scrolls browse screen
- **When**: App fetches more Sudsers (pagination)
- **Then**:
  - Skeleton cards (placeholder gray boxes) appear as placeholders
  - Spinner at bottom of list: "Loading more Sudsers..."
  - Cards fade in as data loads (stagger animation)

#### AC 2.6: Repeat Sudser Highlighting (Optional)

- **Given**: Sender has booked with a Sudser before
- **When**: Sender browses list
- **Then**:
  - Card for that Sudser has subtle highlight (light background color) or label "You've booked before"
  - Helpful for James (returning Sender) use case

---

### Feature: Create Booking (Sender Selects Sudser & Services)

**Feature Description**: A Sender selects a Sudser, chooses services, sets date/time, and confirms booking.

**Acceptance Criteria**:

#### AC 3.1: Initiate Booking

- **Given**: Sender on Sudser detail screen
- **When**: Sender taps "Book with [Sudser]"
- **Then**:
  - Page transitions to Service Selection screen
  - Screen title: "What services do you need?"
  - Loading state shown briefly ("Loading [Sudser]'s availability...")
  - Form pre-populated with Sudser's available services (checkboxes)

#### AC 3.2: Select Services

- **Given**: Service Selection screen
- **When**: Sender checks "Wash & Fold" and "Hand Wash Delicates"
- **Then**:
  - Checkboxes update with visual feedback (blue highlight, checkmark)
  - Price updates in real-time at bottom: "Est. total: $45–65 (load size dependent)"
  - Note: MVP uses estimated range; Phase 2 will have exact pricing after payment integration
- **When**: Sender unchecks a service
- **Then**:
  - Checkbox unchecked; price updates

#### AC 3.3: Service Price Breakdown

- **Given**: Services selected
- **When**: Sender scrolls down
- **Then**:
  - Price breakdown visible (optional):
    - Wash & Fold: $18 per item
    - Hand Wash Delicates: +$5 per item
    - Rush surcharge: +$10
- **When**: Sender hovers/taps price info icon
- **Then**: Tooltip explains "Prices are estimates. Final cost depends on load size."

#### AC 3.4: Continue to Date/Time Selection

- **Given**: Services selected
- **When**: Sender taps "Next: Pick Date & Time" button
- **Then**:
  - Page transitions to Date & Time Selection screen
  - Title: "When do you need pickup?"

#### AC 3.5: Pickup Date Selection

- **Given**: Date & Time Selection screen
- **When**: Sender taps "Pickup Date" field
- **Then**:
  - Calendar picker opens
  - Today and future dates are selectable (grayed out = past dates)
  - Format shows: "Friday, March 15"
- **When**: Sender taps a date (e.g., Friday, March 15)
- **Then**:
  - Date selected; calendar closes; field shows "Friday, March 15"

#### AC 3.6: Pickup Time Selection

- **Given**: Pickup date selected
- **When**: Sender taps "Pickup Time" field
- **Then**:
  - Time picker shows available slots (from Sudser's availability profile)
  - E.g., "4:00 PM", "5:00 PM", "6:00 PM" (30-min or 1-hour slots depending on Sudser)
- **When**: Sender selects "5:00 PM"
- **Then**:
  - Time field shows "5:00 PM"
  - Return date field auto-suggests "Sunday, March 17" (2 days later, reasonable default)

#### AC 3.7: Return Date & Time Selection

- **Given**: Pickup date/time selected
- **When**: Sender taps "Return Date" field
- **Then**:
  - Calendar picker shows; earliest selectable date is 1 day after pickup
  - Sender selects return date
- **When**: Sender selects return time
- **Then**:
  - Same time picker as pickup (e.g., "10:00 AM")
- **Edge Case**: Return date before pickup → Error: "Return must be after pickup. Choose a later date."

#### AC 3.8: Special Notes

- **Given**: Date/Time selected
- **When**: Sender scrolls to "Special Notes" section
- **Then**:
  - Optional text field visible: "Any special instructions for [Sudser]?"
  - Character limit: 200 chars
  - Shows remaining character count
- **When**: Sender enters: "Stain on left sleeve, please be careful"
- **Then**:
  - Text saved; visible in confirmation

#### AC 3.9: Booking Confirmation Screen

- **Given**: All fields filled
- **When**: Sender taps "Review Booking" or "Confirm"
- **Then**:
  - Confirmation screen shows:
    - Sudser name & photo
    - Services: "Wash & Fold, Hand Wash Delicates"
    - Pickup: "Friday, March 15 at 5:00 PM"
    - Return: "Sunday, March 17 at 10:00 AM"
    - Estimated price: "$45–65"
    - Special notes: "Stain on left sleeve..."
    - Buttons: "Confirm Booking" (primary, teal), "Edit" (secondary), "Cancel"

#### AC 3.10: Confirmation Success

- **Given**: Confirmation screen
- **When**: Sender taps "Confirm Booking"
- **Then**:
  - Loading spinner appears ("Booking...")
  - If successful:
    - Success screen: "✅ Booking Confirmed!"
    - Shows Sudser name, pickup time, order ID
    - Buttons: "View Order Details", "Done" (back to home)
    - Push notification sent to Sudser: "New booking from [Sender]"
    - Confirmation notification sent to Sender
  - If failed:
    - Error message: "Booking failed. [Retry] [Cancel]"
    - Form data preserved

#### AC 3.11: Booking Failure Scenarios

- **Given**: User taps "Confirm Booking"
- **When**: Network error occurs
- **Then**: Error message: "Booking failed. Check your connection. [Retry]"
- **When**: Sudser became unavailable (rare edge case)
- **Then**: Error: "[Sudser] is no longer available. [Browse Sudsers]"
- **When**: Booking time slot filled by another Sender
- **Then**: Error: "Time slot no longer available. [Choose new time] [Browse other Sudsers]"

---

### Feature: Sudser Accepts Booking

**Feature Description**: A Sudser receives a new booking request and can accept or decline it.

**Acceptance Criteria**:

#### AC 4.1: Notification Received

- **Given**: Sudser dashboard (waiting for requests)
- **When**: New booking arrives (Sender confirmed)
- **Then**:
  - Push notification sent: "📬 New booking from [Sender]"
  - Badge (red circle with number) appears on app icon (OS level)
  - In-app toast notification (bottom of screen): "New booking from [Sender]. Tap to review."

#### AC 4.2: View Pending Request

- **Given**: Sudser sees notification or opens app
- **When**: Sudser taps notification or opens "Pending Requests" tab
- **Then**:
  - "Pending Requests" tab shows list of all unreviewed bookings
  - Each row: Sender name, pickup time, services, price
  - Tap row → Detail view

#### AC 4.3: Request Detail View

- **Given**: Sudser taps booking request
- **When**: Detail screen loads
- **Then**:
  - Sender name, photo, address (for pickup)
  - Services: "Wash & Fold, Hand Wash Delicates"
  - Pickup: "Friday, March 15 at 5:00 PM"
  - Return: "Sunday, March 17 at 10:00 AM"
  - Special notes: "Stain on left sleeve, please be careful"
  - Price Sudser receives: "$40–60" (or whatever Sudser's rate is)
  - Buttons: "Accept" (green, prominent), "Decline" (gray)
  - Quick-contact button: "Call Sender" (uses native phone)

#### AC 4.4: Accept Booking

- **Given**: Request detail view
- **When**: Sudser taps "Accept"
- **Then**:
  - Confirmation modal: "You'll pick up laundry from [Sender] on Friday at 5:00 PM. Confirm?"
  - Buttons: "Yes, Accept", "Cancel"
- **When**: Sudser confirms
- **Then**:
  - Loading spinner ("Accepting...")
  - If successful:
    - Request moves to "Accepted Orders" tab
    - Status badge: "Accepted ✅"
    - Calendar event created on Sudser's device
    - Push notification sent to Sender: "[Sudser] accepted your booking!"
    - Toast: "Order accepted!"
  - If failed (network error):
    - Error: "Failed to accept. Try again? [Retry] [Cancel]"

#### AC 4.5: Decline Booking

- **Given**: Request detail view
- **When**: Sudser taps "Decline"
- **Then**:
  - Modal appears: "Why are you declining?" (optional multi-choice)
    - Options: "Too early", "Too late", "Already booked", "Don't offer service", "Other"
  - Buttons: "Decline", "Cancel"
- **When**: Sudser selects reason and confirms
- **Then**:
  - Request removed from "Pending Requests"
  - Analytics logged (reason for decline)
  - Sender notified: "[Sudser] isn't available. Here are 2 similar alternatives:"
  - Toast to Sudser: "Request declined"

#### AC 4.6: Request Timeout (Edge Case)

- **Given**: Sudser has pending request for 24+ hours (no action taken)
- **When**: 24-hour period expires
- **Then**:
  - Request auto-declines
  - Sender notified: "Request expired. [Browse to rebook with another Sudser]"
  - (Optional MVP; can be Phase 2 feature)

---

### Feature: View Accepted Orders (Sudser Dashboard)

**Feature Description**: Sudser sees all accepted bookings and can manage them.

**Acceptance Criteria**:

#### AC 5.1: Accepted Orders List

- **Given**: Sudser on Dashboard
- **When**: Sudser taps "Accepted Orders" tab
- **Then**:
  - List of all accepted bookings visible
  - Sorted by pickup date (soonest first)
  - Each row: Sender name, pickup date/time, return date/time, service summary, status badge
  - Status badges: "Pickup in 3 days", "Pickup tomorrow", "Pickup today", "Ready for pickup"

#### AC 5.2: Order Detail View

- **Given**: Accepted Orders list
- **When**: Sudser taps a booking
- **Then**:
  - Detail screen shows full order info:
    - Sender name, photo, address
    - Services, pickup time, return time
    - Special notes
    - Price Sudser earns
    - Buttons: "Call Sender", "Mark Ready for Pickup" (if pickup is within 24 hours)

#### AC 5.3: Mark Ready for Pickup

- **Given**: Order detail screen, pickup within 24 hours
- **When**: Sudser taps "Mark Ready for Pickup"
- **Then**:
  - Confirmation modal: "Confirm the laundry is ready?"
  - Buttons: "Yes, Ready", "Cancel"
- **When**: Sudser confirms
- **Then**:
  - Status badge changes: "Ready for pickup ✅"
  - Push notification sent to Sender: "Your laundry is ready for pickup from [Sudser]!"
  - Toast: "Marked as ready!"

#### AC 5.4: Completed Orders

- **Given**: Sudser Dashboard
- **When**: Sudser taps "Completed Orders" (or scrolls past "Accepted Orders")
- **Then**:
  - List shows past bookings
  - Each row: Sender name, completion date, earnings
  - Tap to view order summary (read-only)
  - (Note: Phase 2 will include detailed earnings, ratings)

---

### Feature: Error Handling - Network Failure

**Feature Description**: When network is unavailable or slow, Drip gracefully informs user and allows recovery.

**Acceptance Criteria**:

#### AC 6.1: No Internet Detection

- **Given**: User on Browse screen with active network
- **When**: Network drops (user goes offline or WiFi disconnects)
- **Then**:
  - Red banner appears at top: "📡 No internet. Check your connection and try again."
  - "Retry" button visible on banner
  - UI remains visible (cached data shown if available)
  - Auto-retry every 5 seconds (up to 3 attempts)

#### AC 6.2: Manual Retry

- **Given**: No internet banner visible
- **When**: User taps "Retry" button
- **Then**:
  - Loading spinner shown ("Reconnecting...")
  - If successful: Banner disappears; data refreshes; toast "Back online!"
  - If still offline: Banner stays; user can retry again

#### AC 6.3: Slow Network (Timeout)

- **Given**: User on Browse screen
- **When**: Network is very slow; request takes > 10 seconds to respond
- **Then**:
  - Playful loading message: "Slow connection. Waiting for Drip..." (with animated spinner)
  - Animated laundry basket icon or similar playful loader
- **When**: Request completes successfully within 30 seconds
- **Then**: Data loads; message disappears
- **When**: Request times out after 30 seconds
- **Then**: Error modal: "Took too long. Try again? [Retry] [Cancel]"

#### AC 6.4: Server Error Recovery

- **Given**: User taps "Book Now" button
- **When**: Backend API temporarily down (500 error)
- **Then**:
  - Error modal: "Something went wrong on our end. We're working on it. Try again in a moment?"
  - Buttons: "Retry", "Cancel"
  - Form data preserved

---

### Feature: Error Handling - Invalid Booking

**Feature Description**: When a booking can't be completed due to availability or data issues, user is informed and guided to alternative.

**Acceptance Criteria**:

#### AC 7.1: Sudser No Longer Available

- **Given**: Sender confirmed booking with Sudser (A)
- **When**: Before booking API processes, Sudser (A) deactivates account or goes offline
- **Then**:
  - API returns error: "Sudser no longer available"
  - Modal shows: "[Sudser] is no longer available. Here are 2 similar Sudsers:"
  - Lists 2 alternative Sudsers (sorted by rating)
  - Buttons: "Browse Other Sudsers", "Start Over"
- **When**: Sender taps "Browse Other Sudsers"
- **Then**: Redirected to Browse screen with previous filters applied; can select another

#### AC 7.2: Time Slot Filled

- **Given**: Sender confirms booking for Friday 5 PM with Sudser
- **When**: Between sending request and confirmation, another Sender books same slot
- **Then**:
  - API returns: "Time slot no longer available"
  - Modal: "Friday 5 PM is now booked. Available times: Friday 6 PM, Saturday 10 AM"
  - List alternative times + alternative Sudsers
  - Buttons: "Choose new time", "Browse other Sudsers"

#### AC 7.3: Invalid Service for Sudser

- **Given**: Service selection complete
- **When**: Submitted booking includes service Sudser doesn't offer (shouldn't happen in normal flow, but UI bug)
- **Then**:
  - Error: "[Sudser] doesn't offer [Service]."
  - Modal: "Choose another service or Sudser?"
  - Buttons: "Edit services", "Browse other Sudsers"

#### AC 7.4: Return Date Before Pickup (Form Validation)

- **Given**: User on Date/Time screen
- **When**: User selects pickup Friday, return Wednesday (before Friday)
- **Then**:
  - Error text below Return Date field: "Return date must be after pickup."
  - Return field highlighted (red border)
  - "Confirm" button disabled
- **When**: User corrects return to Friday or later
- **Then**: Error clears; button enabled

---

### Feature: Error Handling - Authentication Failure

**Feature Description**: When login or signup fails, user receives clear guidance and recovery options.

**Acceptance Criteria**:

#### AC 8.1: Wrong Password

- **Given**: User on Login screen
- **When**: User enters email + incorrect password
- **Then**:
  - API returns 401 Unauthorized
  - Error text appears below password field (red): "Email or password is incorrect."
  - Light haptic feedback (subtle vibration)
  - "Forgot Password?" link visible

#### AC 8.2: Account Doesn't Exist

- **Given**: User on Login screen
- **When**: User enters email not in system
- **Then**:
  - Error modal: "No account found with [email]. Would you like to [Sign Up] or [Try different email]?"

#### AC 8.3: SMS Code Expired

- **Given**: User on SMS verification screen; 10+ minutes have passed
- **When**: User tries to enter code (or code received is expired)
- **Then**:
  - Error: "Code expired. We'll send a new one."
  - "Resend Code" button enabled
- **When**: User taps "Resend Code"
- **Then**: New SMS sent; code input cleared; counter reset

#### AC 8.4: Incorrect SMS Code (Multiple Attempts)

- **Given**: User enters incorrect SMS code twice
- **When**: User enters code a 3rd time, still incorrect
- **Then**:
  - Error: "Incorrect code. Attempts remaining: 0"
  - Input field disabled; "Resend Code" button now enabled
  - User must request new code

#### AC 8.5: Session Expired

- **Given**: User logged in 30+ days ago (session expired)
- **When**: User makes API call (e.g., tapping "Book")
- **Then**:
  - API returns 401 Unauthorized
  - Modal: "Your session expired. Please log in again."
  - Buttons: "Log In"
- **When**: User taps "Log In"
- **Then**: Redirected to login screen; email pre-filled if possible

---

## Technical Considerations

### Platform & Framework

- **Framework**: React Native (Expo)
- **Language**: TypeScript
- **Build Tools**: Expo Router, React Navigation, React Native Reanimated (for animations)
- **State Management**: (TBD; suggest Redux or Zustand for MVP)
- **API Communication**: Fetch API or Axios
- **Authentication**: JWT tokens (stored securely in device keychain, not localStorage)
- **Platform Target (MVP)**: iOS 14+ (Apple's minimum support)
- **Future**: Android support post-MVP

### Data & API

- **Backend**: Node.js + Express (or similar) with PostgreSQL
- **API Schema**: RESTful (or GraphQL for Phase 2 optimization)
- **Mock Data**: For MVP, use hardcoded or JSON file-based mock data (no real backend required for prototyping)
- **Error Responses**: Consistent error structure:
  ```json
  {
    "success": false,
    "error": {
      "code": "SUDSER_UNAVAILABLE",
      "message": "Sarah is no longer available.",
      "userMessage": "Sarah just went offline. Here are 2 alternative Sudsers."
    }
  }
  ```

### Authentication Flow (Phone Verification)

- **Signup Process**:
  1. User enters email + password → stored in backend
  2. User enters phone → SMS sent via service like Twilio with 6-digit code
  3. Code entered on device → verified on backend; account activated
  4. Session token issued; user logged in automatically
- **Login Process**:
  1. Email + password verified
  2. JWT token issued; stored in secure device storage (iOS Keychain)
  3. Token used for all subsequent API calls
- **Logout**:
  1. Token deleted from device
  2. Optional: invalidate token on backend (for Phase 2 security)

### State Management & Offline Support

- **Local Caching**:
  - Cache Sudser list (refreshed on each app open or manual refresh)
  - Cache user profile (refreshed on login and periodic sync)
  - Cache booking history (Phase 2 feature)
- **Offline Mode** (MVP scope is limited; Phase 2 enhancement):
  - Display cached data while offline
  - Queue booking submissions for when online (store locally, submit on connection restored)
  - Show "pending" status on orders waiting to sync

### Performance & Bundle Size

- **Target**: App bundle < 5 MB (including assets)
- **Image Optimization**: Compress all images; use WebP format where supported
- **Code Splitting**: Lazy-load screens via Expo Router
- **Animation Performance**: Use `react-native-reanimated` (GPU-accelerated); avoid heavy JavaScript animations
- **Memory Management**: Clean up listeners/timers on component unmount

### iOS-Specific Considerations

- **Safe Area**: Account for notch (iPhone X+) and Dynamic Island (iPhone 14+)
- **Status Bar**: Light/dark mode awareness
- **Haptic Feedback**: Use Expo Haptics (`expo-haptics`) for button taps and success confirmations
- **Keyboard**: Dismiss keyboard when scrolling; avoid keyboard covering inputs
- **Phone Verification**: Integrate with iOS SMS code field auto-fill (native UX)
- **Permissions**: Request location, contacts, calendar permissions with clear explanations
- **Push Notifications**: Use APNs (Apple Push Notification service) via backend

### Accessibility

- **Color Contrast**: All text meets WCAG AA standards (4.5:1 ratio minimum)
- **Font Size**: Body text >= 16px; support system font sizing (dynamic type)
- **VoiceOver Support**: All interactive elements labeled; screens navigable via VoiceOver
- **Haptic Feedback**: Provide haptics as additional feedback, not sole indicator (don't rely on haptics alone)

### Testing Strategy (MVP)

- **Unit Tests**: Core utilities (validation, formatting)
- **Integration Tests**: Auth flow, booking flow
- **E2E Tests**: Use mock data to test full user journeys
- **Manual Testing**: Test on iPhone 12, 14 (various screen sizes)

---

## Phase 2+ Features (Out of Scope)

These features are **explicitly deferred** to Phase 2 or later. Do **not** include them in MVP implementation.

### Real-Time Tracking

- GPS tracking of laundry pickup/return
- Live location map on Sender side
- Estimated arrival time (ETA)

### In-App Messaging

- Direct chat between Sender and Sudser
- Message history
- Photo sharing for damage reporting

### Payments & Billing

- Stripe or Square integration
- In-app payment processing
- Invoicing and digital receipts
- Refunds and chargebacks

### Ratings & Reviews

- 5-star reviews from Senders (of Sudsers)
- 5-star reviews from Sudsers (of Senders)
- Review text and moderation
- Reputation scoring algorithm
- Sudser profile page highlighting reviews

### Recurring Orders

- Set up weekly/bi-weekly laundry bookings
- Automatic rebooking with same Sudser
- Subscription pricing

### Search & Advanced Filters

- Search by Sudser name or location
- Filter by service hours, rating range, price range, distance
- Saved favorites / quick-book list

### Order History & Analytics

- View past bookings (Sender)
- View completed orders (Sudser)
- Earnings tracking and analytics (Sudser)
- Spending reports (Sender)

### Admin Dashboard

- Moderation and user management
- Analytics and business metrics
- Payment disputes and refunds

### Additional Features

- Referral program
- Promo codes and discounts
- Insurance/liability coverage integration
- Sudser team management (hire assistants)
- API for third-party integrations

---

## Summary

This SPEC defines Drip's MVP (browse → book → accept) with a focus on **user-friendly, fun, playful design** that makes college students want to use it. The emphasis on **error handling**, **user personas**, and **detailed acceptance criteria** ensures developers, designers, and QA have clear, testable targets.

Key principles throughout:

- ✅ **Playful tone** — friendly language, cute animations, playful icons/illustrations
- ✅ **Simplicity** — MVP scope constrained to essential features
- ✅ **Resilience** — comprehensive error handling for all scenarios
- ✅ **Trust** — phone verification, ratings (Phase 2), clear communication
- ✅ **Accessibility** — WCAG standards, VoiceOver, haptic feedback

**MVP must launch with**: Auth, Browse, Booking (Sender), Order Management (Sudser), Notifications, Error Handling, and Playful UX.

---

**Document Version**: 1.0  
**Next Review**: After MVP prototype build-out  
**Owner**: Product & Design Team
