const mongoose = require('mongoose');

class Mongoose {
  constructor({ Config, Logger }) {
    /**
     * @private
     * @type {import('mongoose').Mongoose}
     */
    this.mongooseConnection = null;

    /** @private */
    this.uri = Config.ASM_MONGODB_URI;

    /** @private */
    this.logLevel = Config.ASM_LOG_LEVEL;

    /**
     * @private
     * @type {import('../Logger').Logger}
     */
    this.Logger = Logger;
  }

  /**
   * @returns {Promise<import('mongoose').Mongoose>}
   */
  async getMongooseConnection() {
    if (this.mongooseConnection === null) {
      this.mongooseConnection = await mongoose.connect(this.uri, {
        // useCreateIndex: true,
        // useFindAndModify: false,
        // useUnifiedTopology: true,
        // useNewUrlParser: true,
        family: 4,
      });
      if (this.logLevel <= 2) {
        this.mongooseConnection.set(
          'debug',
          (collectionName, method, query, doc) => {
            this.Logger.debug(
              {
                collectionName,
                method,
                query,
                doc,
              },
              'mongo',
            );
          },
        );
      }
    }
    return this.mongooseConnection;
  }

  /**
   * @returns {Promise<void>}
   */
  async disconnect() {
    if (this.mongooseConnection) {
      await this.mongooseConnection.disconnect();
      this.mongooseConnection = null;
    }
  }
}

module.exports = Mongoose;
