'use strict';

require('dotenv').config();

let DATABASE_URL;
if (['dev', 'test'].includes(process.env.NODE_ENV)) {
  DATABASE_URL = 'sqlite::memory:';
} else {
  DATABASE_URL = process.env.DATABASE_URL || 'sqlite::memory:';
}

console.log('starting on ', DATABASE_URL);

const { Sequelize, DataTypes } = require('sequelize');

const Collection = require('./data-collection.js');
const userSchema = require('./user/model');
const foodSchema = require('./food/model.js');
const clothesSchema = require('./clothes/model.js');
const recipeSchema = require('./recipe/model.js');
const foodRecipeSchema = require('./foodRecipe/model.js');

const sequelizeOptions =
  process.env.NODE_ENV === 'production'
    ? {
        dialectOptions: {
          ssl: {
            require: true,
            rejectUnauthorized: false,
          },
        },
      }
    : { logging: false };

// turn schemas into Sequelize models
const sequelize = new Sequelize(DATABASE_URL, sequelizeOptions);
const UserModel = userSchema(sequelize, DataTypes);
const FoodModel = foodSchema(sequelize, DataTypes);
const ClothesModel = clothesSchema(sequelize, DataTypes);
const RecipeModel = recipeSchema(sequelize, DataTypes);
const FoodRecipeModel = foodRecipeSchema(sequelize, DataTypes);

// create our Collections and associations
const UserCollection = new Collection(UserModel);
const FoodCollection = new Collection(FoodModel);
const ClothesCollection = new Collection(ClothesModel);
const RecipeCollection = new Collection(RecipeModel);
FoodCollection.belongsToManyThrough(RecipeCollection, FoodRecipeModel);
RecipeCollection.belongsToManyThrough(FoodCollection, FoodRecipeModel);

module.exports = {
  db: sequelize,
  User: UserCollection,
  Food: FoodCollection,
  Clothes: ClothesCollection,
  Recipe: RecipeCollection,
  FoodRecipe: FoodRecipeModel,
};
