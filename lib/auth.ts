import { useEffect, useState } from "react";
import uuid from 'react-uuid';
import { atom, useRecoilValue, useSetRecoilState } from "recoil";
import {
  User,
  getAuth,
  signInWithRedirect,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
} from "firebase/auth";

import {
  getFirestore,
  collection,
  doc,
  getDoc,
  setDoc,
  query,
  where,
} from 'firebase/firestore'

type UserState = User | null; // null の場合はログインしていない状態
const userState = atom<UserState>({
  key: "userState",
  default: null,
  dangerouslyAllowMutability: true,
});

// ログイン
export const login = (): Promise<void> => {
  const provider = new GoogleAuthProvider();
  const auth = getAuth();
  return signInWithRedirect(auth, provider);
};
// ログアウト
export const logout = (): Promise<void> => {
  const auth = getAuth();
  const confirmed = window.confirm("ログアウトしてもよろしいですか？");
  if (confirmed) {
    return signOut(auth);
  } else {
    return Promise.resolve(); // ログアウトをキャンセルした場合は Promise を解決する
  }
};
// ユーザー情報取得
export const useAuth = ()=> {
  const setUser = useSetRecoilState(userState);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      //DB保存する
      if (user) {
        const db = getFirestore();
        const userRef = doc(db, "users", user.uid); // ユーザー情報を取得
        const userDoc = await getDoc(userRef);
        if (!userDoc.exists()) {
          await setDoc(userRef, {
            id: uuid(),
            displayName: user.displayName,
          });
        }
      }
    });
    return unsubscribe;
  }, [setUser]);
};

//2.useUser() はその UserState を他のコンポーネントで呼び出すための関数です.
export const useUser = (): UserState => {
  return useRecoilValue(userState);
};
