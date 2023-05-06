import {  useState } from "react";
import { NextPage } from 'next';
import { doc, getFirestore, collection, addDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import Link from "next/link";
import MyPageButton from "@/components/atoms/MyPageButton";

const postTagForm: NextPage = () => {
  const auth = getAuth();
  const currentUser = auth.currentUser;
  const db = getFirestore();
  const [tag, setTag] = useState<string>("");

  //tagをfirestoreに保存
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try{
      if(currentUser){
        await addDoc(collection(doc(db, "users", currentUser.uid), "tags"), {
          text: tag,
        });
        setTag("");
      }
    }catch(error){
      console.log(error);
    }
  };

  return (
    <>
      <div className="w-full max-w-xs mx-auto my-10">
        <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
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
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="submit"
            >
              Submit
            </button>
          </div>
        </form>
        {/*戻るボタンの追加 */}
        <MyPageButton>戻る</MyPageButton>
      </div>
    </>
  );
};


export default postTagForm;
