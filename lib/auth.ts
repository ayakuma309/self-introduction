import { useEffect, useState } from "react";
import { atom, useRecoilValue, useSetRecoilState } from "recoil";
import {
  User,
  getAuth,
  signInWithRedirect,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
} from "firebase/auth";

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
  return signOut(auth);
};
// ユーザー情報取得
export const useAuth = (): boolean => {
	//5.isLoading は onAuthStateChanged() を実行中か確認するための状態
  const [isLoading, setIsLoading] = useState(true);
  const setUser = useSetRecoilState(userState);

  useEffect(() => {
    const auth = getAuth();
		//4.ユーザ認証を監視し,変更があったときに引数のコールバック関数を実行
    return onAuthStateChanged(auth, (user) => {
      setUser(user);
      setIsLoading(false);
    });
  }, [setUser]);

  return isLoading;
};

//2.useUser() はその UserState を他のコンポーネントで呼び出すための関数です.
export const useUser = (): UserState => {
  return useRecoilValue(userState);
};
