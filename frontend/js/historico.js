document.addEventListener('DOMContentLoaded', () => {
    const tabela = document.querySelector('#tabela-historico tbody');
  
    // Exemplo de dados simulados
    const historico = JSON.parse(localStorage.getItem('historico')) || [];
  
    historico.forEach(acao => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${acao.data}</td>
        <td>${acao.usuario}</td>
        <td>${acao.descricao}</td>
      `;
      tabela.appendChild(tr);
    });
  });
  