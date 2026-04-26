import { supabase } from "./supabaseClient";

function Login() {
  const loginWithGitHub = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "github",
      options: {
        redirectTo: "http://localhost:5173",
      },
    });

    if (error) {
      alert("Error al iniciar sesión: " + error.message);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1>Country Explorer</h1>
        <p>Inicia sesión para explorar información de países.</p>

        <button onClick={loginWithGitHub} style={styles.button}>
          Iniciar sesión con GitHub
        </button>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "linear-gradient(135deg, #e0f2fe, #f8fafc)",
    fontFamily: "Arial, sans-serif",
  },
  card: {
    width: "360px",
    padding: "35px",
    borderRadius: "20px",
    background: "white",
    textAlign: "center",
    boxShadow: "0 15px 35px rgba(0,0,0,0.15)",
  },
  button: {
    marginTop: "20px",
    width: "100%",
    padding: "14px",
    border: "none",
    borderRadius: "12px",
    background: "#111827",
    color: "white",
    fontSize: "16px",
    cursor: "pointer",
  },
};

export default Login;