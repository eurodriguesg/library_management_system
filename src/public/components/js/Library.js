document.addEventListener('DOMContentLoaded', () => {
    // Manipulador para adicionar livro
    document.getElementById('addBookForm').addEventListener('submit', async (event) => {
        event.preventDefault();
        const code = document.getElementById('code').value;
        const title = document.getElementById('title').value;
        const author = document.getElementById('author').value;
        const available = document.getElementById('available').checked;
        const publicationYear = document.getElementById('avaipublicationYearlable').checked;
        const gender = document.getElementById('gender').checked;
        
        const response = await fetch('/api/library/addBooks', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ code, title, author, available, publicationYear, gender })
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