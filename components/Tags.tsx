import React, { useEffect, useState } from 'react'
import { TagCloud } from 'react-tagcloud'
import styles from "@/styles/post.module.css"
import {  getFirestore, collection, onSnapshot, query } from "firebase/firestore";

interface Tag{
  text: string;
}
interface TagsProps{
  user: string;
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
const Tags = ({ user }: TagsProps) => {
  const [tags, setTags] = useState<Tag[]>([
    {
      text: ""
    },
  ]);

  //tagをfirestoreから取得
  useEffect(() => {
    if(user){
      const db = getFirestore();
      const ref = collection(db, "users", user, "tags");
      const q = query(ref);
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const gotTags: Tag[] = [];
        querySnapshot.forEach((doc) => {
          gotTags.push({
            text: doc.data().text,
        });
        });
        setTags(gotTags);
      });
      return unsubscribe;
    }
  },[user]);

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
    <div className={styles.container}>
      <TagCloud
        tags={tagCloudTags} minSize={1} maxSize={5} renderer={customRenderer}
      />
    </div>
  )
}

export default Tags;
