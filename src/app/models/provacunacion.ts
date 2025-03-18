import { Personal } from "./personal";

export class Provacunacion {
    id: number;
    codempresa: string;
    sede: string;
    fechaprogram: string;
    codtipovacuna: string;
    codestado: string;
    codempresarespuno: string;
    codrespuno: string;
    codempresarespdos: string;
    codrespdos: string;
    fechacreate: string;
    reponsableuno: Personal;
    reponsabledos: Personal;
    vacunados: number;
    pendientes: number;
    programados: number;
    lote: string;
}
