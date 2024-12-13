export class Book {
    code: number;
    title: string;
    author: string;
    available: boolean;
    publicationYear: number;
    gender: string;

    constructor(code: number, title: string, author: string, available: boolean, publicationYear: number, gender: string) {
        this.code            = code;
        this.title           = title;
        this.author          = author;
        this.available       = available;
        this.publicationYear = publicationYear;
        this.gender          = gender;
    }
}