'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Records', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING
      },
      date: {
        type: Sequelize.DATE
      },
      amount: {
        type: Sequelize.DECIMAL
      },
      userId: {  // Foreign key column
        type: Sequelize.INTEGER,
        allowNull: false, // Ensuring this column is not null
        references: {     // Setting up the foreign key relationship
          model: 'Users', // Name of the table being referenced
          key: 'id'       // Key in the Users table this is referencing
        },
        onUpdate: 'CASCADE', // Action when the referenced record is updated
        onDelete: 'CASCADE'  // Action when the referenced record is deleted
      },
      categoryId: {  // Foreign key column
        type: Sequelize.INTEGER,
        allowNull: false, // Ensuring this column is not null
        references: {     // Setting up the foreign key relationship
          model: 'Categories', // Name of the table being referenced
          key: 'id'       // Key in the Users table this is referencing
        },
        onUpdate: 'CASCADE', // Action when the referenced record is updated
        onDelete: 'CASCADE'  // Action when the referenced record is deleted
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Records');
  }
};