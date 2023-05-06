import { useEffect, useState } from "react";
import { NextPage } from 'next';
import{ TagCloud} from 'react-tagcloud'
import { doc, getFirestore, collection, addDoc, onSnapshot, query } from "firebase/firestore";
import { getAuth } from "firebase/auth";

interface Tag{
  text: string;
}

const customRenderer = (tag: any, size: any, color: any) => (
  <span
    key={tag.value}
    style={{
      animation: 'blinker 3s linear infinite',
      animationDelay: `${Math.random() * 2}s`,
      fontSize: `${size / 2}em`,
      border: `2px solid ${color}`,
      margin: '3px',
      padding: '3px',
      display: 'inline-block',
      color: 'white',
    }}
  >
    {tag.value}
  </span>
)
const postForm: NextPage = () => {
  const auth = getAuth();
  const currentUser = auth.currentUser;
  const db = getFirestore();
  const [tag, setTag] = useState<string>("");
  const [tags, settags] = useState<Tag[]>([
    {
      text: ""
    },
  ]);

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

  //tagをfirestoreから取得
  useEffect(() => {
    if(currentUser){
      const db = getFirestore();
      const ref = collection(db, "users", currentUser.uid, "tags");
      const q = query(ref);
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const gotTags: Tag[] = [];
        querySnapshot.forEach((doc) => {
          gotTags.push({
            text: doc.data().text,
        });
        });
        settags(gotTags);
      });
      return unsubscribe;
    }
  },[currentUser]);

  //tagをtagCloud用に新しく作り替える
  //スプレッド構文を使って展開し、プロパティを追加
  const updateTags = tags.map((tag) =>{
    return {
      ...tag,
      count:  Math.floor(Math.random() * (16 - 14) + 14),
    }
  });
  //配列をもとに作成
  const tagCloudTags = updateTags.map((tag) => {
    return {
      value: tag.text,
      count: tag.count,
    };
  });

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
      </div>
      <TagCloud
          tags={tagCloudTags}
          minSize={12}
          maxSize={18}
          renderer={customRenderer}
        />
    </>
  );
};


export default postForm
