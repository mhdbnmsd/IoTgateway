serviceRegistry = {};
module.exports = serviceRegistry;

serviceRegistry.service1 = (params) => {
    return new Promise((resolve, reject) => {
        // Impliment your shit
        /* Example */
        // Jib les données men ZigBee wala Ma3labalich
        let result = params.a * params.b + Math.random();
        resolve(result);
    });
};

