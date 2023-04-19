import Address from "../../entity/address";
import Customer from "../../entity/customer";
import CustomerCreatedEvent from "../customer/customer-created.event";
import CustomerAddressChangedMsg from "../customer/handler/customer-change-address-msg.handler";
import CustomerCreatedFirstMsg from "../customer/handler/customer-created-first-msg.handler";
import CustomerCreatedSecondMsg from "../customer/handler/customer-created-second-msg.handler";
import SendEmailWhenProductIsCreatedHandler from "../product/handler/send-email-when-product-is-created.handler";
import ProductCreatedEvent from "../product/product-created.event";
import EventDispatcher from "./event-dispatcher";

describe("Product domain events tests", ()=> {

    it("should register an event handler", ()=> {

        const eventDispatcher = new EventDispatcher();
        const eventHandler = new SendEmailWhenProductIsCreatedHandler();

        eventDispatcher.register("ProductCreatedEvent", eventHandler);

        expect(eventDispatcher.getEventHandlers["ProductCreatedEvent"]).toBeDefined();
        expect(eventDispatcher.getEventHandlers["ProductCreatedEvent"].length).toBe(1);
        expect(eventDispatcher.getEventHandlers["ProductCreatedEvent"][0]).toMatchObject(eventHandler);
    })

    it("should unregister an event handler", ()=> {

        const eventDispatcher = new EventDispatcher();
        const eventHandler = new SendEmailWhenProductIsCreatedHandler();

        eventDispatcher.register("ProductCreatedEvent", eventHandler);

        expect(eventDispatcher.getEventHandlers["ProductCreatedEvent"][0]).toMatchObject(eventHandler);

        eventDispatcher.unregister("ProductCreatedEvent", eventHandler);

        expect(eventDispatcher.getEventHandlers["ProductCreatedEvent"]).toBeDefined();
        expect(eventDispatcher.getEventHandlers["ProductCreatedEvent"].length).toBe(0);

    })

    it("should unregister all events", ()=> {

        const eventDispatcher = new EventDispatcher();
        const eventHandler = new SendEmailWhenProductIsCreatedHandler();

        eventDispatcher.register("ProductCreatedEvent", eventHandler);

        expect(eventDispatcher.getEventHandlers["ProductCreatedEvent"][0]).toMatchObject(eventHandler);

        eventDispatcher.unregisterAll();
        
        expect(eventDispatcher.getEventHandlers["ProductCreatedEvent"]).toBeUndefined();      
    })

    it("should notify all event handlers", ()=> {

        const eventDispatcher = new EventDispatcher();
        const eventHandler = new SendEmailWhenProductIsCreatedHandler();
        const spyEventHandler = jest.spyOn(eventHandler, "handle")

        eventDispatcher.register("ProductCreatedEvent", eventHandler);

        expect(eventDispatcher.getEventHandlers["ProductCreatedEvent"][0]).toMatchObject(eventHandler);

        const productCreatedEvent = new ProductCreatedEvent({
            name: "Product 1",
            description: "Product 1 description",
            price: 10.0,
        })

        // Quando o notify for executado o SendEmailWhenProductIsCreatedHandler.handle() deve ser chamado

        eventDispatcher.notify(productCreatedEvent);

        expect(spyEventHandler).toHaveBeenCalled();

        
    })
})

describe("Customer domain events tests", ()=> {

    it("should register a customer event handler", ()=> {

        const eventDispatcher = new EventDispatcher();
        const eventHandler1 = new CustomerCreatedFirstMsg();
        const eventHandler2 = new CustomerCreatedSecondMsg();

        eventDispatcher.register("CustomerCreatedEvent", eventHandler1);
        eventDispatcher.register("CustomerCreatedEvent", eventHandler2);


        expect(eventDispatcher.getEventHandlers["CustomerCreatedEvent"]).toBeDefined();
        expect(eventDispatcher.getEventHandlers["CustomerCreatedEvent"].length).toBe(2);
        expect(eventDispatcher.getEventHandlers["CustomerCreatedEvent"][0]).toMatchObject(eventHandler1);
        expect(eventDispatcher.getEventHandlers["CustomerCreatedEvent"][1]).toMatchObject(eventHandler2);
    })

    it("should unregister an event handler", ()=> {

        const eventDispatcher = new EventDispatcher();
        const eventHandler = new CustomerCreatedFirstMsg();

        eventDispatcher.register("CustomerCreatedEvent", eventHandler);

        expect(eventDispatcher.getEventHandlers["CustomerCreatedEvent"][0]).toMatchObject(eventHandler);

        eventDispatcher.unregister("CustomerCreatedEvent", eventHandler);

        expect(eventDispatcher.getEventHandlers["CustomerCreatedEvent"]).toBeDefined();
        expect(eventDispatcher.getEventHandlers["CustomerCreatedEvent"].length).toBe(0);

    })

    it("should unregister all events", ()=> {

        const eventDispatcher = new EventDispatcher();
        const eventHandler1 = new CustomerCreatedFirstMsg();
        const eventHandler2 = new CustomerCreatedSecondMsg();

        eventDispatcher.register("CustomerCreatedEvent", eventHandler1);
        eventDispatcher.register("CustomerCreatedEvent", eventHandler2);

        expect(eventDispatcher.getEventHandlers["CustomerCreatedEvent"][0]).toMatchObject(eventHandler1);
        expect(eventDispatcher.getEventHandlers["CustomerCreatedEvent"][1]).toMatchObject(eventHandler2);

        eventDispatcher.unregisterAll();
        
        expect(eventDispatcher.getEventHandlers["CustomerCreatedEvent"]).toBeUndefined();      
    })

    it("should notify all event handlers", ()=> {

        const eventDispatcher = new EventDispatcher();
        const eventHandler1 = new CustomerCreatedFirstMsg();
        const eventHandler2 = new CustomerCreatedSecondMsg();
        const spyEventHandler1 = jest.spyOn(eventHandler1, "handle")
        const spyEventHandler2 = jest.spyOn(eventHandler2, "handle")

        eventDispatcher.register("CustomerCreatedEvent", eventHandler1);
        eventDispatcher.register("CustomerCreatedEvent", eventHandler2);

        expect(eventDispatcher.getEventHandlers["CustomerCreatedEvent"][0]).toMatchObject(eventHandler1);
        expect(eventDispatcher.getEventHandlers["CustomerCreatedEvent"][1]).toMatchObject(eventHandler2);

        const customerCreatedEvent = new CustomerCreatedEvent({
            id: "1",
            name: "Customer 1",
            eventDispatcher
        })

        eventDispatcher.notify(customerCreatedEvent);

        expect(spyEventHandler1).toHaveBeenCalled();
        expect(spyEventHandler2).toHaveBeenCalled();        
    })

    it("should notify event handlers, when customer address is changed", () => {

        const eventDispatcher = new EventDispatcher();

        const eventHandler = new CustomerAddressChangedMsg();

        eventDispatcher.register("CustomerAddressChangedEvent", eventHandler);

        const spyEventHandler = jest.spyOn(eventHandler, "handle");

        const customer = new Customer("1", "Customer 1", eventDispatcher);
        const address = new Address("Street 1", 11, "01222-000", "São Paulo");
        customer.changeAddress(address);       
    
        expect(spyEventHandler).toHaveBeenCalled();
      });
})