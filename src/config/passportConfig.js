import passport from 'passport';
import local from 'passport-local';

import userModel from '../dao/models/userModel.js';
import { createHash, isValidPassword } from '../utils/functionsutil.js';

const localStrategy = local.Strategy;

const initializePassport = () => {
    passport.use('register', new localStrategy(
        {
            passReqToCallback: true, // Permite pasar la solicitud al callback
            usernameField: 'email' // Define el campo utilizado como nombre de usuario
        },
        async (req, email, password, done) => { // Callback ejecutado al intentar registrar un usuario
            const { first_name, last_name, age, username } = req.body; // Extrae los datos del cuerpo de la solicitud

            try {
                // Busca si ya existe un usuario con el correo electrónico o el nombre de usuario proporcionado
                let user = await userModel.findOne({ $or: [{ email }, { username }] });

                if (user) {
                    console.log("User already exist!");
                    return done(null, false);
                }

                const newUser = {
                    first_name,
                    last_name,
                    email,
                    age,
                    username,
                    password: createHash(password)
                };

                const result = await userModel.create(newUser);

                return done(null, result); // Devuelve el resultado del registro
            } catch (error) {
                return done(error.message);
            }
        }
    ));

    passport.use('login', new localStrategy(
        {
            usernameField: 'email'
        },
        async (email, password, done) => {
            try {
                const user = await userModel.findOne({ email });// sacaste el username 
                if (!user) {
                    const errorMessage = "User does not exist";
                    console.log(errorMessage);
                    return done(errorMessage);
                }

                if (!isValidPassword(user, password)) {
                    return done("User or Password is Incorrect!");
                }

                return done(null, user);
            } catch (error) {
                console.log(error.message);
                return done(error.message);
            }
        }
    ));

    passport.serializeUser((user, done) => done(null, user._id));

    passport.deserializeUser(async (id, done) => {
        const user = await userModel.findById(id);
        done(null, user)
    })

}

export default initializePassport;