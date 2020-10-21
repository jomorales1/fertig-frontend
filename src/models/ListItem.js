export default class ListItem{
    constructor(id,title,description,priority,startDate,endDate, etiqueta,estimacion,recordatorio) {
        this.id=id
        this.nombre=title
        this.descripcion=description
        this.prioridad=priority
        this.fechaInicio=startDate
        this.fechaFin=endDate
        this.estimacion=estimacion
        this.recordatorio=recordatorio
        this.etiqueta=etiqueta
    }
}