import { Personal } from "./personal";

export class Comite {
    id: number;
    codempresa: string;
    codprogram: number;
    codempresapers: string;
    codpersonal: string;
    codcargo: number;
    nrovotos: number;
    personal: Personal;
    personales: Personal[];
}
