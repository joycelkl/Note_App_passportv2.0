// middleware to check if the user is logged in
const isLoggedIn = function(req, res, next) {
    console.log('isloggedin fucntion')
    if (req.isAuthenticated()) {
        console.log(req.cookies);
        console.log(req.session.passport.user, "passport USER");
        console.log(req.user, "USER");
        return next();
    }

    res.redirect("/login");
}


//I don't have admin here ><||| ignore this first
const isLoggedInAdmin = function(req, res, next) {
    if (req.isAuthenticated()) {
        console.log(req.cookies);
        console.log(req.session.passport.user, "passport USER");
        console.log(req.user, "USER");
        if (req.session.passport.user.type == "admin") {
            return next();
        }
    }

    res.redirect("/login");
}

module.exports = {
    isLoggedIn: isLoggedIn,
    isLoggedInAdmin: isLoggedInAdmin
}