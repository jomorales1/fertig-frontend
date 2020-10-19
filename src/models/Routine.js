import Task from "@/models/Task";
export default class Routine extends Task{
    //modelo de rutina para enviar a backend
    constructor(title,description,priority,startDate,endDate,repetitionString, level, etiqueta,estimacion,hecha,recordatorio) {
        super(title,description,priority,startDate,endDate,level, etiqueta,estimacion,hecha,recordatorio)
        this.recurrencia=repetitionString
    }

}