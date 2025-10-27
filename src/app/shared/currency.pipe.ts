// currency-br.pipe.ts
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'currency'
})
export class CurrencyPipe implements PipeTransform {
  transform(value: number | string | null | undefined): string {
    if (value === null || value === undefined) {
      return 'N/A'; // Ou 'R$ --' ou qualquer valor padrão
    }

    const numValue = typeof value === 'string' ? parseFloat(value) : value;

    if (isNaN(numValue)) {
        return 'R$ --'; // Retorna um padrão se não for um número válido
    }

    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 0, // Não mostra centavos
      maximumFractionDigits: 0
    }).format(numValue);
  }
}