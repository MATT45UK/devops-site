module.exports = (app) => {
    const terraform = require('../controllers/terraform.controller.js');

    app.get('/terraform/init/:userId', terraform.init);
    app.get('/terraform/plan/:userId', terraform.plan);


    // Create a new product
    app.post('/terraform/preinit/:userId', terraform.preInitialise);
    app.post('/terraform/backend/:userId', terraform.createBackend);
    app.post('/terraform/provisioner/:userId', terraform.createProvisioners);
    app.post('/terraform/module/:userId', terraform.createModule);

}