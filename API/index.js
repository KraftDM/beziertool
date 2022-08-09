module.exports = function (app) {

    app.get('/api/user', require('./user').get);

    app.get('/api/archive', require('./archive').get);
    app.post('/api/archive', require('./archive').post);
    //app.delete('/api/archive', require('./archive').delete);
};