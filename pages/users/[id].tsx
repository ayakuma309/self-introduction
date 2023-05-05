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
        <div className="w-90 mx-auto text-center my-10">
          {/* user が存在する場合のみに囲んだ部分の描画が行われる */}
          {user && (
            <div >
              <h1 className="h4">{user.displayName}さん</h1>
              <div className="m-5">{user.id}</div>
            </div>
          )}
          <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            Button
          </button>
        </div>
      ) : (
        <p>ロード中…</p>
      )}
    </div>
  )
}
