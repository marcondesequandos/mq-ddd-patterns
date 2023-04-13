import Order  from "../../domain/entity/order";
import OrderItem from "../../domain/entity/order_item";
import OrderRepositoryInterface from "../../domain/repository/order-repository.interface";
import OrderItemModel from "../db/sequelize/model/order-item.model";
import OrderModel  from "../db/sequelize/model/order.model";

export default class OrderRepository implements OrderRepositoryInterface {
  async create(entity: Order): Promise<void> {
    await OrderModel.create(
      {
        id: entity.id,
        customer_id: entity.customerId,
        total: entity.total(),
        items: entity.items.map((item) => ({
          id: item.id,
          name: item.name,
          price: item.price,
          product_id: item.productId,
          quantity: item.quantity,
        })),
      },
      {
        include: [{ model: OrderItemModel }],
      }
    );
  }

  async update(entity: Order): Promise<void> {
    await OrderModel.destroy({ where: { id: entity.id } });
    await this.create(entity);
  }

  async find(id: string): Promise<Order> {
        
        let orderModel;
        
        try {        
          orderModel = await OrderModel.findOne({
            where: { id: id },
            include: ["items"],
            rejectOnEmpty: true,
          });

            const items = orderModel.items.map(            
            (item) => {
              const orderItem = new OrderItem(
                item.id,
                item.product_id,
                item.name,
                item.price,
                item.quantity
              );
              return orderItem;
            }
          );    
          
          const order = new Order(id, orderModel.customer_id, items);
    
          return order;

        } catch (error) {
          throw new Error("Order not found");          
        }
  }

  async findAll(): Promise<Order[]> {
    const orderModels = await OrderModel.findAll({ include: ["items"] });

    const orders = orderModels.map((orderModel) => {
      const items = orderModel.items.map(
        (item)=> {
          const orderItem = new OrderItem(
            item.id,
            item.product_id,
            item.name,
            item.price,
            item.quantity
          )
          return orderItem
        }
      );
        const order = new Order(orderModel.id, orderModel.customer_id, items)

        return order;
    });

    return orders;
  }
}
