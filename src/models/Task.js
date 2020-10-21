import ListItem from "@/models/ListItem";
export default class Task extends ListItem{
       //modelo de tarea para enviar a backend
        constructor(id,title,description,priority,startDate,endDate,level, etiqueta,estimacion,hecha,recordatorio) {
            super(id,title,description,priority,startDate,endDate, etiqueta,estimacion,recordatorio)
            this.hecha=hecha
            this.nivel=level
        }
}