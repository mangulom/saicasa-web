import { Maearchivo } from "./maearchivo";

export class Plananual {
    id: number;
    codempresa: string;
    fechaini: string;
    fechafin: string;
    usuarioreg: string;
    fechareg: string;
    estado: boolean;
    fechabaja: string;
    usuariobaja: string;
    codarchivo: string;
    isupdate: boolean;
    archivo: Maearchivo;
}
