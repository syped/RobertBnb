"use strict";

const { SpotImage } = require("../models");

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

    await SpotImage.bulkCreate([
      {
        spotId: 1,
        url: "https://cdn.esportsdriven.com/media/guides/images/bind_ekhbkMM.main.jpg",
        preview: true,
      },
      {
        spotId: 2,
        url: "https://gumlet.assettype.com/afkgaming%2F2023-02%2Fa9e92df9-2e7a-46dd-a31b-7f48515b91f0%2FUntitled_design___2023_02_28T194337_756.jpg?compress=true&dpr=1&w=1200",
        preview: true,
      },
      {
        spotId: 3,
        url: "https://images.contentstack.io/v3/assets/bltb6530b271fddd0b1/bltee14888179d221f8/5ee7d51725b4740c330ba55d/Loading_Screen_Split_v2.jpg",
        preview: true,
      },
      {
        spotId: 4,
        url: "https://static.wikia.nocookie.net/valorant/images/1/13/Loading_Screen_Icebox.png",
        preview: true,
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

    options.tableName = "SpotsImages";
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(
      options,
      {
        spotId: { [Op.in]: [1, 2, 3] },
      },
      {}
    );
  },
};
