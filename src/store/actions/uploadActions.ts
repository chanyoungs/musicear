import { IHistory, ISettings } from 'src/Components/Pages/DictationPage/types'

import { ThunkActionCustom } from './types'

export const uploadSettings = (
  settings: ISettings
): ThunkActionCustom<void> => (
  dispatch,
  getState,
  { getFirestore, getFirebase }
) => {
  const firestore = getFirestore()
  const state = getState()

  firestore
    .collection("settings")
    .doc(state.firebase.auth.uid)
    .set(settings)
    .catch((error) => console.error(error))
}

export const uploadHistory = (history: IHistory): ThunkActionCustom<void> => (
  dispatch,
  getState,
  { getFirestore, getFirebase }
) => {
  const firestore = getFirestore()
  const state = getState()

  firestore
    .collection("histories")
    .doc(state.firebase.auth.uid)
    .set(history)
    .catch((error) => console.error(error))
}
