import TEvent from "@/models/TEvent";
export default class Routine extends TEvent{
    //modelo de rutina para enviar a backend
    constructor(id,title,description,priority,startDate,endDate,duration,repetitionString, etiqueta,recordatorio,completada,franjaFin,franjaInicio) {
        super(id,title,description,priority,startDate,endDate,duration,repetitionString,etiqueta,recordatorio,franjaFin,franjaInicio)
        this.completada=completada
    }

}