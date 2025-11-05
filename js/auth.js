//const supabase = createClient(SUPABASE_URL, process.env.SUPABASE_KEY);

const SUPABASE_URL = "https://hauarormiaflwagzdggm.supabase.co";
const SUPABASE_KEY = "SUPABASE_CLIENT_API_KEY";
const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

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
    password: senha
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
    alert("Cadastro realizado com sucesso!");
    mostrarLogin();
  }
}

// Função de login
async function login() {
  const email = document.getElementById("login-email").value;
  const senha = document.getElementById("login-senha").value;

  const { data, error } = await supabase.auth.signInWithPassword({
    email: email,
    password: senha
  });

  if (error) {
    alert("Erro ao entrar: " + error.message);
  } else {
    alert("Login realizado com sucesso!");
    // Redirecionar para próxima página (quadras)
    window.location.href = "quadras.html";
  }
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
