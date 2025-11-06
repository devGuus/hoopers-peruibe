async function loginComGoogle() {
  try {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: window.location.origin, // volta para o site após login
      },
    });

    if (error) {
      console.error("Erro ao autenticar:", error);
      alert("Erro ao tentar login com Google. Tente novamente.");
    } else {
      console.log("Redirecionando para autenticação do Google...");
    }
  } catch (e) {
    console.error("Erro inesperado:", e);
    alert("Erro inesperado. Verifique o console.");
  }
}

// Torna a função acessível no HTML
window.loginComGoogle = loginComGoogle;

// 🔄 Verifica se o usuário já está logado (opcional)
supabase.auth.onAuthStateChange(async (event, session) => {
  if (session) {
    console.log("Usuário autenticado:", session.user);
    // Aqui você pode redirecionar para a página principal do app
    // window.location.href = "home.html";
  } else {
    console.log("Usuário deslogado ou sessão expirada");
  }
});
