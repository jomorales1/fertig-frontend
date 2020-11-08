export default class ListItem{
    constructor(id,title,description,priority,endDate, etiqueta,recordatorio) {
        this.id=id
        this.nombre=title
        this.descripcion=description
        this.prioridad=priority
        this.fechaFin=endDate
        this.recordatorio=recordatorio
        this.etiqueta=etiqueta
    }
}