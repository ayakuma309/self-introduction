import { NextPage } from "next";
import { useUser} from "../lib/auth";
import Layout from "@/components/Layout";
import MyPageButton from "@/components/atoms/MyPageButton";
import Header from "@/components/Header";
import Image from "next/image";
const Home: NextPage = () => {
  const user = useUser();
  return (
    <>
      <Header/>
      <Layout>
        {user && (
          <MyPageButton>マイページへ</MyPageButton>
        )}
        <Image src="/ogp.png" alt="ogp" width={500} height={630}/>
      </Layout>
    </>
  );
}
export default Home;
