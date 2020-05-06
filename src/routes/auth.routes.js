module.exports = (app) => {
    const auth = require('../controllers/auth.controller.js');
    app.get('/auth', auth.verify);
}