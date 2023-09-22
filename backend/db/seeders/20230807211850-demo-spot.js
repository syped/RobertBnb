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
        address: "123 Injured Dog Ave",
        city: "Rabat",
        state: "Casablanca",
        country: "Morocco",
        lat: 23,
        lng: 26,
        name: "Bind",
        description:
          "Bind is a two site map (A and B) that has attackers infiltrating from a beach coast.",
        price: 150,
      },
      {
        ownerId: 2,
        address: "123 Floating City Ave",
        city: "Venice",
        state: "Veneto",
        country: "Italy",
        lat: 100,
        lng: 220,
        name: "Ascent",
        description:
          "Ascent's features include mechanical doors leading into its spike sites.",
        price: 200,
      },
      {
        ownerId: 3,
        address: "123 B Every Round Ave",
        city: "Tokyo",
        state: "Kanto",
        country: "Japan",
        lat: 500,
        lng: 600,
        name: "Split",
        description:
          "Split is a map in VALORANT and one of the first available since the Closed Beta.",
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
