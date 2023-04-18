
//Complexidade de negócio
//Domain
//-Entity
//-customer.ts (regra de negócio)
//Complexidade acidental/técnica
//Infra
//-Entity / Model
// --customer.ts (get, set)

import EventDispatcher from "../event/@shared/event-dispatcher";
import CustomerAddressChangedEvent from "../event/customer/customer-address-changed.event";
import CustomerCreatedEvent from "../event/customer/customer-created.event";
import Address from "./address";

export default class Customer {
  private _id: string;
  private _name: string = "";
  private _eventDispatcher: EventDispatcher;
  private _address!: Address;
  private _active: boolean = false;
  private _rewardPoints: number = 0;

  constructor(id: string, name: string, eventDispatcher?: EventDispatcher) {
    this._id = id;
    this._name = name;
    if (typeof eventDispatcher !== "undefined") {
      this._eventDispatcher = eventDispatcher;
    }

    this.validate();

    if (typeof eventDispatcher !== "undefined") {
      this.callCustomerCreatedEvent(eventDispatcher);
    }
  }

  get id(): string {
    return this._id;
  }

  get name(): string {
    return this._name;
  }

  get rewardPoints(): number {
    return this._rewardPoints;
  }

  validate() {
    if (this._id.length === 0) {
      throw new Error("Id is required");
    }
    if (this._name.length === 0) {
      throw new Error("Name is required");
    }
  }

  changeName(name: string) {
    this._name = name;
    this.validate();
  }

  get Address(): Address {
    return this._address;
  }

  get eventDispatcher(): EventDispatcher {
    return this._eventDispatcher;
  }

  
  changeAddress(address: Address) {
    this._address = address;

    if (typeof this._eventDispatcher !== "undefined") {
      this.callCustomerAddressChangedEvent(this._eventDispatcher);
    }
  }

  isActive(): boolean {
    return this._active;
  }

  activate() {
    if (this._address === undefined) {
      throw new Error("Address is mandatory to activate a customer");
    }
    this._active = true;
  }

  deactivate() {
    this._active = false;
  }

  addRewardPoints(points: number) {
    this._rewardPoints += points;
  }

  set Address(address: Address) {
    this._address = address;
  }

  callCustomerCreatedEvent(eventDispatcher: EventDispatcher) {

    const customerCreatedEvent = new CustomerCreatedEvent({});

    eventDispatcher.notify(customerCreatedEvent);
  };

  callCustomerAddressChangedEvent(eventDispatcher: EventDispatcher) {

    const customerAddressChangedEvent = new CustomerAddressChangedEvent({
      id: this.id,
      name: this.name,
      address: this.Address,
    });

    eventDispatcher.notify(customerAddressChangedEvent);
  }

  
}
