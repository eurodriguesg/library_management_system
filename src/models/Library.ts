import { PrismaClient } from '@prisma/client';
import { Book }         from './Book';

const prisma = new PrismaClient();

export class Library {

    // Método para retornar todos os livros do acervo ordenados por code
    public async getAllBooks(): Promise<Array<Book>> {
        try {
            const allBooks = await prisma.book.findMany({
                orderBy: {
                    code: 'asc', // Ordenação crescente (use 'desc' para ordem decrescente)
                },
            });

            if (allBooks.length > 0) {
                console.log(`[SRV-LIBRARY ✅] Livros do acervo ....: ${allBooks.length} Livros`);
                return allBooks;
            } else {
                console.log(`[SRV-LIBRARY 🔴] Acervo vazio`);
                return [];
            }
        } catch (error: any) {
            console.error(`[SRV-LIBRARY] Erro ao buscar livros: ${error.message}`);
            return [];
        }
    }

    // Método para adicionar um livro ao acervo
    public async addBook(book: Book): Promise<boolean> {
        try {
            const exists = await prisma.book.findUnique({ where: { code: book.code } });
            if (!exists) {
                
                if(!book.available){
                    book.available = true;
                }

                await prisma.book.create({ data: book });
                console.log(`[SRV-LIBRARY ✅] Livro adicionado.....: ${book.code} - ${book.title} (${book.author})`);
                return true;
            } else {
                console.log(`[SRV-LIBRARY 🔴] Livro já existe......: ${book.code} - ${book.title} (${book.author})`);
                return false;
            }
        } catch (error: any) {
            console.error(`[SRV-LIBRARY] Erro ao adicionar livro: ${error.message}`);
            return false;
        }
    }

    // Método para adicionar múltiplos livros ao acervo
    public async addBooks(books: Book[]): Promise<{ added: number; notAdded: number }> {
        let added = 0;
        let notAdded = 0;

        for (const book of books) {
            const success = await this.addBook(book);
            if (success) {
                added++;
            } else {
                notAdded++;
            }
        }

        console.log(`[SRV-LIBRARY ✅] Livros adicionados...: Novos(${added}), Não adicionados(${notAdded})`);
        return { added, notAdded };
    }

    // Método para registrar empréstimo de um livro
    public async registerLoan(code: number): Promise<string> {
        try {
            const book = await prisma.book.findUnique({ where: { code } });
            if (!book) {
                console.log(`[SRV-LIBRARY 🔴] Livro não encontrado.: ${code} `);
                return 'not_found';
            }
            if (!book.available) {
                console.log(`[SRV-LIBRARY 🔴] Livro não disponível.: ${book.code} - ${book.title} (${book.author})`);
                return 'not_available';
            }

            await prisma.book.update({ where: { code }, data: { available: false } });
            console.log(`[SRV-LIBRARY ✅] Empréstimo registrado: ${book.code} - ${book.title} (${book.author})`);
            return 'success';
        } catch (error: any) {
            console.error(`[SRV-LIBRARY] Erro ao registrar empréstimo: ${error.message}`);
            return 'error';
        }
    }

    // Método para registrar a devolução de um livro
    public async registerReturn(code: number): Promise<string> {
        try {
            const book = await prisma.book.findUnique({ where: { code } });
            if (!book) {
                console.log(`[SRV-LIBRARY 🔴] Livro não encontrado.: ${code} `);
                return 'not_found';
            }
            if (book.available) {
                console.log(`[SRV-LIBRARY 🔴] Livro já devolvido...: ${book.code} - ${book.title} (${book.author})`);
                return 'not_available';
            }

            await prisma.book.update({ where: { code }, data: { available: true } });
            console.log(`[SRV-LIBRARY ✅] Devolução registrada.: ${book.code} - ${book.title} (${book.author})`);
            return 'success';
        } catch (error: any) {
            console.error(`[SRV-LIBRARY] Erro ao registrar devolução: ${error.message}`);
            return 'error';
        }
    }

    // Método para verificar se o livro está disponível
    public async checkAvailability(code: number): Promise<boolean> {
        try {
            const book = await prisma.book.findUnique({ where: { code } });
            if (!book) {
                console.log(`[SRV-LIBRARY 🔴] Livro não encontrado.: ${code} `);
                return false;
            }

            console.log(`[SRV-LIBRARY ✅] Status do livro......: ${book.code} - ${book.title} (${book.author}) [${book.available ? 'disponível' : 'indisponível'}]`);
            return book.available;
        } catch (error: any) {
            console.error(`[SRV-LIBRARY] Erro ao verificar disponibilidade: ${error.message}`);
            return false;
        }
    }

    // Método para buscar um livro pelo código
    public async searchBook(code: number): Promise<{ book: Book | null }> {
        try {
            const book = await prisma.book.findUnique({ where: { code } });
            if (!book) {
                console.log(`[SRV-LIBRARY 🔴] Livro não encontrado.: ${code} `);
                return { book: null };
            }

            console.log(`[SRV-LIBRARY ✅] Livro encontrado.....: ${JSON.stringify(book)}`);
            return { book };
        } catch (error: any) {
            console.error(`[SRV-LIBRARY] Erro ao buscar livro: ${error.message}`);
            return { book: null };
        }
    }

    // Método para retornar todos os livros disponíveis
    public async listAvailableBooks(): Promise<Array<Book>> {
        try {
            const availableBooks = await prisma.book.findMany({ where: { available: true } });
            console.log(`[SRV-LIBRARY ✅] Livro(s) encontrados.: ${JSON.stringify(availableBooks)}`);
            return availableBooks;
        } catch (error: any) {
            console.error(`[SRV-LIBRARY] Erro ao listar livros disponíveis: ${error.message}`);
            return [];
        }
    }

    // Método para atualizar os dados de um livro
    public async updateBook(code: number, updatedData: Partial<Book>): Promise<boolean> {
        try {
            const book = await prisma.book.findUnique({ where: { code } });

            if (!book) {
                console.log(`[SRV-LIBRARY 🔴] Livro não encontrado.: ${code} `);
                return false;
            }

            await prisma.book.update({
                where: { code },
                data: updatedData,
            });

            console.log(`[SRV-LIBRARY ✅] Livro atualizado.....: ${code}`);
            return true;
        } catch (error: any) {
            console.error(`[SRV-LIBRARY] Erro ao atualizar livro: ${error.message}`);
            return false;
        }
    }

    // Método para remover um livro pelo código
    async removeBook(code: number): Promise<boolean> {

        try {
            const book = await prisma.book.findUnique({ where: { code } });
            
            if (!book) {
                console.log(`[SRV-LIBRARY 🔴] Livro não encontrado.: ${code} `);
                return false;
            }

            await prisma.book.delete({ where: { code } });
            console.log(`[SRV-LIBRARY ✅] Livro excluído.......: ${book.code} - ${book.title} (${book.author})`);
            return true;

        } catch (error: any) {
            console.error(`[SRV-LIBRARY] Erro ao remover livro: ${error.message}`);
            return false;
        }
    }
}