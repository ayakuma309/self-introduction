import {  useEffect, useState } from "react";
import { NextPage } from 'next';
import { doc, getFirestore, collection, addDoc, query, onSnapshot, deleteDoc } from "firebase/firestore";
import uuid from 'react-uuid';
import { getAuth } from "firebase/auth";
import MyPageButton from "@/components/atoms/MyPageButton";
import { useRouter } from "next/router";
import Layout from "@/components/Layout";


interface Tags{
  id: string,
  text: string
}
const postTagForm: NextPage = () => {
  const router = useRouter();
  const auth = getAuth();
  const currentUser = auth.currentUser;
  const db = getFirestore();
  const [tag, setTag] = useState<string>("");
  const [tags, setTags] = useState<Tags[]>([])

  //tagの追加
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setTags([...tags, { text: tag, id: uuid() }]);
    setTag("");
  }
  //tagの削除
  const deleteTag = (index: number) => {
    const newTags = [...tags];
    newTags.splice(index, 1);
    setTags(newTags);
  }


  //DBからタグを取得用
  const [dbTags, setDbTags] = useState< Tags[]>([]);
  //tagをfirestoreに保存
  const addTags = async (tags: Tags[]) => {
    try {
      if (currentUser) {
        const tagRef = collection(doc(db, "users", currentUser.uid), "tags");
        for (const tag of tags) {
          await addDoc(tagRef, {
            id: tag.id,
            text: tag.text,
          });
        }
        setTags([]);
        router.push(`/users/${currentUser.uid}`);
      }
    } catch (error) {
      console.log(error);
    }
  };

  //tagをfirestoreから取得
  useEffect(() => {
    if(currentUser){
      const db = getFirestore();
      const ref = collection(doc(db, "users", currentUser.uid), "tags");
      const q = query(ref);
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const gotTags: Tags[] = [];
        querySnapshot.forEach((doc) => {
          gotTags.push({
            id: doc.id,
            text: doc.data().text,
          });
        });
        setDbTags(gotTags);
      });
      return unsubscribe;
    }
  },[]);

  //firestoreからタグを削除
  const handleDelete = async (tagId: string) => {
    if (window.confirm('削除してもよろしいですか？')) {
      try {
        if (currentUser) {
          await deleteDoc(doc(db, "users", currentUser.uid, "tags", tagId));
          setDbTags((prevTags) => prevTags.filter((tag) => tag.id !== tagId));
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  return (
    <Layout>
      <MyPageButton>戻る</MyPageButton>
      <div className="w-full max-w-xs mx-auto my-3">
        <form onSubmit={handleSubmit} className="bg-white  rounded px-8 pt-6 pb-8 mb-4">
          <div className="mb-4">
            <label htmlFor="tags" className="block text-gray-700 font-bold mb-2">
              好きなものを保存
            </label>
            <input
              name="tags"
              type="text"
              value={tag}
              onChange={(e) => setTag(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          <div className="flex items-center justify-between">
            <button
              type="submit"
              disabled={!tag}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mx-2"
            >
              追加
            </button>
          </div>
        </form>
        {/*戻るボタンの追加 */}

        {tags && (
          <>
            <div className="bg-white text-black  rounded px-8 pt-6 pb-8 mb-4">
              <h1 className="text-gray-700 font-bold">今から追加する好きなもの</h1>
              {tags.map((tag, index) =>(
                <div key={index} className="text-black text-lg my-2">
                  {tag.text}
                  <button onClick={() => deleteTag(index)}>削除</button>
                </div>
              ))}
              <button
                onClick={() => addTags(tags)}
                disabled={!tags}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline my-2"
              >
                作成する
              </button>
            </div>
          </>
        )}
        {dbTags &&(
          <div className="bg-white text-black  rounded px-8 pt-6 pb-8 mb-4">
            <h1 className="text-gray-700 font-bold">追加されている好きなもの</h1>
            {dbTags.map((tag, index) =>(
              <div key={index} className="text-black text-lg my-2">
                {tag.text}
                <button
                  onClick={() => handleDelete(tag.id)}
                  className="bg-pink-500 text-white active:bg-pink-600 font-bold uppercase text-xs px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none mx-2 mb-1 ease-linear transition-all duration-150" type="button"
                >
                  削除
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};


export default postTagForm;
