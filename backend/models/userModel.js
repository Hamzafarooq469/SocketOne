const db = require('../config/db')



const init = async () => {
	await db.query(`
		CREATE TABLE IF NOT EXISTS users (
			id           SERIAL PRIMARY KEY,
			firebase_uid VARCHAR(128) NOT NULL UNIQUE,
			email        VARCHAR(255) NOT NULL UNIQUE,
			name         VARCHAR(100) NOT NULL,
			phone        VARCHAR(20),
			"avatarUrl"  TEXT,
			"createdAt"  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
			"updatedAt"  TIMESTAMPTZ NOT NULL DEFAULT NOW()
		)
	`)
}

init().catch((err) => console.error('Error creating users table:', err.stack || err))

const createUser = async ({ firebase_uid, email, name, phone = null, avatarUrl = null }) => {
	const sql = `
		INSERT INTO users (firebase_uid, email, name, phone, "avatarUrl")
		VALUES ($1, $2, $3, $4, $5)
		RETURNING id, firebase_uid, email, name, phone, "avatarUrl", "createdAt", "updatedAt"
	`
	const result = await db.query(sql, [firebase_uid, email.toLowerCase(), name, phone, avatarUrl])
	return result.rows[0]
}

const findByFirebaseUid = async (firebase_uid) => {
	const sql = `SELECT id, firebase_uid, email, name, phone, "avatarUrl", "createdAt", "updatedAt" FROM users WHERE firebase_uid = $1`
	const result = await db.query(sql, [firebase_uid])
	return result.rows[0] || null
}

const findByEmail = async (email) => {
	const sql = `SELECT id, firebase_uid, email, name, phone, "avatarUrl", "createdAt", "updatedAt" FROM users WHERE email = $1`
	const result = await db.query(sql, [email.toLowerCase()])
	return result.rows[0] || null
}

const findByEmailOrFirebaseUid = async (email, firebase_uid) => {
	const sql = `SELECT id, firebase_uid, email, name, phone, "avatarUrl", "createdAt", "updatedAt" FROM users WHERE email = $1 OR firebase_uid = $2 LIMIT 1`
	const result = await db.query(sql, [email.toLowerCase(), firebase_uid])
	return result.rows[0] || null
}

const searchUsers = async (query, limit = 20) => {
	const sql = `
		SELECT id, firebase_uid, name, email, "avatarUrl"
		FROM users
		WHERE name ILIKE $1 OR email ILIKE $1
		ORDER BY name ASC
		LIMIT $2
	`
	const result = await db.query(sql, [`%${query}%`, limit])
	return result.rows
}

module.exports = {
	init,
	createUser,
	findByEmail,
	findByFirebaseUid,
	findByEmailOrFirebaseUid,
	searchUsers,
}
