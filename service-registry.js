serviceRegistry = {};
module.exports = serviceRegistry;
const net = require('net');
const socketClient = net.createConnection({path: '/tmp/data.sock'}, () => {
    console.log('connected to socket');
});

/*socketClient.on('data', (data) => {
    data = `${data}`.split(',');
    console.log(data);
});*/

serviceRegistry.service1 = (params) => {
    return new Promise((resolve) => {
        socketClient.on('data', (data) => {
            data = `${data}`.split(',');
            resolve(data);
        });
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

serviceRegistry.service6 = (params) => {
    return new Promise((resolve, reject) => {
        // Write your code here; 
        let result = {};
        resolve(result);
   });
};


serviceRegistry.service8 = (params) => {
    return new Promise((resolve, reject) => {
        // Write your code here; 
        let result = params.a + params.b + params.c;
        resolve(result);
   });
};


