"use strict";

const { Spot } = require("../models");

let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA; // define your schema in options object
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
     */

    await Spot.bulkCreate([
      {
        ownerId: 1,
        address: "123 Spoon Ave",
        city: "Spoony",
        state: "New Jersey",
        country: "USA",
        lat: 23,
        lng: 26,
        name: "spiderman",
        description: "a nice spot",
        price: 30,
      },
      {
        ownerId: 2,
        address: "1234 Spoon Ave",
        city: "Spoony",
        state: "New Jersey",
        country: "USA",
        lat: 100,
        lng: 220,
        name: "superman",
        description: "a nice spot",
        price: 50,
      },
      {
        ownerId: 3,
        address: "12345 Spoon Ave",
        city: "Spoony",
        state: "New Jersey",
        country: "USA",
        lat: 500,
        lng: 600,
        name: "batman",
        description: "a nice spot",
        price: 100,
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */

    options.tableName = "Spots";
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(
      options,
      {
        ownerId: {
          [Op.in]: [1, 2, 3],
        },
      },
      {}
    );
  },
};
