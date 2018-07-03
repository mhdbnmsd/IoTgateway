serviceRegistry = {};
module.exports = serviceRegistry;

serviceRegistry.service1 = (params) => {
    return new Promise((resolve) => {
        // Implement your shit
        /* Example */
        // Jib les données men ZigBee wala Ma3labalich
        let result = params.a * params.b ;
        resolve(result);
    });
};


serviceRegistry.service2 = (params) => {
    return new Promise((resolve) => {
        // Write your code here;
        let result = params.a + params.b;
        resolve(result);
   });
};

serviceRegistry.service3 = (params) => {
    return new Promise((resolve, reject) => {
        // Write your code here; 
        let result = {};
        resolve(result);
   });
};

serviceRegistry.service4 = (params) => {
    return new Promise((resolve) => {
        // Write your code here; 
        let result = {};
        resolve(result);
   });
};

serviceRegistry.service5 = (params) => {
    return new Promise((resolve) => {
        // Write your code here; 
        let result = {};
        resolve(result);
   });
};
