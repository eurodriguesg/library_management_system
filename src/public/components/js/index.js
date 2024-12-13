// Função para mostrar o modal de carregamento
function showLoading() {
  document.getElementById('loadingModal').style.display = 'flex'; // Exibe o modal com o spinner
}

// Função para esconder o modal de carregamento
function hideLoading() {
  document.getElementById('loadingModal').style.display = 'none'; // Esconde o modal
}

// Adicionando o evento de clique para o botão "Bibliotecas"
document.getElementById('library').addEventListener('click', function() {
  showLoading(); // Exibe o modal de carregamento
  setTimeout(function() {
    window.location.href = '/library'; // Redireciona após 1 segundo
  }, 500); // Atraso de 1 segundo
});
