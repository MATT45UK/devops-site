module.exports = {

    verify: (req, res) => {
        const config = require('../../config')
        var jwtDecode = require('jwt-decode');
        let token = req.header('Authorization').split(' ')[1]

        //Test that our JWT is valid
        try {
            var jwt = jwtDecode(token, config.googleAuth.secret);
        } catch (err) {
            res.sendStatus(401);
            return;
        }

        // If our JWT hasn't expired, return 200
        let now = Math.floor(new Date() / 1000)
        if (now < jwt.exp) {
            res.sendStatus(200);
        } else {
            res.sendStatus(401);
        }
    }
}

