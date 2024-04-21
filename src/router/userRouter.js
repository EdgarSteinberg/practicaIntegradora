import { Router } from 'express';

import userModel from '../dao/models/userModel.js';

const router = Router();

// router.post("/register", async (req, res) => {
//     try {
//         req.session.failRegister = false
//         await userModel.create(req.body);
//         res.redirect("/login");

//     } catch (e) {
//         req.session.failRegister = true;
//         res.redirect("/register")
//     }
// });
router.post("/register", async (req, res) => {
    try {
        req.session.failRegister = false;

        // Verificar si el correo electrónico y la contraseña coinciden con las credenciales de administrador predefinidas
        const { email, password } = req.body;
        if (email === "adminCoder@coder.com" && password === "adminCod3r123") {
            // Si coincide, establecer el rol como "admin"
            await userModel.create({ ...req.body, role: "admin" });
        } else {
            // Si no coincide, establecer el rol como "usuario" por defecto
            await userModel.create({ ...req.body, role: "usuario" });
        }

        return res.redirect("/login");
    } catch (error) {
        console.error("Error al registrar usuario:", error);
        req.session.failRegister = true;
        return res.redirect("/register");
    }
});


router.post("/login", async (req, res) => {
    try {
        req.session.failLogin = false;
        const result = await userModel.findOne({ email: req.body.email });
        if (!result) {
            req.session.failLogin = true;
            return res.redirect("/login")
        };

        if (req.body.password !== result.password) {
            req.session.failLogin = true;
            return res.redirect("/login")
        }
        // Verificar si las credenciales coinciden con las del administrador
        if (req.body.email === "adminCoder@coder.com" && req.body.password === "adminCod3r123") {
            // Si coincide, establecer el rol como "admin"
            result.role = "admin";
        }

        delete result.password;
        req.session.user = result;

        return res.redirect("/products");

    } catch (error) {
        console.error("Error al logear usuario:", error);
        req.session.failLogin = true;
        return res.redirect("/login");
    }
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

export default router;