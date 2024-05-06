import { Router } from 'express';
import passport from 'passport';


const router = Router();


router.post(
    '/register',
    passport.authenticate('register', { failureRedirect: "/api/sessions/failRegister" }),
    (req, res) => {
        // res.send({
        //     status: 'success',
        //     message: 'User registered'
        // });
        res.redirect("/login");
    }
);

router.get("/failRegister", (req, res) => {
    res.status(401).send({
        status: 'error',
        message: "Failed Register"
    })
});

router.post(
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

router.get("/failLogin", (req, res) => {
    res.status(401).send({
        status: 'error',
        message: "Failed Login"
    })
});

router.post("/logout", (req, res) => {
    req.session.destroy(error => {
        if (!error) return res.redirect("/login");

        res.send({
            status: "Logout ERROR",
            body: error
        });
    })
});


router.get("/github", passport.authenticate('github', { scope: ['user.email'] }), (req, res) => {
    console.log(req.user.email);
    res.send({
        status: 'succes',
        message: 'Success'
    });
});

router.get("/githubcallback", passport.authenticate('github', { failureRedirect: '/login' }), (req, res) => {
    req.session.user = req.user;
    res.redirect('/');
});
export default router;