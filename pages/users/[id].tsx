import { useRouter } from "next/router";
import {useEffect, useState} from "react";
import { User } from "../../types/User";
import {collection, getDoc, getFirestore, doc} from "firebase/firestore";
import { getAuth } from "firebase/auth";
import Link from "next/link";
import Tags from "@/components/Tags";

type Query = {
  id: string;
}

export default function UserPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const query = router.query as Query;

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

  //現在ログインしているユーザーのIDを取得して、それがクエリパラメーターのIDと一致するかどうかをチェック->一致のみbutton表示
  const handleButtonClick = () => {
    const auth = getAuth();
    const currentUser = auth.currentUser;
    //ログインしているユーザーがユーザー情報のuidと一致している場合
    if (currentUser && currentUser.uid == query.id) {
      return(
        <Link href="/postTagForm">
          <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
            好きなものについて登録する
          </button>
        </Link>
      )
    }else{
      return null;
    }
  }
  return (
    <div>
      {user ? (
        <>
          <div className="w-90 mx-auto text-center my-10">
            {/* user が存在する場合のみに囲んだ部分の描画が行われる */}
            {user && (
              <div >
                <h1 className="h4">{user.displayName}さん</h1>
                <div className="m-5">{user.id}</div>
                {handleButtonClick()}
              </div>
            )}
          </div>
          <Tags  user={query.id}/>
        </>
      ) : (
        <p>ロード中…</p>
      )}
    </div>
  )
}
