export interface ILending {
    _id: string;
    userId: {
        _id: string;
        email: string;
    };
    bookId: {
        _id: string;
        title: string;
        author: string;
    };
    borrowedAt: string;
    dueDate: string;
    returnedAt: string | null;
    isReturned: boolean;
    createdAt: string;
    updatedAt: string;
    __v: number;
}