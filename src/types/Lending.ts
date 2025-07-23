export interface ILending {
    _id: string;
    userId: string;
    bookId: string;
    borrowedAt: Date;
    dueDate: Date;
    returnedAt?: Date;
    isReturned: boolean;
}