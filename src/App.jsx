import { useEffect, useState } from "react";
import { supabase } from "./supabaseClient";
import Login from "./Login";
import Countries from "./Countries";

function App() {
  const [session, setSession] = useState(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
    });

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
      }
    );

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  const logout = async () => {
    await supabase.auth.signOut();
  };

  if (!session) {
    return <Login />;
  }

  const userName =
    session.user.user_metadata?.user_name ||
    session.user.user_metadata?.name ||
    "User";

  const avatar = session.user.user_metadata?.avatar_url;

  return (
    <div style={styles.app}>
      <header style={styles.navbar}>
        <div>
          <h1 style={styles.logo}>Country Explorer</h1>
          <p style={styles.description}>
            Explore country information stored in Supabase.
          </p>
        </div>

        <div style={styles.userBox}>
          {avatar && <img src={avatar} alt={userName} style={styles.avatar} />}

          <div>
            <p style={styles.welcome}>Welcome,</p>
            <p style={styles.userName}>{userName}</p>
          </div>

          <button onClick={logout} style={styles.logoutButton}>
            Logout
          </button>
        </div>
      </header>

      <main style={styles.main}>
        <Countries />
      </main>
    </div>
  );
}

const styles = {
  app: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #e0f2fe, #f8fafc, #dbeafe)",
    fontFamily: "Arial, sans-serif",
    padding: "25px",
  },
  navbar: {
    maxWidth: "1200px",
    margin: "0 auto",
    background: "rgba(255,255,255,0.85)",
    borderRadius: "22px",
    padding: "22px 28px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    boxShadow: "0 12px 30px rgba(15, 23, 42, 0.12)",
    flexWrap: "wrap",
    gap: "20px",
  },
  logo: {
    margin: 0,
    color: "#0f172a",
    fontSize: "30px",
  },
  description: {
    margin: "6px 0 0",
    color: "#64748b",
  },
  userBox: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    background: "#f8fafc",
    padding: "10px 14px",
    borderRadius: "16px",
    border: "1px solid #e2e8f0",
  },
  avatar: {
    width: "42px",
    height: "42px",
    borderRadius: "50%",
  },
  welcome: {
    margin: 0,
    color: "#64748b",
    fontSize: "13px",
  },
  userName: {
    margin: 0,
    color: "#0f172a",
    fontWeight: "bold",
  },
  logoutButton: {
    padding: "10px 14px",
    borderRadius: "12px",
    border: "none",
    background: "#ef4444",
    color: "white",
    cursor: "pointer",
    fontWeight: "bold",
  },
  main: {
    maxWidth: "1200px",
    margin: "0 auto",
  },
};

export default App;