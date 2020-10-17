export default class Routine {
    //modelo de tarea para enviar a backend
    constructor(title,description,priority,startDate,endDate,repetitionString, level, etiqueta,estimacion,hecha,recordatorio) {
        this.nombre=title
        this.descripcion=description
        this.prioridad=priority
        this.fechaInicio=startDate
        this.fechaFin=endDate
        this.StringRepeticion=repetitionString
        this.level=level
        this.estimacion=estimacion
        this.hecha=hecha
        this.recordatorio=recordatorio
        this.etiqueta=etiqueta
    }

}