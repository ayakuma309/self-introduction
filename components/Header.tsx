import { useUser, login, logout } from "../lib/auth";

function Header() {
  const user = useUser();

  const handleLogin = (): void => {
    login().catch((error) => console.error(error));
  };

  const handleLogout = (): void => {
    logout().catch((error) => console.error(error));
  };
  return (
    <header className="py-4 px-8 bg-white flex justify-between items-center text-black">
      <h1 className="text-lg font-bold">わたしについて</h1>
      {user ? (
        <>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-blue-500 text-white rounded-md">
            ログアウト
          </button>
        </>
      ) : (
        <>
          <button
            onClick={handleLogin}
            className="px-4 py-2 bg-blue-500 text-white rounded-md">
            ログイン
          </button>
        </>
      )}
    </header>
  );
}

export default Header;
