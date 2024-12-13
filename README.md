# Sistema de Gestão

### Requisitos Técnicos
- Desenvolvido em TypeScript.
- Utiliza conceitos de classes, encapsulamento e tipagem estática.
- Inclui tratamento de erros, como consultas e valores inexistentes.


## Como Executar o Projeto

### Pré-requisitos
- Node.js instalado em sua máquina.
- TypeScript configurado (instale com `npm install -g typescript`).

### Passo a Passo

1. Clone este repositório:
   ```bash
   git clone https://github.com/eurodriguesg/library_management_system.git
   cd sistema_gestao
    ```

2. Instale as dependências:
    ```bash
   npm install
    ```

3. Compile o código TypeScript:
    ```bash
   tsc
    ```

3. Execute o programa:
    ```bash
   npm run dev ou npm start
    ```

---

## Módulo: Biblioteca

### Descrição do Projeto
Este módulo é um sistema de gerenciamento de livros desenvolvido em TypeScript. Ele foi criado para atender as seguintes necessidades de uma biblioteca pública:

- **Consulta todos os livros do acervo**.
- **Retorna todos os livros disponíveis.**.
- **Adicionar novo(s) livro(s) ao acervo**.
- **Registrar empréstimos de livros para os usuários**.
- **Registrar devolução de livros para os usuários**.
- **Consultar a disponibilidade de um livro específico**.
- **Excluir um livro específico**.

O projeto simula um cenário real de gerenciamento de biblioteca, utilizando conceitos de orientação a objetos, encapsulamento e tipagem estática.

---

### Funcionalidades Principais
O sistema possui as seguintes funcionalidades previstas na descrição.

---

### Estrutura do Projeto

### Classe `Book`
Representa um livro no acervo da biblioteca. Possui as seguintes propriedades:

- `code` (number): Identificador único do livro.
- `title` (string): Título do livro.
- `author` (string): Autor do livro.
- `available` (boolean): Indica se o livro está disponível para empréstimo.
- `publicationYear` (gender): Ano de publicação do livro.
- `gender` (string): Gênero do livro.

Além disso, inclui um construtor para inicializar todas as propriedades.

### Classe `Library`
Gerencia os livros do acervo e oferece os seguintes métodos:

- **`getAllBooks(): Array<Book>`**  
  Consulta todos os livros do acervo.

- **`addBook(book: Book): boolean`**  
  Adiciona um novo livro ao acervo.
  
- **`addBooks(books: Book[]): { added: number; duplicates: number }`**  
  Adicionar múltiplos livros ao acervo.

- **`registerLoan(code: number): string`**
  Marca o livro especificado como indisponível.

- **`registerReturn(code: number): string`**
  Marca o livro especificado como disponível.

- **`checkAvailability(code: number): boolean`**  
  Retorna `true` se o livro estiver disponível, ou `false` caso contrário.
  
- **`listAvailableBooks(): Array<Book>`**  
  Retorna todos os livros disponíveis.
  
- **`searchBook(): void`**  
  Busca um livro e retorna o livro se ele existir.

- **`removeBook(code: number): boolean`**
  Excluí o livro do acervo.

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
         "code": 1001,
         "title": "O Príncipe",
         "author": "NICOLAU MAQUIAVEL",
         "available": true
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
      "author": "NICOLAU MAQUIAVEL"
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
      "message": "Todos os campos obrigatórios devem ser preenchidos: code, title, author"
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
      "code": 1001,
      "title": "O Príncipe",
      "author": "NICOLAU MAQUIAVEL",
      "available": true
   }
   }
  ```
- **Resposta de erro (404):**  
  ```json
   {
      "message": "Livro não encontrado",
      "code": 1020
   }

---