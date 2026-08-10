const User = require('../models/userModel')
const admin = require('../services/Firebase/firebaseAdmin')

const signUp = async (req, res) => {
  const { name, email, uid, token } = req.body
  console.log('Sign-up request received:', req.body)

  try {
    if (!name || !email || !uid || !token) {
      return res.status(400).json({ message: 'Please provide all required fields' })
    }

    const existingUser = await User.findByEmailOrFirebaseUid(email, uid)
    if (existingUser) {
      return res.status(400).json({ message: 'User with this email or UID already exists' })
    }

    const newUser = await User.createUser({ firebase_uid: uid, email, name })

    return res.status(201).json({
      message: 'User created successfully',
      user: {
        id:    newUser.id,
        name:  newUser.name,
        email: newUser.email,
        uid:   newUser.firebase_uid,
      },
    })
  } catch (error) {
    console.error('Error in signUp:', error)
    return res.status(500).json({ message: 'Server error' })
  }
}

const signIn = async (req, res) => {
  try {
    const { idToken } = req.body
    console.log('Sign-in request received:', req.body)

    if (!idToken || typeof idToken !== 'string') {
      return res.status(400).json({ message: 'Missing or invalid token' })
    }

    const decodedToken = await admin.auth().verifyIdToken(idToken)
    const { uid, email } = decodedToken

    const user =
      (await User.findByEmail(email)) ||
      (await User.findByFirebaseUid(uid))

    if (!user) {
      return res.status(401).json({ message: 'User not found in database' })
    }

    return res.status(200).json({
      message: 'User authenticated',
      user: {
        id:    user.id,
        name:  user.name,
        email: user.email,
        uid:   user.firebase_uid,
        token: idToken,
      },
    })
  } catch (error) {
    console.error('Error in signIn:', error.message)
    return res.status(500).json({ message: 'Internal server error', error: error.message })
  }
}

const signOut = async (req, res) => {
  try {
    return res.status(200).json({ message: 'Signed out successfully' })
  } catch (error) {
    console.error('Error in signOut:', error)
    return res.status(500).json({ message: 'Server error during sign out' })
  }
}

const searchUsers = async (req, res) => {
  try {
    const { query } = req.query

    if (!query || query.trim().length === 0) {
      return res.status(400).json({ message: 'Search query is required' })
    }

    const users = await User.searchUsers(query.trim(), 20)

    return res.status(200).json(users)
  } catch (error) {
    console.error('Error in searchUsers:', error)
    return res.status(500).json({ error: 'Failed to search users' })
  }
}

module.exports = { signUp, signIn, signOut, searchUsers }