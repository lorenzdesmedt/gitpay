'use strict';

const fs = require('fs')
const path = require('path')
const basename = path.basename(module.filename);
const env = process.env.NODE_ENV || 'databaseDev';
const config = require('../.env')[env];

let Sequelize = require('sequelize');
let sequelize = new Sequelize(config.database, config.username, config.password, config);
let db = {};

fs
    .readdirSync(__dirname)
    .filter((file) => {
        return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
    })
    .forEach((file) => {
        const model = sequelize['import'](path.join(__dirname, file));
        db[model.name] = model;
    });

Object.keys(db).forEach((modelName) => {
    if (db[modelName].associate) {
        db[modelName].associate(db);
    }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;