import * as SQLite from 'expo-sqlite';
import type { Order, OrderStatus, Review, Role, User, WaterTemp } from './types';

// ─── Open database ───────────────────────────────────────────────────────────

const db = SQLite.openDatabaseSync('drip.db');

// ─── Migrations ──────────────────────────────────────────────────────────────

function runMigrations(): void {
  const version = parseInt(getMeta('schema_version') ?? '0', 10);
  if (version < 2) {
    try { db.execSync(`ALTER TABLE orders ADD COLUMN dropoffDateTime TEXT NOT NULL DEFAULT '';`); } catch {}
    try { db.execSync(`ALTER TABLE orders ADD COLUMN dropoffLocation TEXT NOT NULL DEFAULT '';`); } catch {}
    try { db.execSync(`UPDATE orders SET status = 'dropped_off' WHERE status = 'done';`); } catch {}
    db.execSync(`DROP TABLE IF EXISTS reviews;`);
    setMeta('schema_version', '2');
  }
}

// ─── Schema ──────────────────────────────────────────────────────────────────

export function initDatabase(): void {
  db.execSync(`PRAGMA journal_mode = WAL;`);

  // app_meta must exist before runMigrations reads schema_version
  db.execSync(`
    CREATE TABLE IF NOT EXISTS app_meta (
      key TEXT PRIMARY KEY NOT NULL,
      value TEXT NOT NULL
    );
  `);

  runMigrations();

  db.execSync(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY NOT NULL,
      username TEXT NOT NULL UNIQUE COLLATE NOCASE,
      passwordHash TEXT NOT NULL,
      role TEXT NOT NULL,
      displayName TEXT NOT NULL,
      avatar TEXT,
      createdAt TEXT NOT NULL
    );
  `);

  db.execSync(`
    CREATE TABLE IF NOT EXISTS orders (
      id TEXT PRIMARY KEY NOT NULL,
      wearerId TEXT NOT NULL,
      washerId TEXT,
      items TEXT NOT NULL,
      pickupDateTime TEXT NOT NULL,
      pickupLocation TEXT NOT NULL,
      dropoffDateTime TEXT NOT NULL DEFAULT '',
      dropoffLocation TEXT NOT NULL DEFAULT '',
      waterTemp TEXT NOT NULL DEFAULT 'cold',
      notes TEXT NOT NULL DEFAULT '',
      status TEXT NOT NULL,
      statusTimestamps TEXT NOT NULL DEFAULT '{}',
      createdAt TEXT NOT NULL,
      updatedAt TEXT NOT NULL
    );
  `);

  db.execSync(`
    CREATE TABLE IF NOT EXISTS reviews (
      id TEXT PRIMARY KEY NOT NULL,
      orderId TEXT NOT NULL,
      wearerId TEXT NOT NULL,
      washerId TEXT NOT NULL,
      rating INTEGER NOT NULL,
      text TEXT NOT NULL DEFAULT '',
      reviewerRole TEXT NOT NULL DEFAULT 'wearer',
      createdAt TEXT NOT NULL,
      UNIQUE(orderId, reviewerRole)
    );
  `);
}

export function clearDatabase(): void {
  db.execSync(`DELETE FROM reviews;`);
  db.execSync(`DELETE FROM orders;`);
  db.execSync(`DELETE FROM users;`);
  db.execSync(`DELETE FROM app_meta;`);
}

// ─── app_meta helpers ────────────────────────────────────────────────────────

export function getMeta(key: string): string | null {
  const row = db.getFirstSync<{ value: string }>(
    `SELECT value FROM app_meta WHERE key = ?`,
    [key],
  );
  return row?.value ?? null;
}

export function setMeta(key: string, value: string): void {
  db.runSync(
    `INSERT INTO app_meta (key, value) VALUES (?, ?)
     ON CONFLICT(key) DO UPDATE SET value = excluded.value`,
    [key, value],
  );
}

// ─── Row mappers ─────────────────────────────────────────────────────────────

interface UserRow {
  id: string;
  username: string;
  passwordHash: string;
  role: string;
  displayName: string;
  avatar: string | null;
  createdAt: string;
}

interface OrderRow {
  id: string;
  wearerId: string;
  washerId: string | null;
  items: string;
  pickupDateTime: string;
  pickupLocation: string;
  dropoffDateTime: string;
  dropoffLocation: string;
  waterTemp: string;
  notes: string;
  status: string;
  statusTimestamps: string;
  createdAt: string;
  updatedAt: string;
}

interface ReviewRow {
  id: string;
  orderId: string;
  wearerId: string;
  washerId: string;
  rating: number;
  text: string;
  reviewerRole: string;
  createdAt: string;
}

function rowToUser(row: UserRow): User {
  return {
    id: row.id,
    username: row.username,
    passwordHash: row.passwordHash,
    role: row.role as Role,
    displayName: row.displayName,
    avatar: row.avatar ?? undefined,
    createdAt: row.createdAt,
  };
}

function rowToOrder(row: OrderRow): Order {
  return {
    id: row.id,
    wearerId: row.wearerId,
    washerId: row.washerId,
    items: JSON.parse(row.items),
    pickupDateTime: row.pickupDateTime,
    pickupLocation: row.pickupLocation,
    dropoffDateTime: row.dropoffDateTime ?? '',
    dropoffLocation: row.dropoffLocation ?? '',
    waterTemp: row.waterTemp as WaterTemp,
    notes: row.notes,
    status: row.status as OrderStatus,
    statusTimestamps: JSON.parse(row.statusTimestamps),
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  };
}

function rowToReview(row: ReviewRow): Review {
  return {
    id: row.id,
    orderId: row.orderId,
    wearerId: row.wearerId,
    washerId: row.washerId,
    rating: row.rating,
    text: row.text,
    reviewerRole: (row.reviewerRole as 'wearer' | 'washer') ?? 'wearer',
    createdAt: row.createdAt,
  };
}

// ─── User helpers ────────────────────────────────────────────────────────────

export function getUserByUsername(username: string): User | null {
  const row = db.getFirstSync<UserRow>(
    `SELECT * FROM users WHERE username = ? COLLATE NOCASE`,
    [username],
  );
  return row ? rowToUser(row) : null;
}

export function getUserById(id: string): User | null {
  const row = db.getFirstSync<UserRow>(`SELECT * FROM users WHERE id = ?`, [id]);
  return row ? rowToUser(row) : null;
}

export function getAllUsers(): User[] {
  const rows = db.getAllSync<UserRow>(`SELECT * FROM users`);
  return rows.map(rowToUser);
}

export function createUser(user: User): void {
  db.runSync(
    `INSERT INTO users (id, username, passwordHash, role, displayName, avatar, createdAt)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [
      user.id,
      user.username,
      user.passwordHash,
      user.role,
      user.displayName,
      user.avatar ?? null,
      user.createdAt,
    ],
  );
}

