let produtoSelecionadoId = null;

// Alternar entre seções
function mostrarProdutos() {
  document.getElementById('produtos-container').style.display = 'block';
  document.getElementById('cadastro-usuario').style.display = 'none';
}

function mostrarCadastroUsuario() {
  document.getElementById('produtos-container').style.display = 'none';
  document.getElementById('cadastro-usuario').style.display = 'block';
}

// Alternar tema claro/escuro
function toggleTema() {
  document.body.classList.toggle('dark-theme');
}

// Logout (simples)
function logout() {
  window.location.href = 'index.html';
}

// Buscar produtos
function buscarProduto() {
  const nome = document.getElementById('busca').value;
  fetch(`http://localhost:3000/api/produtos/buscar?nome=${nome}`)
    .then(res => res.json())
    .then(produtos => exibirProdutos(produtos));
}

// Exibir lista de produtos
function exibirProdutos(produtos) {
  const lista = document.getElementById('lista-produtos');
  lista.innerHTML = '';

  produtos.forEach(produto => {
    const item = document.createElement('div');
    item.className = 'produto-card';
    item.innerHTML = `
      <strong>${produto.nome}</strong><br>
      Quantidade: ${produto.quantidade}<br>
      ${produto.descricao || ''}
    `;
    item.onclick = () => abrirModal(produto);
    lista.appendChild(item);
  });
}

// Cadastrar novo produto
function cadastrarProduto() {
  const nome = document.getElementById('nome').value;
  const quantidade = document.getElementById('quantidade').value;
  const descricao = document.getElementById('descricao').value;

  fetch('http://localhost:3000/api/produtos/cadastro', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ nome, quantidade, descricao })
  })
    .then(res => res.json())
    .then(() => {
      buscarProduto();
      document.getElementById('nome').value = '';
      document.getElementById('quantidade').value = '';
      document.getElementById('descricao').value = '';
    });
}

// Cadastrar novo usuário
function cadastrarUsuario() {
  const nome = document.getElementById('novo-nome').value;
  const email = document.getElementById('novo-email').value;
  const senha = document.getElementById('nova-senha').value;

  fetch('http://localhost:3000/api/usuarios/cadastro', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ nome, email, senha })
  })
    .then(res => res.json())
    .then(() => {
      alert('Usuário cadastrado com sucesso!');
      document.getElementById('novo-nome').value = '';
      document.getElementById('novo-email').value = '';
      document.getElementById('nova-senha').value = '';
      mostrarProdutos();
    });
}

// Abrir modal de movimentação
function abrirModal(produto) {
  produtoSelecionadoId = produto.id;
  document.getElementById('modal-produto-nome').textContent = produto.nome;
  document.getElementById('quantidade-movimentacao').value = '';
  document.getElementById('modal-movimentacao').style.display = 'block';
  document.getElementById('modal-produto-nome').textContent = produto.nome;

}

// Fechar modal
function fecharModal() {
  document.getElementById('modal-movimentacao').style.display = 'none';
}

// Adicionar quantidade usando /movimentar
function adicionarQuantidade() {
  const quantidade = parseInt(document.getElementById('quantidade-movimentacao').value);
  if (!quantidade || quantidade < 1) return;

  movimentarProduto(produtoSelecionadoId, 'adicionar');
  fecharModal();
}

// Remover quantidade usando /movimentar
function removerQuantidade() {
  const quantidade = parseInt(document.getElementById('quantidade-movimentacao').value);
  if (!quantidade || quantidade < 1) return;

  movimentarProduto(produtoSelecionadoId, 'retirar');
  fecharModal();
}

// Movimentar produto (adicionar ou retirar)
function movimentarProduto(produtoId, tipo) {
  let quantidade;

  // Tenta obter o campo do modal
  const campoModal = document.getElementById('quantidade-movimentacao');
  // Tenta obter os campos do menu flutuante
  const campoFlutuanteAdicionar = document.getElementById('quantidade-adicionar');
  const campoFlutuanteRetirar = document.getElementById('quantidade-retirar');

  if (campoModal && campoModal.offsetParent !== null) {
    quantidade = parseInt(campoModal.value);
  } else if (tipo === 'adicionar' && campoFlutuanteAdicionar) {
    quantidade = parseInt(campoFlutuanteAdicionar.value);
  } else if (tipo === 'retirar' && campoFlutuanteRetirar) {
    quantidade = parseInt(campoFlutuanteRetirar.value);
  }

  if (isNaN(quantidade) || quantidade <= 0) {
    mostrarToast('Digite uma quantidade válida.');
    return;
  }
  

  fetch('http://localhost:3000/api/produtos/movimentar', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ produtoId, quantidade, tipo })
  })
    .then(() => {
      buscarProduto();
      fecharModal();
      fecharMenuFlutuante();
    })
  
    .catch(err => {
      console.error(err);
      mostrarToast('Erro ao movimentar produto.');
    });
  }
    


