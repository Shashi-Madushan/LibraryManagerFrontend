export type Book = {
    _id: string;
    title: string;
    isbn?: string;
    author: string;
    category: string;
    available: boolean;
    totalCopies: number;
    imageUrl?: string;
    createdAt: string;
    updatedAt: string;
    __v: number;
}