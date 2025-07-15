import { DataTypes, Model, Optional, Sequelize } from 'sequelize';

interface OrderItemAttributes {
  id: number;
  orderId: number;
  productId: string;
  productName: string;
  quantity: number;
  price: number;
}
interface OrderItemCreationAttributes extends Optional<OrderItemAttributes, 'id'> {}

class OrderItem extends Model<OrderItemAttributes, OrderItemCreationAttributes> implements OrderItemAttributes {
  public id!: number;
  public orderId!: number;
  public productId!: string;
  public productName!: string;
  public quantity!: number;
  public price!: number;
}

export const initOrderItemModel = (sequelize: Sequelize) => {
  OrderItem.init({
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    orderId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'orders', 
        key: 'id',
      },
    },
    productId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    productName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
  }, {
    sequelize,
    tableName: 'order_items',
    timestamps: false,
  });

  return OrderItem;
};