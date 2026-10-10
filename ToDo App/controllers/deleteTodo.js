//import the model;
const Todo = require("../models/Todo");

//define route handler

exports.deleteTodo = async (req, res) => {
    try {
        const {id}=req.params;
        const todo=await Todo.findByIdAndDelete(id);

        res.json({
            success:true,
            message:"Todo deleted"
        })
    }
    catch (err) {
         console.error(err);
        response.status(500).json({
            success: false,
            data: "Internal server error",
            message: err.message
        });

    }
}