export function updateUser(user: User): void {
  db.runSync(
    `UPDATE users SET username = ?, passwordHash = ?, role = ?, displayName = ?, avatar = ?, createdAt = ?
     WHERE id = ?`,
    [
      user.username,
      user.passwordHash,
      user.role,
      user.displayName,
      user.avatar ?? null,
      user.createdAt,
      user.id,
    ],
  );
}

export function usernameExists(username: string): boolean {
  const row = db.getFirstSync<{ count: number }>(
    `SELECT COUNT(*) as count FROM users WHERE username = ? COLLATE NOCASE`,
    [username],
  );
  return (row?.count ?? 0) > 0;
}

// ─── Order helpers ───────────────────────────────────────────────────────────

export function getOrdersByWearer(wearerId: string): Order[] {
  const rows = db.getAllSync<OrderRow>(
    `SELECT * FROM orders WHERE wearerId = ? ORDER BY createdAt DESC`,
    [wearerId],
  );
  return rows.map(rowToOrder);
}

export function getOrdersByWasher(washerId: string): Order[] {
  const rows = db.getAllSync<OrderRow>(
    `SELECT * FROM orders WHERE washerId = ? ORDER BY createdAt DESC`,
    [washerId],
  );
  return rows.map(rowToOrder);
}

export function getPendingOrders(): Order[] {
  const rows = db.getAllSync<OrderRow>(
    `SELECT * FROM orders WHERE status = 'pending' ORDER BY createdAt ASC`,
  );
  return rows.map(rowToOrder);
}

export function createOrder(order: Order): void {
  db.runSync(
    `INSERT INTO orders
       (id, wearerId, washerId, items, pickupDateTime, pickupLocation,
        dropoffDateTime, dropoffLocation, waterTemp, notes, status,
        statusTimestamps, createdAt, updatedAt)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      order.id,
      order.wearerId,
      order.washerId,
      JSON.stringify(order.items),
      order.pickupDateTime,
      order.pickupLocation,
      order.dropoffDateTime,
      order.dropoffLocation,
      order.waterTemp,
      order.notes,
      order.status,
      JSON.stringify(order.statusTimestamps),
      order.createdAt,
      order.updatedAt,
    ],
  );
}

export function updateOrder(order: Order): void {
  db.runSync(
    `UPDATE orders
     SET wearerId = ?, washerId = ?, items = ?, pickupDateTime = ?,
         pickupLocation = ?, dropoffDateTime = ?, dropoffLocation = ?,
         waterTemp = ?, notes = ?, status = ?, statusTimestamps = ?, updatedAt = ?
     WHERE id = ?`,
    [
      order.wearerId,
      order.washerId,
      JSON.stringify(order.items),
      order.pickupDateTime,
      order.pickupLocation,
      order.dropoffDateTime,
      order.dropoffLocation,
      order.waterTemp,
      order.notes,
      order.status,
      JSON.stringify(order.statusTimestamps),
      order.updatedAt,
      order.id,
    ],
  );
}

// ─── Review helpers ──────────────────────────────────────────────────────────

export function getAllReviews(): Review[] {
  const rows = db.getAllSync<ReviewRow>(`SELECT * FROM reviews ORDER BY createdAt ASC`);
  return rows.map(rowToReview);
}

export function getReviewsByWasher(washerId: string): Review[] {
  const rows = db.getAllSync<ReviewRow>(
    `SELECT * FROM reviews WHERE washerId = ? AND reviewerRole = 'wearer' ORDER BY createdAt DESC`,
    [washerId],
  );
  return rows.map(rowToReview);
}

export function getReviewByOrderAndRole(
  orderId: string,
  reviewerRole: 'wearer' | 'washer',
): Review | null {
  const row = db.getFirstSync<ReviewRow>(
    `SELECT * FROM reviews WHERE orderId = ? AND reviewerRole = ?`,
    [orderId, reviewerRole],
  );
  return row ? rowToReview(row) : null;
}

export function createReview(review: Review): void {
  db.runSync(
    `INSERT INTO reviews (id, orderId, wearerId, washerId, rating, text, reviewerRole, createdAt)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      review.id,
      review.orderId,
      review.wearerId,
      review.washerId,
      review.rating,
      review.text,
      review.reviewerRole,
      review.createdAt,
    ],
  );
}
