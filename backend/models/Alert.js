import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';
import Village from './Village.js';

const Alert = sequelize.define('Alert', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  village_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Village,
      key: 'id'
    }
  },
  severity: {
    type: DataTypes.ENUM('normal', 'alert', 'critical'),
    allowNull: false
  },
  message: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  wsi_score: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: true
  },
  is_resolved: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  user_submitted: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  submitted_by: {
    type: DataTypes.INTEGER,
    allowNull: true
  }
});

Village.hasMany(Alert, { foreignKey: 'village_id' });
Alert.belongsTo(Village, { foreignKey: 'village_id' });

export default Alert;
