const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session');

const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;

const app = express();   // ✅ MUST be defined before using app.use

app.use(express.json());

// Session middleware
app.use("/customer", session({
    secret: "fingerprint_customer",
    resave: true,
    saveUninitialized: true
}));

/**
 * AUTH MIDDLEWARE (JWT + session-based)
 * Protects all /customer/auth routes
 */
app.use("/customer/auth", function auth(req, res, next) {
    const authData = req.session.authorization;

    if (!authData) {
        return res.status(401).json({ message: "User not logged in" });
    }

    const token = authData.accessToken;

    if (!token) {
        return res.status(403).json({ message: "Token missing" });
    }

    jwt.verify(token, "access", (err, user) => {
        if (err) {
            return res.status(403).json({ message: "User not authenticated" });
        }

        req.user = user;
        next();
    });
});

const PORT = 5000;

// Routes
app.use("/customer", customer_routes);
app.use("/", genl_routes);

// Start server
app.listen(PORT, () => console.log("Server is running on port", PORT));