import {Injectable} from '@angular/core';
import * as _underscore from 'underscore';
import { Pager } from '../models/pager';

@Injectable({
    providedIn: 'root'
})
export class CustomPaginationService {

    constructor() {
    }

    getPager(totalItems: number, currentPage: number = 1, pageSize: number = 10, range: string = '') {
        // Calculando o total de paginas
        const totalPages = Math.ceil(totalItems / pageSize);

        let startPage: number;
        let endPage: number;
        if (totalPages <= 3) {
            // Se tiver menos de 3 páginas totais para mostrar tudo
            startPage = 1;
            endPage = totalPages;
        } else {
            // Se tiver mais de 3 páginas totais, calcular as páginas inicial e final
            if (currentPage <= 2) {
                startPage = 1;
                endPage = 3;
            } else if (currentPage + 1 >= totalPages) {
                startPage = totalPages - 2;
                endPage = totalPages;
            } else {
                startPage = currentPage - 1;
                endPage = currentPage + 1;
            }
        }

        // Cálculo de índices de itens iniciais e finais
        const startIndex = (currentPage - 1) * pageSize;
        const endIndex = Math.min(startIndex + pageSize - 1, totalItems - 1);

        // Criar um array de páginas para o ng-repeat no componente
        const pages = _underscore.range(startPage, endPage + 1);

        // Retornar objeto com todas as propriedades exigidas para exibição
        return {
            range,
            totalItems,
            currentPage,
            pageSize,
            totalPages,
            startPage,
            endPage,
            startIndex,
            endIndex,
            pages
        } as Pager;
    }
}
