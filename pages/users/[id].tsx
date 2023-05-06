import { useRouter } from "next/router";
import {useEffect, useState} from "react";
import { User } from "../../types/User";
import {collection, getDoc, getFirestore, doc} from "firebase/firestore";
import { getAuth } from "firebase/auth";
import Link from "next/link";
import Tags from "@/components/Tags";
import { TwitterShareButton,TwitterIcon } from "react-share";
import Head from "next/head";

type Query = {
  id: string;
}

export default function UserPage() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? "";
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const query = router.query as Query;

  const CopyUrlButton = () => {
    const url = `${baseUrl}/users/${query.id}`;
    const [copied, setCopied] = useState(false);

    const handleCopyClick = async () => {
      try {
        await navigator.clipboard.writeText(url);
        setCopied(true);
      } catch (err) {
        console.error('Failed to copy URL: ', err);
      }
    }

    return (
      <button
        onClick={handleCopyClick}
        className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded mx-2"
      >
        {copied ? 'Copied!' : 'Copy URL'}
      </button>
    );
  };

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
        <>
        <div className="my-3  d-flex justify-center">
          <Link href="/postTagForm">
            <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
              登録する
            </button>
          </Link>
          {/* <TwitterShareButton
            title="わたしについて"
            hashtags={["わたしについて"]}
            related={["ZCunkuma"]}
            url={`${baseUrl}/users/${query.id}`}
          >
            <TwitterIcon   className="share-button"/>
          </TwitterShareButton> */}
          <CopyUrlButton />
        </div>
      </>
      )
    }else{
      return (
        <Link href="/">
          <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
            TOP
          </button>
        </Link>
      );
    }
  }
  return (
    <div>
      <Head>
        <title>わたしについて</title>
        <meta name="description" content="わたしについて" />
        <link rel="icon" href="/favicon.ico" />
        <meta
          name="og:title"
          property="og:title"
          content={`わたしについて`}
        />
        <meta
          name="description"
          content={`わたしについて紹介します`}
        />
        <meta
          property="og:image"
          key="ogImage"
          content={`${baseUrl}/ogp.png`}
        />
        <meta
          name="twitter:card"
          key="twitterCard"
          content="summary_large_image"
        />
        <meta name="twitter:site" content="@ZCunkuma" />
        <meta name="twitter:creator" content="@ZCunkuma" />
        <meta
          name="twitter:image"
          key="twitterImage"
          content={encodeURI(`${baseUrl}/ogp.png`)}
        />
      </Head>
      {user ? (
        <>
          <div className="w-90 mx-auto text-center my-10">
            {/* user が存在する場合のみに囲んだ部分の描画が行われる */}
            {user && (
              <div >
                <h1 className="text-2xl font-bold">{user.displayName}さん</h1>
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
