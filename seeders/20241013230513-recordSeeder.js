'use strict';
const bcrypt = require('bcryptjs')

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    let transaction

    try {
      transaction = await queryInterface.sequelize.transaction()

      const salt = await bcrypt.genSalt(10)
      const hash = await bcrypt.hash('12345678', salt)  // Hash '12345678' here

      // Backup existing data
      const existingUsers = await queryInterface.sequelize.query('SELECT * FROM Users', { type: Sequelize.QueryTypes.SELECT });
      const existingRestaurants = await queryInterface.sequelize.query('SELECT * FROM Records', { type: Sequelize.QueryTypes.SELECT });


      // Delete existing data
      await queryInterface.bulkDelete('Records', null, { transaction });
      await queryInterface.bulkDelete('Users', null, { transaction });


      // Insert users
      await queryInterface.bulkInsert('Users', [
        {
          id: 1,
          name: '廣志',
          email: 'user1@example.com',
          password: hash,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: 2,
          name: '小新',
          email: 'user2@example.com',
          password: hash,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ],
        { transaction }
      )
      await queryInterface.bulkInsert('Records', [
        {
          id: 1,
          name: '午餐',
          date: '2019-04-23',
          amount: 60,
          userId: 1,
          categoryId: 4,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 2,
          name: '晚餐',
          date: '2019-04-23',
          amount: 60,
          userId: 1,
          categoryId: 4,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 3,
          name: '捷運',
          date: '2019-04-23',
          amount: 120,
          userId: 1,
          categoryId: 2,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 4,
          name: '電影：驚奇隊長',
          date: '2019-04-23',
          amount: 220,
          userId: 2,
          categoryId: 3,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 5,
          name: '租金',
          date: '2015-04-01',
          amount: 25000,
          userId: 1,
          categoryId: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
        { transaction }
      );
      await transaction.commit()
    } catch (error) {
      if (transaction) await transaction.rollback()
      throw error; // Re-throw the error to ensure proper error handling
    }
  },

  async down(queryInterface, Sequelize) {
    let transaction;

    try {
      transaction = await queryInterface.sequelize.transaction();

      // Restore existing data
      await queryInterface.bulkInsert('Users', existingUsers, { transaction });
      await queryInterface.bulkInsert('Records', existingRestaurants, { transaction });

      await transaction.commit();
    } catch (error) {
      if (transaction) await transaction.rollback();
      throw error; // Re-throw the error to ensure proper error handling
    }
  }
};
