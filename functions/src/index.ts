import * as admin from 'firebase-admin'
import * as functions from 'firebase-functions'

admin.initializeApp()

// On user delete, delete firestore data on histories, profiles and settings
export const onUserDelete = functions.auth
  .user()
  .onDelete((user) =>
    Promise.all(
      ["histories", "profiles", "settings"].map((collection) =>
        admin.firestore().collection(collection).doc(user.uid).delete()
      )
    )
  )

// Returns {usernameAvailable: boolean} which true if username available i.e. Not already used
export const checkUsernameAvailable = functions.https.onCall(
  async (data: { username: string }, context) => {
    const querySnapshot = await admin
      .firestore()
      .collection("profiles")
      .where("username", "==", data.username)
      .get()
    return { usernameAvailable: querySnapshot.empty }
  }
)
// functions.logger.info("Hello logs!", {structuredData: true});
