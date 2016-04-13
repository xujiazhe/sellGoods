/**
 * Created by xujiazhe on 16/4/10.
 */
var settings = require('../settings'),
    Db = require('mongodb').Db,
    Connection = require('mongodb').Connection,
    Server = require('mongodb').Server;
// {Db, Connection, Server} = require('mongodb');

module.exports = new Db(
    settings.db, 
    new Server(settings.host, settings.port), 
    {safe: true}
);