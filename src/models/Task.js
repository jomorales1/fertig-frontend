export default class Task {
       //modelo de tarea para enviar a backend
        constructor(title,description,priority,startDate,endDate,level, etiqueta,estimacion,hecha,recordatorio) {
            this.nombre=title
            this.descripcion=description
            this.prioridad=priority
            this.fechaInicio=startDate
            this.fechaFin=endDate
            this.level=level
            this.estimacion=estimacion
            this.hecha=hecha
            this.recordatorio=recordatorio
            this.etiqueta=etiqueta
        }

}