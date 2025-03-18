import { Personal } from "./personal";

export class Medidacorrectiva {
    id: number;
    codigo: string;
    codacci: number;
    codempresapers: string;
    codpersonal: string;
    descmedida: string;
    fechareg: string;
    fechalim: string;
    estado: number;
    estadolev: number;
    personal: Personal;
    showCargaFile: boolean;
}
