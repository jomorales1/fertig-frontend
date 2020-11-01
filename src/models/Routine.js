import TEvent from "@/models/TEvent";
export default class Routine extends TEvent{
    //modelo de rutina para enviar a backend
    constructor(id,title,description,priority,startDate,endDate,repetitionString, etiqueta,recordatorio,completada, franjainicio, franjafinal) {
        super(id,title,description,priority,startDate,endDate,repetitionString,etiqueta,recordatorio)
        this.completada=completada
        this.franjainicio = franjainicio;
        this.franjafinal = franjafinal;
    }

}