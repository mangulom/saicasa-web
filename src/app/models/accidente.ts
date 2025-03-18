import { Personal } from "./personal";

export class Accidente {

    id: number;
    codigo: string;
    codempresa: string;
    sede: string;
    codempresapers: string;
    codpersonal: string;
    mes: number;
    fechaacci: string;
    horaacci: string;
    fechareg: string;
    horareg: string;
    fechainiturn: string;
    horainiturn: string;
    lugaracci: string;
    nrohrstrab: number;
    actividadacci: string;
    graveacc: number;
    tipoacci: number;
    nrotrabafec: number;
    fechainidm: string;
    fechafindm: string;
    diasdm: number;
    diagnacci: string;
    descacci: string;
    partcuerples: number;
    tipoless: number;
    agentecaus: number;
    cie: number;
    hc: string;
    estado: boolean;
    countplanilla: number;

    personal: Personal;
    personales: Personal[];
}
