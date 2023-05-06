import Link from 'next/link'
import React, { ReactNode }  from 'react'
import { getAuth } from "firebase/auth";

interface Props {
  children: ReactNode;
}
const MyPageButton = ({children}: Props) => {
  const auth = getAuth();
  const currentUser = auth.currentUser;

  return (
    <Link href={`/users/${currentUser?.uid}`}>
      <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
      >
        {children}
      </button>
    </Link>
  )
}

export default MyPageButton;
