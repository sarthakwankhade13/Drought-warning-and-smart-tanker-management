import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Village = sequelize.define('Village', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  district: {
    type: DataTypes.STRING,
    allowNull: false
  },
  state: {
    type: DataTypes.STRING,
    allowNull: false
  },
  population: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  latitude: {
    type: DataTypes.DECIMAL(10, 8),
    allowNull: false
  },
  longitude: {
    type: DataTypes.DECIMAL(11, 8),
    allowNull: false
  },
  storage_capacity: {
    type: DataTypes.BIGINT,
    allowNull: false,
    comment: 'in liters'
  },
  current_storage: {
    type: DataTypes.BIGINT,
    allowNull: false,
    comment: 'in liters'
  }
});

export default Village;
