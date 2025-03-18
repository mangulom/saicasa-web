import { Area } from "./area";
import { Personal } from "./personal";
import { Provacunacion } from "./provacunacion";

export class Vacunacion {
    id: number;
    codigo: string;
    codempresa: string;
    sede: string;
    codprogram: number;
    codempresapers: string;
    codpersonal: string;
    codempresarespuno: string;
    codrespuno: string;
    codempresarespdos: string;
    codrespdos:string;
    codtipovacuna: number;
    fechavacuna: string;
    lotevacuna: string;
    codvacunador: number;
    codestado: boolean;
    flatcartilla: boolean;
    observacion: string;
    codempresaarea: string;
    numverareas: string;
    codareas: string;
    codzona: number;
    horario: string;
    personal: Personal;
    personales: Personal[];
    area: Area;
    programa: Provacunacion;
    isupdate: boolean;
}
