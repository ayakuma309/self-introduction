import { NextPage } from "next";
import { useUser} from "../lib/auth";
import Layout from "@/components/Layout";
import MyPageButton from "@/components/atoms/MyPageButton";
import Header from "@/components/Header";
const Home: NextPage = () => {
  const user = useUser();
  return (
    <>
      <Header/>
      <Layout>
        {user && (
          <MyPageButton>マイページへ</MyPageButton>
        )}
      </Layout>
    </>
  );
}
export default Home;
