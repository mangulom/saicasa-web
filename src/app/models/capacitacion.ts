import { Personal } from "./personal";
import { Procapacitacion } from "./procapacitacion";

export class Capacitacion {
    id: number;
    codigo: string;
    codempresa: string;
    sede: string;
    codprogram: number;
    codempresapers: string;
    codpersonal: string;
    fechacapacitacion: string;
    nroord: number;
    codnota: number;
    observacion: string;
    personal: Personal;
    personales: Personal[];
    programa: Procapacitacion;
}
