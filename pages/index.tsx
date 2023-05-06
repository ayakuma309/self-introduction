import { NextPage } from "next";
import { useUser} from "../lib/auth";
import Layout from "@/components/Layout";
import MyPageButton from "@/components/atoms/MyPageButton";
const Home: NextPage = () => {
  const user = useUser();
  return (
    <>
      <Layout>
        {user && (
          <MyPageButton>マイページへ</MyPageButton>
        )}
      </Layout>
    </>
  );
}
export default Home;
