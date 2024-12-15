
# Sistema de Gestão de Biblioteca

### Requisitos Técnicos
- Desenvolvido em TypeScript.
- Utiliza Prisma para ORM (Object-Relational Mapping).
- Banco de dados utilizado: PostgreSQL.
- Inclui conceitos de classes, encapsulamento e tipagem estática.
- Inclui tratamento de erros, como consultas e valores inexistentes.

### Tecnologias Utilizadas
- **TypeScript**: Linguagem para o desenvolvimento do backend.
- **Node.js**: Ambiente de execução JavaScript no servidor.
- **PostgreSQL**: Banco de dados relacional utilizado para armazenar as informações da biblioteca.
- **Prisma**: ORM utilizado para comunicação com o banco de dados PostgreSQL.

## Como Executar o Projeto

### Pré-requisitos
1. **Node.js** instalado em sua máquina.
2. **TypeScript** configurado (instale com `npm install -g typescript`).
3. **PostgreSQL** instalado e configurado localmente ou em um servidor remoto.
4. **Prisma** instalado para manipulação do banco de dados.

### Passo a Passo

1. Clone este repositório:
   ```bash
   git clone https://github.com/eurodriguesg/library_management_system.git
   cd library_management_system
   ```

2. Instale as dependências:
   ```bash
   npm install
   ```

3. Configure o banco de dados no arquivo `.env`:
   - Altere a variável `DATABASE_URL` com as informações do seu banco PostgreSQL. Exemplo:
     ```env
     DATABASE_URL="postgresql://user:password@localhost:5432/biblioteca?schema=public"
     ```

4. Gere o banco de dados e as tabelas com o Prisma:
   ```bash
   npx prisma migrate dev --name init
   ```

5. Execute o servidor:
   ```bash
   npm run dev
   ```

O servidor estará disponível na URL configurada, por padrão, no `http://localhost:31063` ou na próxima porta disponível que o servidor encontrar.

---

### Descrição do Projeto
Este módulo é um sistema de gerenciamento de livros desenvolvido em TypeScript com PostgreSQL. Ele foi criado para atender as seguintes necessidades de uma biblioteca pública:

- **Consulta todos os livros do acervo.**
- **Retorna todos os livros disponíveis.**
- **Adicionar novo(s) livro(s) ao acervo.**
- **Registrar empréstimos de livros para os usuários.**
- **Registrar devolução de livros para os usuários.**
- **Consultar a disponibilidade de um livro específico.**
- **Atualizar um livro específico.**
- **Excluir um livro específico.**

O projeto simula um cenário real de gerenciamento de biblioteca, utilizando conceitos de orientação a objetos, encapsulamento e tipagem estática.

---

### Funcionalidades Principais
O sistema possui as seguintes funcionalidades:

- Consulta todos os livros do acervo.
- Retorna todos os livros disponíveis.
- Adiciona livros ao acervo.
- Registra e controla empréstimos e devoluções de livros.
- Atualiza os dados de um livros do acervo.
- Exclui livros do acervo.

---

### Estrutura do Projeto

#### Classe `Book`
Representa um livro no acervo da biblioteca. Possui as seguintes propriedades:

- `code` (number): Identificador único do livro.
- `title` (string): Título do livro.
- `author` (string): Autor do livro.
- `available` (boolean): Indica se o livro está disponível para empréstimo.
- `publicationYear` (number): Ano de publicação do livro.
- `gender` (string): Gênero do livro.

#### Classe `Library`
Gerencia os livros do acervo e oferece os seguintes métodos:

- **`getAllBooks(): Array<Book>`**  
  Consulta todos os livros do acervo.

- **`addBook(book: Book): boolean`**  
  Adiciona um novo livro ao acervo.

- **`addBooks(books: Book[]): { added: number; duplicates: number }`**  
  Adiciona múltiplos livros ao acervo.

- **`registerLoan(code: number): string`**  
  Marca o livro especificado como indisponível.

- **`registerReturn(code: number): string`**  
  Marca o livro especificado como disponível.

- **`checkAvailability(code: number): boolean`**  
  Retorna true se o livro estiver disponível, ou false caso contrário.

- **`listAvailableBooks(): Array<Book>`**  
  Retorna todos os livros disponíveis.

- **`searchBook(code: number): Book | null`**  
  Busca um livro e retorna o livro se ele existir.

- **`updateBook(code: number): boolean`**  
  Atualiza o livro do acervo.

- **`removeBook(code: number): boolean`**  
  Exclui o livro do acervo.

---

### Testando o Sistema
O projeto inclui uma API para testar o sistema:

### **Rotas**

##### **1. Listar acervo**
- **URL:** `/api/library/getAllBooks`  
- **Método:** `GET`  
- **Resposta de sucesso (200):**  
  ```json
    {
    "message": "Livros do Acervo:",
    "allBooks": [
            {
                "code": "1001",
                "title": "O PRÍNCIPE",
                "author": "NICOLAU MAQUIAVEL",
                "available": true,
                "publicationYear": 1532,
                "gender": "POLÍTICA"
            }
        ]
    }

##### **2. Listar livros disponíveis**
- **URL:** `/api/library/listAvailableBooks`  
- **Método:** `GET`  
- **Resposta de sucesso (200):**  
  ```json
    {
    "message": "Livro(s) encontrado(s).",
    "books": [
            {
                "code": "1001",
                "title": "O PRÍNCIPE",
                "author": "NICOLAU MAQUIAVEL",
                "available": true,
                "publicationYear": 1532,
                "gender": "POLÍTICA"
            }
        ]
    }

