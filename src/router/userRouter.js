import { Router } from 'express';
import { userManagerDB } from '../dao/userManagerDB.js';
import passport from 'passport';


const UserRouter = Router();

const Users = new userManagerDB();


UserRouter.post(
    '/register',
    passport.authenticate('register', { failureRedirect: "/api/sessions/failRegister" }),
    async (req, res) => {
        try {
            const user = await Users.register(req.body);
    
            res.status(200).send({
                status: 'success',
                payload: user,
                redirectTo: '/login' // Indica al cliente dónde redirigir
            });


        } catch (error) {
            res.status(400).send({
                status: 'error',
                message: error.message
            });
        }
    }
);

UserRouter.get("/failRegister", (req, res) => {
    res.status(401).send({
        status: 'error',
        message: "Failed Register"
    })
});

UserRouter.post(
    '/login',
    passport.authenticate("login", { failureRedirect: "/api/sessions/failLogin" }),
    (req, res) => {
        if (!req.user) {
            return res.status(401).send({
                status: "error",
                message: "Error Login!"
            });
        }

        req.session.user = {
            first_name: req.user.first_name,
            last_name: req.user.last_name,
            email: req.user.email,
            age: req.user.age,
            username: req.user.username,
            name: req.user.name
        }

        return res.redirect("/products");
        // res.send({
        //     status: 'success',
        //     payload: req.user
        // });
    }
);

UserRouter.get("/failLogin", (req, res) => {
    res.status(401).send({
        status: 'error',
        message: "Failed Login"
    })
});

UserRouter.post("/logout", (req, res) => {
    req.session.destroy(error => {
        if (!error) return res.redirect("/login");

        res.send({
            status: "Logout ERROR",
            body: error
        });
    })
});


UserRouter.get("/github", passport.authenticate('github', { scope: ['user.email'] }), (req, res) => {
    console.log(req.user.email);
    res.send({
        status: 'succes',
        message: 'Success'
    });
});

UserRouter.get("/githubcallback", passport.authenticate('github', { failureRedirect: '/login' }), (req, res) => {
    req.session.user = req.user;
    res.redirect('/');
});
export default UserRouter;