// Fechar menu flutuante (se estiver usando)
function fecharMenuFlutuante() {
  document.getElementById('menu-flutuante').style.display = 'none';
}

// DELETAR PRODUTO
function deletarProduto() {
  if (!confirm('Tem certeza que deseja deletar este produto?')) return;

  fetch(`http://localhost:3000/api/produtos/${produtoSelecionadoId}`, {
    method: 'DELETE'
  })
    .then(res => res.json())
    .then(() => {
      // Animação de fade no item selecionado
      const lista = document.getElementById('lista-produtos');
      const item = [...lista.children].find(div => 
        div.querySelector('strong')?.textContent === document.getElementById('modal-produto-nome').textContent
      );

      if (item) {
        item.style.transition = 'opacity 0.5s ease';
        item.style.opacity = '0';

        setTimeout(() => {
          buscarProduto();
        }, 500);
      } else {
        buscarProduto();
      }

      fecharModal();
      mostrarToast('Produto deletado com sucesso.');
    })
    .catch(err => {
      console.error(err);
      mostrarToast('Erro ao deletar produto.');
    });
}


function mostrarToast(mensagem) {
  const toast = document.getElementById('toast');
  toast.textContent = mensagem;
  toast.className = 'toast show';

  setTimeout(() => {
    toast.className = 'toast';
  }, 3000);
}

function carregarLogs() {
  fetch('http://localhost:3000/api/logs')
    .then(response => response.json())
    .then(logs => {
      const container = document.getElementById('logs-container');
      container.innerHTML = '';

      logs.forEach(log => {
        const logItem = document.createElement('div');
        logItem.classList.add('log-item');
        logItem.innerHTML = `
          <strong>${log.usuario}</strong> ${log.acao} <strong>${log.quantidade}</strong> de <strong>${log.produto}</strong> em <em>${log.data}</em>
        `;
        container.appendChild(logItem);
      });
    })
    .catch(err => {
      console.error('Erro ao carregar logs:', err);
    });
}

function mostrarLogs() {
  document.getElementById('produtos-container').style.display = 'none';
  document.getElementById('cadastro-usuario').style.display = 'none';
  document.getElementById('logs').style.display = 'block';

  fetch('http://localhost:3000/api/logs')
    .then(response => response.json())
    .then(data => {
      const logsContainer = document.getElementById('logs-container');
      logsContainer.innerHTML = '';

      if (data.length === 0) {
        logsContainer.innerHTML = '<p>Nenhuma ação registrada.</p>';
        return;
      }

      data.forEach(log => {
        const logItem = document.createElement('div');
        logItem.className = 'log-item';
        logItem.style.marginBottom = '10px';
        logItem.innerHTML = `
          <strong>${log.usuario || 'Sistema'}:</strong> ${log.acao} <br>
          <small>${new Date(log.timestamp).toLocaleString()}</small>
        `;
        logsContainer.appendChild(logItem);
      });
    })
    .catch(error => {
      console.error('Erro ao buscar logs:', error);
      document.getElementById('logs-container').innerHTML = '<p>Erro ao carregar o histórico.</p>';
    });
}

function mostrarHistorico() {
  document.getElementById("produtos-container").style.display = "none";
  document.getElementById("cadastro-usuario").style.display = "none";
  document.getElementById("historico-container").style.display = "block";

  carregarHistorico();
}

function carregarHistorico() {
  fetch('/logs') // Ajuste aqui caso sua rota do back-end seja diferente
    .then(res => res.json())
    .then(data => {
      const lista = document.getElementById("lista-historico");
      lista.innerHTML = "";

      if (data.length === 0) {
        lista.innerHTML = "<p>Nenhuma ação registrada ainda.</p>";
        return;
      }

      data.forEach(log => {
        const item = document.createElement("div");
        item.textContent = `${log.data} - ${log.usuario} - ${log.acao}`;
        lista.appendChild(item);
      });
    })
    .catch(err => {
      console.error("Erro ao carregar histórico:", err);
    });
}


// Inicializa
window.onload = () => {
  mostrarProdutos();
  buscarProduto();
};