##### **3. Adicionar livro(s)**
- **URL:** `/api/library/addBooks`  
- **Método:** `POST`  
- **Headers:**  
  ```
  Content-Type: application/json
  ```
- **Body:**  
  ```json
    {
        "code": "1001",
        "title": "O Príncipe",
        "author": "NICOLAU MAQUIAVEL",
        "available": true,
        "publicationYear": 1532,
        "gender": "POLÍTICA"
    }
  ```
- **Resposta de sucesso (200):**  
  ```json
    {
        "message": "Livro adicionado com sucesso",
        "book": "1001 - O Príncipe (NICOLAU MAQUIAVEL)"
    }
  ```
- **Resposta de conflito (409):**  
  ```json
    {
        "message": "Livro já existe",
        "book": "1001 - O Príncipe (NICOLAU MAQUIAVEL)"
    }
- **Resposta de BadRequest (400):**  
  ```json
    {
        "message": "Todos os campos obrigatórios devem ser preenchidos: code, title, author, publicationYear, gender"
    }

##### **4. Empréstimo de livro**
- **URL:** `/api/library/bookLoan/:code`  
- **Método:** `POST`  

- **Resposta de sucesso (200):**  
  ```json
    {
        "message": "Empréstimo registrado",
        "code": 1001
    }
  ```
- **Resposta de conflito (409):**  
  ```json
   {
      "message": "Livro não disponível",
      "code": 1001
   }
- **Resposta de erro (404):**  
  ```json
   {
      "message": "Livro não encontrado",
      "code": 1020
   }

##### **5. Devolução de livro**
- **URL:** `/api/library/bookReturn/:code`  
- **Método:** `POST`  

- **Resposta de sucesso (200):**  
  ```json
   {
      "message": "Devolução registrada",
      "code": 1001
   }
  ```
- **Resposta de conflito (409):**  
  ```json
   {
      "message": "Livro não disponível",
      "code": 1001
   }
- **Resposta de erro (404):**  
  ```json
   {
      "message": "Livro não encontrado",
      "code": 1020
   }

##### **6. Consultar Disponibilidade de livro**
- **URL:** `/api/library/checkAvailability/:code`  
- **Método:** `POST`  

- **Resposta de sucesso (200):**  
  ```json
   {
      "message": "Livro disponível",
      "code": 1001
   }
  ```
- **Resposta de conflito (409):**  
  ```json
   {
      "message": "Livro não disponível",
      "code": 1001
   }
- **Resposta de erro (404):**  
  ```json
   {
      "message": "Livro não encontrado",
      "code": 1020
   }

##### **7. Buscar livro**
- **URL:** `/api/library/searchBook/:code`  
- **Método:** `POST`  

- **Resposta de sucesso (200):**  
  ```json
   {
   "message": "Livro encontrado.",
   "book": {
        "code": "1001",
        "title": "O PRÍNCIPE",
        "author": "NICOLAU MAQUIAVEL",
        "available": true,
        "publicationYear": 1532,
        "gender": "POLÍTICA"
    }
   }
  ```
- **Resposta de erro (404):**  
  ```json
   {
      "message": "Livro não encontrado",
      "code": 1020
   }

##### **8. Atualizar livro**
- **URL:** `/api/library/updateBook`  
- **Método:** `PUT`  
- **Headers:**  
  ```
  Content-Type: application/json
  ```
- **Body:**  
  ```json
    {
        "code": "1001",
        "title": "O Príncipe",
        "author": "NICOLAU MAQUIAVEL",
        "available": true,
        "publicationYear": 1532,
        "gender": "NÃO FICÇÃO"
    }
  ```
- **Resposta de sucesso (200):**  
  ```json
    {
        "message": "Livro atualizado com sucesso",
        "book": 1001
    }
  ```
- **Resposta de erro (404):**  
  ```json
    {
        "message": "Livro não encontrado",
        "code": 1020
    }
- **Resposta de BadRequest (400):**  
  ```json
    {
        "message": "Todos os campos obrigatórios devem ser preenchidos: title, author, publicationYear, gender"
    }

##### **9. Excluir livro**
- **URL:** `/api/library/removeBook/:code`  
- **Método:** `DELETE`  

- **Resposta de sucesso (200):**  
  ```json
    {
        "message": "Livro excluído com sucesso.",
        "code": 1001
    }
  ```
- **Resposta de erro (404):**  
  ```json
   {
      "message": "Livro não encontrado",
      "code": 1001
   }


---

A API pode ser consumida via POSTMAN ou similares.

---
### **Erros Comuns**
- **400 Bad Request:** Dados inválidos na requisição.  
- **404 Not Found:** Recurso não encontrado.  
- **409 Conflict:** Recurso não disponível.  
- **500 Internal Server Error:** Erro interno da aplicação.  

### Contato
Caso tenha dúvidas ou sugestões, entre em contato:

- **Nome:** Eliseu Rodrigues Guimarães
- **Email:** eliseu.rguimaraes@gmail.com
- **GitHub:** https://github.com/eurodriguesg

## Licença

Este projeto está licenciado sob a MIT License. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.