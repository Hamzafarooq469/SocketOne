const admin = require('../services/Firebase/firebaseAdmin')

const verifyFirebaseToken = async (req, res, next) => {
	const authHeader = req.headers.authorization

	if (!authHeader?.startsWith('Bearer ')) {
		return res.status(401).json({ message: 'Missing or invalid authorization header' })
	}

	const token = authHeader.split('Bearer ')[1]

	try {
		const decoded = await admin.auth().verifyIdToken(token)
		req.firebaseUser = decoded
		next()
	} catch (error) {
		return res.status(401).json({ message: 'Invalid or expired token' })
	}
}

module.exports = { verifyFirebaseToken }
