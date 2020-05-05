module.exports = (app) => {
    const terraform = require('../controllers/terraform.controller.js');

    app.put('/terraform/preinit/:userId', terraform.preInitialise);
    app.put('/terraform/backend/:userId', terraform.createBackend);
    app.put('/terraform/init/:userId', terraform.init);

    app.get('/terraform/plan/:userId', terraform.plan);

    app.post('/terraform/provisioner/:userId', terraform.createProvisioners);
    app.post('/terraform/module/:userId', terraform.createModule);

}