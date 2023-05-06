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
    <header className="py-4 px-8 bg-white flex justify-between items-center">
      <h1 className="text-lg font-bold">アプリ名</h1>
      {user ? (
        <>
          <h2>ログインしている</h2>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-blue-500 text-white rounded-md">
            ログアウト
          </button>
        </>
      ) : (
        <>
          <h2>ログインしていない</h2>
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
