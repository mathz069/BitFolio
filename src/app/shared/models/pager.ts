export class Pager {
    totalItems: number;
    startPage: number;
    startIndex: number;
    pages: any;
    endIndex: number;
    totalPages: number;
    pageSize: number;
    endPage: number;
    currentPage: number;
    take: number;
    range: string;
}

export class Paginacao {
    currentPage: number = 1;
    take: number = 5;
}