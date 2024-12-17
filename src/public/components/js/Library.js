document.addEventListener('DOMContentLoaded', () => {

    const removeBookForm = document.getElementById('removeBookForm');
    const confirmationModal = document.getElementById('confirmationModal');
    const confirmDeleteButton = document.getElementById('confirmDeleteButton');
    const cancelDeleteButton = document.getElementById('cancelDeleteButton');
    const bookCodeToRemove = document.getElementById('bookCodeToRemove');

    let codeToDelete = null; // Variável para armazenar o código do livro a ser excluído

    // Manipulador para adicionar livro
    document.getElementById('addBookForm').addEventListener('submit', async (event) => {
        event.preventDefault();
        const code = document.getElementById('code').value;
        const title = document.getElementById('title').value;
        const author = document.getElementById('author').value;
        const publicationYear = document.getElementById('publicationYear').value;
        const gender = document.getElementById('gender').value;

        const response = await fetch('/api/library/addBooks', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ code, title, author, publicationYear, gender })
        });
        if (response.status === 201) {
            const book = await response.json();
            console.log('Livro adicionado:', book);
            document.getElementById('addBookForm').reset(); // Limpar campos do formulário
        } else {
            const error = await response.json();
            alert(error.message);
        }
        loadBooks();
    });

    // Manipulador para registrar empréstimo
    const isBookAvailableForm = document.getElementById('isBookAvailableForm');
    if (isBookAvailableForm) {
        isBookAvailableForm.addEventListener('submit', async (event) => {
            event.preventDefault();
            const code = document.getElementById('avaicode').value;
            const response = await fetch(`/api/library/checkAvailability/${code}`, {
                method: 'POST'
            });
            if (response.status === 200) {
                alert('Livro disponível');
                isBookAvailableForm.reset(); // Limpar campos do formulário
            } else if (response.status === 404) {
                alert('Livro não existe');
            } else if (response.status === 409) {
                alert('Livro não disponível');
            } else {
                alert('Erro desconhecido');
            }
            loadBooks();
        });
    }

    // Manipulador para registrar empréstimo
    const loanBookForm = document.getElementById('loanBookForm');
    if (loanBookForm) {
        loanBookForm.addEventListener('submit', async (event) => {
            event.preventDefault();
            const code = document.getElementById('loancode').value;
            const response = await fetch(`/api/library/bookLoan/${code}`, {
                method: 'POST'
            });
            if (response.status === 200) {
                alert('Empréstimo registrado');
                loanBookForm.reset(); // Limpar campos do formulário
            } else if (response.status === 404) {
                alert('Livro não existe');
            } else if (response.status === 409) {
                alert('Livro não disponível para empréstimo');
            } else {
                alert('Erro desconhecido');
            }
            loadBooks();
        });
    }

    // Manipulador para registrar devolução
    const returnForm = document.getElementById('returnBookForm');
    if (returnForm) {
        returnForm.addEventListener('submit', async (event) => {
            event.preventDefault();
            const code = document.getElementById('returncode').value;
            const response = await fetch(`/api/library/bookReturn/${code}`, {
                method: 'POST'
            });
            if (response.status === 200) {
                alert('Devolução registrada');
                returnForm.reset(); // Limpar campos do formulário
            } else if (response.status === 404) {
                alert('Livro não existe');
            } else if (response.status === 409) {
                alert('Livro já devolvido');
            }else {
                alert('Erro ao registrar devolução');
            }
            loadBooks();
        });
    }

    // Manipulador para remover livro
    // Manipulador para exibir o modal de confirmação
    if (removeBookForm) {
        removeBookForm.addEventListener('submit', (event) => {
            event.preventDefault();
            codeToDelete = document.getElementById('removeCode').value;
            bookCodeToRemove.textContent = codeToDelete; // Exibir o código no modal
            confirmationModal.style.display = 'flex'; // Mostrar o modal
        });
    }

    // Confirmar exclusão
    confirmDeleteButton.addEventListener('click', async () => {
        if (codeToDelete) {
            try {
                const response = await fetch(`/api/library/removeBook/${codeToDelete}`, {
                    method: 'DELETE'
                });
                if (response.status === 200) {
                    alert('Livro removido com sucesso');
                    removeBookForm.reset();
                } else if (response.status === 404) {
                    alert('Livro não encontrado');
                } else {
                    alert('Erro ao remover livro');
                }
                loadBooks(); // Atualizar a lista de livros
            } catch (error) {
                console.error('Erro ao excluir livro:', error);
            }
        }
        confirmationModal.style.display = 'none'; // Fechar o modal
        codeToDelete = null;
    });

    // Cancelar exclusão
    cancelDeleteButton.addEventListener('click', () => {
        confirmationModal.style.display = 'none'; // Fechar o modal
        codeToDelete = null;
    });

    // Fechar o modal ao clicar fora do conteúdo
    window.addEventListener('click', (event) => {
        if (event.target === confirmationModal) {
            confirmationModal.style.display = 'none';
            codeToDelete = null;
        }
    });

    // Função para carregar a lista de livros
    async function loadBooks() {
        try {
            const response = await fetch('/api/library/getAllBooks');
            // console.log('Status da resposta:', response.status);
            
            if (!response.ok) {
                throw new Error('Erro ao carregar livros');
            }
            
            const books = await response.json();
            // console.log('Livros carregados:', books);
            
            const booksList = document.getElementById('booksList');
            booksList.innerHTML = '';
            
            books.allBooks.forEach(book => {
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td>${book.code}</td>
                    <td>${book.title}</td>
                    <td>${book.author}</td>
                    <td>${book.available ? 'Disponível' : 'Indisponível'}</td>
                    <td>${book.publicationYear}</td>
                    <td>${book.gender}</td>
                    <td>
                        <button class="button" onclick="fetchBookData(${book.code})">Ver</button>
                    </td>
                `;
                booksList.appendChild(tr);
            });
        } catch (error) {
            console.error('Erro ao buscar livros:', error);
        }
    }

    // Chame a função para carregar os livros inicialmente
    loadBooks();
});

// Função para buscar os dados do livro e exibir o modal
function fetchBookData(code) {
    fetch(`/api/library/searchBook/${code}`)
        .then(response => response.json())
        .then(data => {
            if (data.book) {
                // Preenche o modal com os dados do livro
                document.getElementById('modalCode').textContent = data.book.code;
                document.getElementById('modalTitle').textContent = data.book.title;
                document.getElementById('modalAuthor').textContent = data.book.author;
                document.getElementById('modalPublicationYear').textContent = data.book.publicationYear;
                document.getElementById('modalGender').textContent = data.book.gender;

                // Exibe o modal
                document.getElementById('employeeModal').style.display = 'flex';
            } else {
                alert('Livro não encontrado!');
            }
        })
        .catch(error => {
            console.error('Erro ao buscar livro:', error);
            alert('Erro ao buscar livro!');
        });
}

// Função para fechar o modal
function closeModal() {
    document.getElementById('libraryModal').style.display = 'none';
}

function updateBook() {
    const code = document.getElementById('modalCode').textContent;
    const newTitle = document.getElementById('modalTitle').textContent;
    const newAuthor = document.getElementById('modalAuthor').textContent;
    const newPublicationYear = document.getElementById('modalPublicationYear').value;
    const newGender = document.getElementById('modalGender').value;

    if (!code || !newTitle || !newAuthor || !newPublicationYear || !newGender) {
        alert('Por favor, preencha todos os campos');
        return;
    }

    fetch('/api/library/updateBook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, title: newTitle, author: newAuthor, publicationYear: newPublicationYear, gender: newGender })
    })
        .then(response => response.json().then(data => ({ status: response.status, body: data })))
        .then(({ status, body }) => {
            if (status === 200) {
                alert(body.message);

                // Atualizar os dados no modal imediatamente
                document.getElementById('modalCode').textContent = `${code}`;
                document.getElementById('modalTitle').textContent = `${newTitle}`;
                document.getElementById('modalAuthor').textContent = `${newAuthor}`;
                document.getElementById('modalPublicationYear').textContent = `${newPublicationYear}`;
                document.getElementById('modalGender').textContent = `${newGender}`;

                // Atualizar os dados na tabela imediatamente
                updateTableBook(code, newTitle, newAuthor, newPublicationYear, newGender);

                // Limpar os campos do modal
                document.getElementById('newCode').value = '';
                document.getElementById('newTitle').value = '';
                document.getElementById('newAuthor').value = '';
                document.getElementById('newPublicationYear').value = '';
                document.getElementById('newGender').value = '';

                // Fechar o modal após atualizar
                closeModal();
            } else {
                alert(body.message || 'Erro ao atualizar o livro!');
            }
        })
        .catch(error => console.error('Erro ao atualizar livro:', error));
}

// Função para atualizar os dados na tabela
function updateTableBook(code, newTitle, newAuthor, newPublicationYear, newGender) {
    const tableRows = document.querySelectorAll('#libraryTable tbody tr');

    tableRows.forEach(row => {
        const regCell = row.cells[0].textContent; // Pega o código da primeira coluna
        if (regCell === code) {
            row.cells[0].textContent = code; // Atualiza o código na tabela
            row.cells[1].textContent = newTitle; // Atualiza o título na tabela
            row.cells[2].textContent = newAuthor; // Atualiza o autor na tabela
            row.cells[3].textContent = newPublicationYear; // Atualiza o ano de publicação na tabela
            row.cells[4].textContent = newGender; // Atualiza o gênero na tabela
        }
    });
}