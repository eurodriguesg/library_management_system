import { Request, Response } from 'express';
import { Library } from '../models/Library';
import { Book } from '../models/Book';

const library = new Library();

export const LibraryController = {
    
    // LISTAR LIVROS DO ACERVO
    getAllBooks: async (req: Request, res: Response): Promise<void> => {
        try {
            const allBooks = await library.getAllBooks();
            if (allBooks.length > 0) {
                res.status(200).json({ message: 'Livros do Acervo:', allBooks });
            } else {
                res.status(409).json({ message: 'Acervo vazio' });
            }
        } catch (error: any) {
            res.status(500).json({ message: 'Erro interno do servidor', error: error.message });
        }
    },

    // ADICIONAR LIVROS
    addBooks: async (req: Request, res: Response): Promise<void> => {
        // console.log("[SRV 🟡] Recebido pedido de cadastro de livro:", req.body);
        
        try {
            const isArray = Array.isArray(req.body);
            
            if (isArray) {
                const books = req.body;
                
                const isValid = books.every(
                    (book: any) => book.code && book.title && book.author && book.publicationYear && book.gender !== undefined
                );
                // console.log("[SRV 🟡] Validando livro:", isValid);
                
                if (!isValid) {
                    res.status(400).json({ message: 'Todos os livros devem ter code, title, author, publicationYear, gender' });
                    return;
                }

                const bookInstances = books.map(
                    (book: any) => new Book(
                        Number(book.code),
                        book.title,
                        book.author,
                        Boolean(book.available),
                        Number(book.publicationYear),
                        book.gender
                    )
                );

                const result = await library.addBooks(bookInstances);

                res.status(200).json({
                    message: 'Livros adicionados com sucesso',
                    added: result.added,
                    notAdded: result.notAdded
                });
                return;
            } else {
                const { code, title, author, available, publicationYear, gender } = req.body;

                if (!code || !title || !author || !publicationYear || gender === undefined) {
                    res.status(400).json({
                        message: 'Todos os campos obrigatórios devem ser preenchidos: code, title, author, publicationYear, gender',
                    });
                    return;
                }

                const book = new Book(
                    Number(code),
                    title,
                    author,
                    Boolean(available),
                    Number(publicationYear),
                    gender
                );

                const added = await library.addBook(book);

                if (added) {
                    res.status(201).json({ message: 'Livro adicionado com sucesso', book: `${book.code} - ${book.title} (${book.author})` });
                } else {
                    res.status(409).json({ message: 'Livro já existe', book: `${book.code} - ${book.title} (${book.author})` });
                }
                return;
            }
        } catch (error: any) {
            console.error(`[SRV-LIBRARY] Erro ao adicionar livro(s): ${error.message}`);
            res.status(500).json({ message: 'Erro interno do servidor' });
        }
    },

    // REGISTRAR EMPRÉSTIMO DE LIVRO
    registerLoan: async (req: Request, res: Response): Promise<void> => {
        const code = parseInt(req.params.code);

        if (isNaN(code)) {
            res.status(400).json({ message: 'Código inválido' });
            return;
        }

        try {
            const result = await library.registerLoan(code);

            if (result === 'not_found') {
                res.status(404).json({ message: 'Livro não encontrado', code });
            } else if (result === 'not_available') {
                res.status(409).json({ message: 'Livro não disponível', code });
            } else {
                res.status(200).json({ message: 'Empréstimo registrado', code });
            }
        } catch (error: any) {
            res.status(500).json({ message: 'Erro desconhecido', error: error.message });
        }
    },

    // REGISTRAR DEVOLUÇÃO DE LIVROS
    registerReturn: async (req: Request, res: Response): Promise<void> => {
        const code = parseInt(req.params.code);

        if (isNaN(code)) {
            res.status(400).json({ message: 'Código inválido.' });
            return;
        }

        try {
            const result = await library.registerReturn(code);

            if (result === 'not_found') {
                res.status(404).json({ message: 'Livro não encontrado', code });
            } else if (result === 'not_available') {
                res.status(409).json({ message: 'Livro já devolvido', code });
            } else {
                res.status(200).json({ message: 'Devolução registrada', code });
            }
        } catch (error: any) {
            res.status(500).json({ message: 'Erro desconhecido', error: error.message });
        }
    },

    // CONSULTAR DISPONIBILIDADE DE LIVRO
    checkAvailability: async (req: Request, res: Response): Promise<void> => {
        const code = parseInt(req.params.code);

        if (isNaN(code)) {
            res.status(400).json({ message: 'Código inválido.' });
            return;
        }

        try {
            const available = await library.checkAvailability(code);

            if (available) {
                res.status(200).json({ message: 'Livro disponível', code });
            } else {
                res.status(409).json({ message: 'Livro não disponível', code });
            }
        } catch (error: any) {
            res.status(500).json({ message: 'Erro desconhecido', error: error.message });
        }
    },

    // BUSCAR DADOS DO LIVRO
    searchBook: async (req: Request, res: Response): Promise<void> => {
        const code = parseInt(req.params.code);

        if (isNaN(code)) {
            res.status(400).json({ message: 'Código inválido.' });
            return;
        }

        try {
            const { book } = await library.searchBook(code);

            if (book) {
                res.status(200).json({ message: 'Livro encontrado.', book });
            } else {
                res.status(404).json({ message: 'Livro não encontrado.' });
            }
        } catch (error: any) {
            res.status(500).json({ message: 'Erro desconhecido', error: error.message });
        }
    },

    // LISTAR LIVROS DISPONÍVEIS DO ACERVO
    listAvailableBooks: async (_req: Request, res: Response): Promise<void> => {
        try {
            const availableBooks = await library.listAvailableBooks();

            if (availableBooks.length > 0) {
                res.status(200).json({ message: 'Livro(s) encontrado(s).', books: availableBooks });
            } else {
                res.status(409).json({ message: 'Livro(s) não encontrados.' });
            }
        } catch (error: any) {
            res.status(500).json({ message: 'Erro desconhecido', error: error.message });
        }
    },

    // ATUALIZAR DADOS DO LIVRO
    updateBook: async (req: Request, res: Response): Promise<void> => {
        const code = parseInt(req.params.code);

        if (isNaN(code)) {
            res.status(400).json({ message: 'Código inválido.' });
            return;
        }

        const { title, author, available, publicationYear, gender } = req.body;

        const updatedData: Partial<Book> = {};
        if (title !== undefined) updatedData.title = title;
        if (author !== undefined) updatedData.author = author;
        if (available !== undefined) updatedData.available = available;
        if (publicationYear !== undefined) updatedData.publicationYear = publicationYear;
        if (gender !== undefined) updatedData.gender = gender;

        try {
            const updated = await library.updateBook(code, updatedData);

            if (updated) {
                res.status(200).json({ message: 'Livro atualizado com sucesso.', code });
            } else {
                res.status(404).json({ message: 'Livro não encontrado.', code });
            }
        } catch (error: any) {
            res.status(500).json({ message: 'Erro interno do servidor.', error: error.message });
        }
    },

    // REMOVER LIVRO DO ACERVO
    removeBook: async (req: Request, res: Response): Promise<void> => {
        const code = parseInt(req.params.code);

        if (isNaN(code)) {
            res.status(400).json({ message: 'Código inválido.' });
            return;
        }

        try {
            const removed = await library.removeBook(code);

            if (removed) {
                res.status(200).json({ message: 'Livro excluído com sucesso.', code });
            } else {
                res.status(404).json({ message: 'Livro não encontrado.', code });
            }
        } catch (error: any) {
            res.status(500).json({ message: 'Erro interno do servidor.', error: error.message });
        }
    },
};