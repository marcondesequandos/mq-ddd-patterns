import Address from './domain/entity/address'
import Customer from './domain/entity/customer'
import Order from './domain/entity/order';
import OrderItem from './domain/entity/order_item';

const address = new Address("Rua Major Sertório", 422, "01222-000", "São Paulo");
let customer = new Customer("123", "Felipe Marcondes");
customer.Address = address
customer.activate();
//ID

//objeto - entidade
const item1 = new OrderItem("1", "p1", "Item 1", 100, 10)
const item2 = new OrderItem("2", "p2", "Item 2", 200, 20)

const order = new Order("1", "123", [item1, item2])