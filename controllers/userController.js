const createError = require("http-errors");
const mongoose = require("mongoose");

const Users = require("../model/userModel");

module.exports = {
  getAllUsers: async (req, res, next) => {
    // next(new Error("cannot get the users.."))
    // res.send("getting the list of the all users in the home page of the application...")
    try {
      const result = await Users.find({}, { __v: 0 }); //find method takes two parameter i.e.,(query, projection)...

      //******to pass the required field as 1 and not required as 0 */
      // const result = await users.find({}, { name:1,price:1, _id:0 }); //find method takes two parameter i.e.,(query, projection)...

      // const result = await users.find({price:90000}, {}); // to pass in query of the exact match value in the response data of an arrary of object.
      console.log("result", result);
      res.send(result);
    } catch (error) {
      console.log(error.message);
    }
  },

  createNewUser: async (req, res, next) => {
    //*** Users saving using async & await... */
    // console.log("req",req.body)
    try {
      const users = new Users(req.body);
      const result = await users.save();
      res.send(result);
    } catch (error) {
      console.log(error.message);
      if (error.name === "ValidationError") {
        next(createError(422, error.message));
        return;
      }
      next(error);
    }
  },
  findUserById: async (req, res, next) => {
    // res.send("Users taken by the id.")
    const id = req.params.id;
    try {
      const users = await Users.findById(id); /// using the "findById" method

      // const users = await Users.findOne({ _id: id });   ////**** using the "findOne" method */
      if (!users) {
        throw createError(404, "User doesn't  exist!!!");
      }

      res.send(users);
    } catch (error) {
      console.log(error.message);
      if (error instanceof mongoose.CastError) {
        next(createError(400, "Invalid User ID"));
        return;
      }
      next(error); //nested router optional
    }
  },

  updateUserById: async (req, res, next) => {
    // res.send("Users details are updated successfully by the id.")
    try {
      const id = req.params.id;
      const update = req.body;

      const option = { new: true }; //**optional paramter for below function to get the updated value. */
      const result = await Users.findByIdAndUpdate(id, update, option); //*** this function takes three parameter */

      if (!result) {
        throw createError(404, "User doesn't exist");
      }
      res.send(result);
    } catch (error) {
      console.log(error.message);
      if (error instanceof mongoose.CastError) {
        return next(createError(400, "Invalid User ID"));
      }
      next(error);
    }
  },

  deleteUserById: async (req, res, next) => {
    // res.send("User was deleted successfully.")
    const id = req.params.id;
    try {
      const result = await Users.findByIdAndDelete(id);
      if (!result) {
        throw createError(404, "User doesn't  exist!!!");
      }
      console.log(result);
      res.send(result);
    } catch (error) {
      console.log(error.message);
      if (error instanceof mongoose.CastError) {
        next(createError(400, "Invalid User ID"));
        return;
      }
      next(error);
    }
  },
};
