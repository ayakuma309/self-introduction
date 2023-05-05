import { useRouter } from "next/router";
import {useEffect, useState} from "react";
import { User } from "../../types/User";
import {collection, getDoc, getFirestore, doc} from "firebase/firestore";

type Query = {
  id: string;
}

export default function UserPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const query = router.query as Query;
  const db = getFirestore();

  useEffect(() => {
    if (query.id === undefined) {
      return
    }
    async function loadUser() { //ユーザーの読み込み
      const db = getFirestore()
      const ref = doc(collection(db, 'users'), query.id)
      const userDoc = await getDoc(ref)

      if (!userDoc.exists()) {
        return
      }
      const gotUser = userDoc.data() as User
      setUser(gotUser)
    }
    loadUser()
  }, [query.id]);
  return (
    <div>
      {user ? (
        <div>
          <p>{user.id}</p>
          <p>{user.displayName}</p>
        </div>
      ) : (
        <p>ロード中…</p>
      )}
    </div>
  )
}
