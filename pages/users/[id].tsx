import { useRouter } from "next/router";
import {useEffect, useState} from "react";
import { User } from "../../types/User";
import {collection, getDoc, getFirestore, doc} from "firebase/firestore";
import { getAuth } from "firebase/auth";
import Link from "next/link";
import Tags from "@/components/Tags";
import { GetServerSideProps, NextPage } from 'next';
import Head from "next/head";
// import { TwitterShareButton,TwitterIcon } from "react-share";

type Query = {
  id: string;
}
type Props = {
  ogImageUrl: string
  title: string
  description: string
}

const UserPage: NextPage<Props> = ({ ogImageUrl, title, description }) => {
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
        <title>{user?.displayName}さんの${title}</title>
        <meta name="description" content={description} />
        <meta property="og:title" content={`${user?.displayName}さんの${title}`} />
        <meta property="og:description" content={description} />
        <meta property="og:url" content={`${baseUrl}/users/${query.id}`} />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="ZCunkuma" />
        <meta property="og:image" content={ogImageUrl} />

        <meta
          name="twitter:card"
          key="twitterCard"
          content="summary_large_image"
        />
        <meta
          name="twitter:image"
          key="twitterImage"
          content={ogImageUrl}
        />
        <link rel="icon" href="/favicon.ico" />
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
export const getServerSideProps: GetServerSideProps = async (context) => {
  // ここでOGP画像のURLを取得する処理を行います。
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? "";
  const ogImageUrl: string = `${baseUrl}/ogp.png`;
  const title: string = 'わたしについて';
  const description: string = '自己紹介します';
  return {
    props: {
      ogImageUrl,
      title,
      description
    },
  };
};

export default UserPage;
