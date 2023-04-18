import EventInterface from "./event.interface";

//método handle recebe evento, esse evento tem que implementar event interface
//toda vez que criar o eventHandler vai ter que ter um método handle e o metodo recebe o evento tipo T
//sendo que o evento tipo T é um event interface e o valor padrão é EventInterface

export default interface EventHandlerInterface<T extends EventInterface=EventInterface> {
    
    handle(event: T): void;
}