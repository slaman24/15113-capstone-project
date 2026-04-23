# Drip — Code Review

Reviewed against `SPEC.md` v1.0. Each finding is marked **[PASS]**, **[FAIL]**, or **[WARN]**.

---

## AC-1 · Authentication

**1. [PASS]** Registration validates unique username, password ≥ 8 characters, and role selection.
`context/auth-context.tsx` lines 38–43, 129–142: `validateUsername`, `validatePassword`, and the explicit `trimmedPassword.length < 8` check all produce the exact messages the spec requires.

**2. [PASS]** After successful registration the user is routed to the correct interface.
`app/register.tsx` line 36: `router.replace('/')` calls `app/index.tsx`, which redirects based on `user.role` (`(wearer)` or `(washer)`).

**3. [PASS]** Login works with a registered username and password.
`context/auth-context.tsx` lines 94–122: username lookup, hash comparison, and session write are all implemented.

**4. [PASS]** After login the user is taken to the correct interface for their role.
`app/index.tsx` lines 16–19: role-based `<Redirect>` covers both roles.

**5. [PASS]** Passwords are stored as SHA-256 hashes; no plaintext exists in storage.
`lib/hash.ts` lines 3–7: `expo-crypto.digestStringAsync(CryptoDigestAlgorithm.SHA256, ...)`. Both registration and login hash before storing or comparing.

**6. [PASS]** Session persists across restarts.
`context/auth-context.tsx` lines 73–83: `AuthProvider` reads `drip_session` from AsyncStorage on mount and restores the user.

**7. [PASS]** Logout clears the session and redirects to login.
`context/auth-context.tsx` lines 218–223: `removeItem(STORAGE_KEYS.SESSION)` + `setUser(null)`. Both role layouts guard with `if (!user) return <Redirect href="/login" />`.

**8. [PASS]** Duplicate username registration is rejected with the correct message.
`context/auth-context.tsx` lines 149–152: `usernameExists` check produces `"That username is already taken. Please choose another."`.

**9. [PASS]** Both "username not found" and "wrong password" produce the same generic message.
`context/auth-context.tsx` lines 110, 116: both throw `"Incorrect username or password."`, avoiding username enumeration.

---

## AC-2 · Wearer Interface

**10. [PASS]** A Wearer can select item types and quantities and submit an order.
`app/(wearer)/index.tsx` lines 220–263: quantity controls and `handleSubmit` work correctly.

**11. [FAIL]** The Place Order form does **not** show a confirmation message with the order ID after submission.
`app/(wearer)/index.tsx` lines 250–256: `reset()` is called (which sets `successId` back to `null`) and then `router.push('/(wearer)/orders')` navigates away immediately. `setSuccessId(newOrder.id)` is never called, so the `successBox` UI (line 272) is never shown. The spec requires: _"show a confirmation message with the order ID, reset form."_

**12. [PASS]** A Wearer can see only their own orders.
`lib/database.ts` lines 257–262: `getOrdersByWearer` filters by `wearerId` via a parameterised SQL query.

**13. [PASS]** Cancel button is visible only on `pending` orders.
`app/(wearer)/orders.tsx` lines 300–309: `{item.status === 'pending' && <TouchableOpacity ... />}`.

**14. [FAIL]** Wearer orders list is sorted by **status** rather than `createdAt` descending as required by the spec.
`app/(wearer)/orders.tsx` lines 336–341: the `FlatList` data is sorted by a custom `rank` map (pending=0, accepted=1, …). The spec requires descending `createdAt` order.

**15. [PASS]** A Wearer cannot access the Washer interface.
`app/(washer)/_layout.tsx` line 20: `if (user.role !== 'washer') return <Redirect href="/(wearer)" />`.

---

## AC-3 · Washer Interface

**16. [PASS]** A Washer can see all `pending` orders from all Wearers.
`lib/database.ts` lines 272–277: `getPendingOrders()` selects all rows with `status = 'pending'`, sorted ascending by `createdAt`.

**17. [PASS]** Accepting a pending order sets `washerId` and removes the card from the available list.
`app/(washer)/index.tsx` lines 53–65: status set to `accepted`, `washerId` set to current user, and the item is filtered out of local state.

**18. [FAIL]** The status pipeline diverges significantly from the spec.
`lib/types.ts` lines 22–28 and `app/(washer)/jobs.tsx` lines 85–91: the code implements a **five-state** pipeline (`accepted → picked_up → washing → dropped_off`) with buttons "Mark Picked Up", "Start Washing", and "Mark Dropped Off". The spec defines a **two-step** pipeline: `accepted → in_progress` ("Mark Picked Up") `→ done` ("Mark Done"). The intermediate statuses `picked_up`, `washing`, and `dropped_off` do not exist in the spec's `OrderStatus` type.

