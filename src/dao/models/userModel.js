import mongoose from 'mongoose';

const userCollection = "users";

const userSchema = mongoose.Schema({
    first_name : {
        type: String,
        minLength: 3,
        require: true
    },
    last_name : {
        type: String,
        minLength: 3,
        require: true
    },
    email: {
        type: String,
        minLength: 5,
        require: true,
        unique: true
    },
    age: {
        type: Number,
        min: 18,
        require: true
    },
    password: {
        type: String,
        //minLength: 3, 
        require: true
    },
    username: {
        type: String,
        unique: true // Asegura que cada username sea único
    },
    name: {
        type:String,
        //required: true
    },
    role: {
        type: String,
        enum: ["admin", "usuario"], // Solo permitir los valores "admin" o "usuario"
        default: "usuario" // Por defecto, todos los usuarios serán "usuario"
    }
})

const userModel = mongoose.model(userCollection, userSchema);

export default userModel;