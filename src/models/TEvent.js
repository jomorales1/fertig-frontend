
import ListItem from "@/models/ListItem";
export default class TEvent extends ListItem{
    //modelo de evento para enviar y recibir a backend
    constructor(id,title,description,priority,startDate,endDate,duration,repetitionString, etiqueta,recordatorio, franjaFin,franjaInicio,fecha,mensajeRecurrencia) {
        super(id,title,description,priority,endDate,etiqueta,recordatorio)
        this.recurrencia=repetitionString
        this.fechaInicio=startDate
        this.duracion=duration
        this.fecha=fecha
        this.franjaInicio=franjaInicio
        this.franjaFin=franjaFin
        this.mensajeRecurrencia=mensajeRecurrencia
    }

}