**19. [PASS]** A Washer can only see their own jobs.
`lib/database.ts` lines 264–269: `getOrdersByWasher` filters by `washerId`.

**20. [PASS]** A Washer cannot access the Wearer interface.
`app/(wearer)/_layout.tsx` line 20: `if (user.role !== 'wearer') return <Redirect href="/(washer)" />`.

---

## AC-4 · Mock Data

**21. [PASS]** Four mock users are present on first launch.
`lib/seed.ts` lines 20–58: `alex_w`, `jamie_w`, `morgan_washer`, `riley_washer` created with correct roles and display names.

**22. [PASS]** Five mock orders are seeded.
`lib/seed.ts` lines 59–157: five orders (`aaa001`–`aaa005`) created and `setMeta('seeded', '1')` written atomically.

**23. [FAIL]** Mock order statuses do not match the spec.
`lib/seed.ts` lines 102, 121: `order-aaa003` is seeded with status `'washing'` (spec: `'in_progress'`) and `order-aaa004` with status `'dropped_off'` (spec: `'done'`). These are consequence of finding #18 but also mean the spec-documented demo walkthrough won't work.

**24. [PASS]** Each mock user can log in with the documented password.
`lib/seed.ts` lines 7–13: all four passwords are hashed via `hashPassword` at seed time and stored in the database.

---

## AC-5 · Branding

**25. [PASS]** Drip logo is shown on the Login screen.
`app/login.tsx` lines 84–92: conditional `<Image source={{ uri: LOGO.localUri ?? LOGO.uri }} />`.

**26. [PASS]** Drip logo is shown on the Register screen.
`app/register.tsx` lines 53–58: `<Image source={require('@/assets/images/drip_logo.png')} />`.

**27. [PASS]** Brand colours are used consistently.
`constants/theme.ts` lines 1–10: all nine `drip` tokens are defined correctly. Buttons, badges, and the role toggle all reference `drip.*` values.

---

## AC-6 · Error Handling

**28. [FAIL]** Wrong inline error message for empty item selection.
`app/(wearer)/index.tsx` line 235: produces `"Please add at least one item."`. The spec requires `"Please add at least one item to your order."`.

**29. [FAIL]** The spec error `"Please enter a pickup time."` is never produced.
The spec defines a simple text input for pickup time with this error. The code replaced the text input with a `DateTimePicker` component and added a separate pickup _location_ field (`"Please enter a pickup location."` at line 236). The spec-required error message no longer maps to any validation.

**30. [PASS]** All other documented auth error messages match the spec exactly.
`context/auth-context.tsx` lines 32–44, 101, 108–109, 116, 126, 133, 141, 147–151: all nine auth error strings match the spec verbatim.

**31. [PASS]** Error messages are displayed inline; no `Alert` is used for validation errors.
Login, register, and all order screens render errors in `<Text style={styles.error}>` components. The `Alert.alert` call in `app/login.tsx` (line 52) is only for the destructive "Reset Demo Data" confirmation, which is acceptable.

**32. [PASS]** Action buttons are disabled during async operations.
All primary buttons check `loading` / `isAccepting` / `updatingId` to set `disabled` and reduced opacity.

---

## Bugs & Logic Errors

**33. [FAIL]** `OrderStatus` type in `lib/types.ts` does not match the spec.
`lib/types.ts` lines 22–28: the code defines `picked_up | washing | dropped_off` where the spec requires `in_progress | done`. Every downstream comparison (`statusColor`, `STATUS_ORDER`, `STATUS_SORT`, `nextAction`, `statusLabel`, badge colours, cancel-visibility checks) is built on these non-spec values, making the entire status pipeline non-compliant.

**34. [WARN]** `runMigrations()` is called before the `orders` and `users` tables are created.
`lib/database.ts` lines 13–22: migration blocks attempt `ALTER TABLE orders …` before `CREATE TABLE IF NOT EXISTS orders` (line 54). The try/catch swallows the errors silently on a fresh install, so the app works, but a legitimate migration failure (e.g. a real constraint error) would also be silently swallowed.

**35. [WARN]** `handleSubmitPrompt` in `app/(wearer)/orders.tsx` (line 252) marks `promptSaving` as `true` but the body is entirely synchronous (`createReview` is a sync SQLite call). The `finally` block runs before React re-renders, so the "Saving…" state is never visually displayed. This is misleading but functionally harmless.

---

## Missing Error Handling

**36. [WARN]** `createOrder` in `app/(wearer)/index.tsx` (line 249) is called without a `try/catch`.
The outer `try` block on line 242 catches only the surrounding async work; if `createOrder(newOrder)` throws a synchronous SQLite error it will be caught by the same block, which is fine. However, the outer `catch` shows `"Could not place your order. Please try again."` — this is correct per the spec. This is a minor readability concern rather than a functional bug.

