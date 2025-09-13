const { MongoClient, ServerApiVersion } = require('mongodb');
const connectionString = process.env.DB_STRING;
let /**@type {MongoClient|null}*/ dbClient = null;

module.exports = {
    /**@param {Function} cb - callback function to be ran*/
    init: async cb => {
        let /**@type {Error|null}*/ err = null;

        try {
            if (dbClient) console.warn('"init" has already been ran and may only be ran once');
            else dbClient = await MongoClient.connect(connectionString, { serverApi: { version: ServerApiVersion.v1, strict: true, deprecationErrors: true } });
        } catch (e) {
            err = e;
        } finally {
            cb(err, dbClient);
        }
    },

    /**
     * @throws {Error}
     * @returns {MongoClient}
     */
    get: () => {
        if (dbClient) return dbClient;
        throw new Error('"init" has not yet been ran and must be ran once before getting the database');
    }
};
