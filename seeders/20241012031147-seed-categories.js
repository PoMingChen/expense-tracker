'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // Insert the 5 categories into the Categories table
    await queryInterface.bulkInsert('Categories', [
      {
        id: 1,
        name: '家居物業',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 2,
        name: '交通出行',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 3,
        name: '休閒娛樂',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 4,
        name: '餐飲食品',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 5,
        name: '其他',
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    ], {});
  },

  async down(queryInterface, Sequelize) {
    // Remove all entries from the Categories table
    await queryInterface.bulkDelete('Categories', null, {});
  }
};
