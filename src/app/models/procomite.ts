import { Maearchivo } from "./maearchivo";

export class Procomite {
    id: number;
    codempresa: string;
    fechaini: string;
    fechafin: string;
    estado: boolean;
    usuarioreg: string;
    fechareg: string;
    codarchivo: number;
    archivo: Maearchivo;
}
