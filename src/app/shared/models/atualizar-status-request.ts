import { StatusVaga } from "./vagas";

export interface AtualizarStatusRequest {
  candidatoId: string;
  vagaId: string;
  novoStatus: StatusVaga;
}