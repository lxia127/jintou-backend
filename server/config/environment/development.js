'use strict';

// Development specific configuration
// ==================================
module.exports = {
ip: '127.0.0.1',
port:'9000',
  // Sequelize connection opions
  sequelize: {
    uri: 'sqlite://',
    options: {
      logging: false,
      storage: 'dev.sqlite',
      define: {
        timestamps: false
      }
    }
  },

  // Seed database on startup
  seedDB: true

};
