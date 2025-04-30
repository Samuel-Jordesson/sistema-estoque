async function login() {
  const email = document.getElementById('email').value;
  const senha = document.getElementById('senha').value;
  const erroMsg = document.getElementById('erro');

  if (!email || !senha) {
    erroMsg.textContent = 'Preencha todos os campos.';
    return;
  }

  try {
    const response = await fetch('http://localhost:3000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, senha })
    });

    const data = await response.json();

    if (!response.ok) {
      erroMsg.textContent = data.erro || 'Erro ao fazer login.';
      return;
    }

    localStorage.setItem('usuario', JSON.stringify(data.usuario));
    window.location.href = 'dashboard.html';
  } catch (error) {
    erroMsg.textContent = 'Erro de conexão com o servidor.';
  }
}

function mostrarCadastro() {
  document.getElementById('login-form').style.display = 'none';
  document.getElementById('cadastro-form').style.display = 'block';
}

function mostrarLogin() {
  document.getElementById('login-form').style.display = 'block';
  document.getElementById('cadastro-form').style.display = 'none';
}

async function cadastrarUsuario() {
  const nome = document.getElementById('novo-nome').value;
  const email = document.getElementById('novo-email').value;
  const senha = document.getElementById('nova-senha').value;
  const erro = document.getElementById('cadastro-erro');
  const sucesso = document.getElementById('cadastro-sucesso');

  erro.textContent = '';
  sucesso.textContent = '';

  if (!nome || !email || !senha) {
    erro.textContent = 'Preencha todos os campos.';
    return;
  }

  try {
    const response = await fetch('http://localhost:3000/api/usuarios/cadastro', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nome, email, senha })
    });

    const data = await response.json();

    if (!response.ok) {
      erro.textContent = data.erro || 'Erro ao cadastrar.';
    } else {
      sucesso.textContent = 'Usuário cadastrado com sucesso!';
    }
  } catch (error) {
    erro.textContent = 'Erro de conexão com o servidor.';
  }
}
