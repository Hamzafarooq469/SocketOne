
const init = async () => {
    const sql = `
    CREATE TABLE IF NOT EXISTS USER (
        id SERIAL PRIMARY KEY,
        firebase_uid VARCHAR(100) NOT NULL UNIQUE,
        email VARCHAR(70) NOT NULL UNIQUE,
        firstName VARCHAR(100) NOT NULL,
        lastName VARCHAR(50),
        phone VARCHAR(20),
        avatarUrl VARCHAR,
        createdAt TIMESTAMP NOT NULL DEFAULT NOW(),
        updatedAt TIMESTAMP NOT NULL DEFAULT NOW()
    )
    `

    await db.QUERY(sql)
}

init().catch((err) => console.error('Error creating users table:', err.stack || err))

const signUp = async ({
    
})

