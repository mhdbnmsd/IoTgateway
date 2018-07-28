serviceRegistry = {};
module.exports = serviceRegistry;
const net = require('net');


const socketClient1 = net.createConnection({path: '/tmp/data.sock'}, () => {
    console.log('connected to ankle and wrist');
});

const socketClient2 = net.createConnection({path: '/tmp/chest.sock'}, () => {
    console.log('connected to chest');
});

serviceRegistry.getAnkleData = (params) => {
    return new Promise((resolve, reject) => {
        socketClient1.on('data', (data) => {
            data = `${data}`.split(',');
            if(data[0] === 'ankle')
                resolve(data);
        });
   });
};

serviceRegistry.getWristData = (params) => {
    return new Promise((resolve, reject) => {
        socketClient1.on('data', (data) => {
            data = `${data}`.split(',');
            if(data[0] === 'wrist')
                resolve(data);
        });
   });
};

serviceRegistry.getAnkleAcceleration = (params) => {
    return new Promise((resolve, reject) => {
        socketClient1.on('data', (data) => {
            data = `${data}`.split(',');
            if(data[0] === 'ankle')
                resolve({ax : data[1], ay: data[2], az: data[3]})
        });
   });
};

serviceRegistry.getChestData = (params) => {
    return new Promise((resolve, reject) => {
        socketClient2.on('data', (data) => {
            data = `${data}`.split(',');
            if(data[0] === 'chest'){
                resolve(data);
            }
        });
   });
};

serviceRegistry.getChestAcceleration = (params) => {
    return new Promise((resolve, reject) => {
        socketClient2.on('data', (data) => {
            data = `${data}`.split(',');
            if(data[0] === 'chest'){
                resolve({cx: data[2], cy : data[3], cz: data[4]});
            }
        });
   });
};

