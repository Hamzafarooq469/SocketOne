const { initializeApp, getApps, cert } = require('firebase-admin/app')
const { getAuth } = require('firebase-admin/auth')
const serviceAccount = require('./firebaseCredentials.json')

const app = getApps().length === 0
  ? initializeApp({ credential: cert(serviceAccount) })
  : getApps()[0]

const authInstance = getAuth(app)

module.exports = {
  auth: () => authInstance,
  getAuth: () => authInstance
}