**37. [WARN]** `handleCancel` in `app/(wearer)/orders.tsx` (line 277) is a synchronous function that calls the synchronous `updateOrder`. The `cancelError` is reset on entry but the error state is a single string shared across all order cards. Rapidly cancelling two orders in sequence could display a stale error from the first operation while the second is in flight.

---

## Code Quality

**38. [WARN]** `generateId()` is duplicated across three files.
`context/auth-context.tsx` line 22, `app/(wearer)/index.tsx` line 28, `app/(wearer)/orders.tsx` line 23, `app/(washer)/jobs.tsx` line 17: identical implementations. Should be extracted to `lib/` (e.g. `lib/id.ts`).

**39. [WARN]** `generateId()` uses `Math.random()`, which is not cryptographically random.
The spec requires UUID v4 (`// uuid v4` comment in the spec's `User` interface). UUID v4 requires random bytes from a CSPRNG. On low-entropy environments (some Android WebViews) `Math.random()` can produce weak or colliding values. `expo-crypto.getRandomValues()` should be used instead, or `crypto.randomUUID()` (available in Hermes/JSI).

**40. [WARN]** `itemsSummary`, `formatDateTime`, `TEMP_LABEL`, and `statusColor` are re-defined in multiple screen files (`(wearer)/orders.tsx`, `(washer)/index.tsx`, `(washer)/jobs.tsx`). These shared helpers should live in a common utility module.

**41. [WARN]** Profile screens (`(wearer)/profile.tsx` line 23, `(washer)/profile.tsx` line 23) have a missing newline between state declarations, making the code harder to read:

```ts
const [nameSaved, setNameSaved] = useState(false);
const [reviews, setReviews] = useState<Review[]>([]);
```

These are on the same line, which is likely an editing artefact.

---

## Security Concerns

**42. [WARN]** Passwords are trimmed before hashing in both `login` and `register`.
`context/auth-context.tsx` lines 96–97, 133–134: `password.trim()` is called before `hashPassword`. Stripping leading/trailing whitespace from passwords is non-standard and may surprise users who (intentionally or accidentally) include spaces. It is consistent between registration and login so it will not break authentication, but it silently weakens the password space and is not mentioned in the spec.

**43. [WARN]** `clearDatabase()` is reachable from the Login screen via a single tap + confirmation.
`app/login.tsx` line 62 (`clearDatabase()`): this deletes every row from every table. For a production app this would be a catastrophic data loss vector. The `Alert` confirmation mitigates accidental activation, but the function should not be present outside a dedicated developer/debug build.

---

## Architectural Deviations from Spec

**44. [FAIL]** Storage system is SQLite, not AsyncStorage as specified.
The spec's Tech Stack table says `@react-native-async-storage/async-storage` for local storage and explicitly defines `STORAGE_KEYS.USERS = "drip_users"` and `STORAGE_KEYS.ORDERS = "drip_orders"`. The implementation uses `expo-sqlite` (`lib/database.ts` line 5: `SQLite.openDatabaseSync('drip.db')`) for all user and order data. Only the session token is stored in AsyncStorage.

**45. [FAIL]** `STORAGE_KEYS` is missing the `USERS` and `ORDERS` keys defined in the spec.
`lib/storage.ts` lines 3–5: only `SESSION: 'drip_session'` is present. The spec defines all three keys.

**46. [FAIL]** Seed detection uses an SQLite meta key, not an AsyncStorage key `drip_seeded`.
`lib/seed.ts` line 6: `getMeta('seeded') === '1'` queries the SQLite `app_meta` table. The spec says seeding should be checked _"via an `AsyncStorage` key `drip_seeded`"_.

**47. [FAIL]** Profile screens are editable in v1, contrary to the spec.
`app/(wearer)/profile.tsx` lines 40–52, `app/(washer)/profile.tsx` lines 40–52: both screens expose a display-name `TextInput` and a "Save" button. The spec states _"Shows display name and username (read-only in v1)"_ and explicitly lists _"Editing display name or password after registration"_ as Out of Scope.

**48. [WARN]** Several out-of-scope v1 features are implemented:

- **Ratings & Reviews** — `lib/database.ts` review helpers, `(wearer)/orders.tsx` review modal, `(washer)/jobs.tsx` rate-wearer modal, `getReviewsByWasher`/`getReviewsByWearer` in both profile screens. The spec lists _"Ratings and reviews"_ as Out of Scope.
- **Price calculation** — `calculatePrice()` in `app/(wearer)/index.tsx` lines 43–51. Not in spec.
- **Water temperature selection** — `WaterTemp` type, picker in place-order screen. Not in spec.
- **Drop-off scheduling** — separate drop-off date/time/location fields. Not in spec (spec has pickup time only).
- **Avatar selection** — `avatar` field on `User`, emoji picker on register/profile screens. Not in spec.
