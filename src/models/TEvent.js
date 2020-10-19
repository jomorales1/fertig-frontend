
import Routine from "@/models/Routine";
export default class TEvent extends Routine{
    //modelo de evento para enviar a backend
    constructor(title,description,priority,startDate,endDate,repetitionString, level, etiqueta,hecha,recordatorio) {
        super(title,description,priority,startDate,endDate,repetitionString, level, etiqueta,0,hecha,recordatorio)
    }

}