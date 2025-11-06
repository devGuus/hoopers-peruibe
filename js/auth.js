//const supabase = createClient(SUPABASE_URL, process.env.SUPABASE_KEY);
const SUPABASE_URL = "https://hauarormiaflwagzdggm.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhhdWFyb3JtaWFmbHdhZ3pkZ2dtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIzMTkyMTgsImV4cCI6MjA3Nzg5NTIxOH0.uiWGoZlVsS2_MT_uyNPFW4BCBaiXHJ--y--D5v6-TNc";

const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

supabase.auth.onAuthStateChange(async (event, session) => {
  if (session && window.location.pathname.includes("index.html")) {
    window.location.href = "quadras.html";
  }
});

// Alterna formulários
function mostrarCadastro() {
  document.getElementById("login-form").classList.add("oculto");
  document.getElementById("cadastro-form").classList.remove("oculto");
}

function mostrarLogin() {
  document.getElementById("cadastro-form").classList.add("oculto");
  document.getElementById("login-form").classList.remove("oculto");
}

// Função de cadastro
async function cadastrar() {
  const email = document.getElementById("cadastro-email").value;
  const senha = document.getElementById("cadastro-senha").value;
  const nome = document.getElementById("nome").value;
  const apelido = document.getElementById("apelido").value;
  const idade = document.getElementById("idade").value;
  const posicao = document.getElementById("posicao").value;
  const altura = document.getElementById("altura").value;

  const { data, error } = await supabase.auth.signUp({
    email: email,
    password: senha,
  });

  if (error) {
    alert("Erro ao cadastrar: " + error.message);
    return;
  }

  // Salva perfil na tabela "usuarios"
  const { error: insertError } = await supabase
    .from("usuarios")
    .insert([{ nome, apelido, idade, posicao, altura, email }]);

  if (insertError) {
    alert("Erro ao salvar perfil: " + insertError.message);
  } else {
    alert("Cadastro realizado, bem vindo hooper!");
    mostrarLogin();
  }
}

// Função de login
/** 
async function login() {
  const email = document.getElementById("login-email").value;
  const senha = document.getElementById("login-senha").value;

  const { data, error } = await supabase.auth.signInWithPassword({
    email: email,
    password: senha,
  });

  if (error) {
    alert("Erro ao entrar: " + error.message);
  } else {
    alert("Bem vindo de volta jogador!");
    // Redirecionar para próxima página (quadras)
    window.location.href = "quadras.html";
  }
}
*/
async function login() {
  const email = document.getElementById("login-email").value;
  const senha = document.getElementById("login-senha").value;

  // 1️⃣ Autentica no Supabase Auth
  const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
    email,
    password: senha,
  });

  if (loginError) {
    alert("❌ Erro ao entrar: " + loginError.message);
    return;
  }

  const user = loginData.user;
  console.log("Usuário autenticado:", user);

  // 2️⃣ Busca os dados do perfil na tabela 'usuarios'
  const { data: perfil, error: perfilError } = await supabase
    .from("usuarios")
    .select("*")
    .eq("email", email) // você pode usar também .eq("user_id", user.id)
    .single();

  if (perfilError) {
    console.error("Erro ao buscar perfil:", perfilError.message);
    alert("Erro ao carregar perfil. Contate o suporte.");
    return;
  }

  console.log("Perfil encontrado:", perfil);

  // 3️⃣ (Opcional) Armazena dados localmente
  localStorage.setItem("usuario", JSON.stringify(perfil));

  alert("✅ Login realizado com sucesso, " + perfil.apelido + "!");
  window.location.href = "quadras.html";
}

// Login com Google
async function loginComGoogle() {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
  });

  if (error) {
    alert("Erro ao entrar com Google: " + error.message);
  } else {
    // O redirecionamento será feito automaticamente
    console.log("Redirecionando para autenticação Google...");
  }
}
