const mqtt = require('mqtt');
const client = mqtt.connect('mqtt://localhost:1883');
const jsonfile = require('jsonfile');
const serviceRegistry = require('./service-registry.js');

let device = jsonfile.readFileSync('./config.json');

let _topic = `device/${device.name}`;
let _serviceTopic = `device/${device.name}/service`;
let _deleteServiceTopic = `device/${device.name}/service/delete`;

const deviceController = {};

deviceController.addService = (service) => {
    device.services.push(service);
    jsonfile.writeFile('./config.json', device, {spaces: 2, EOL: '\r\n'}, (error) => {
        console.log(error);
    });
};

deviceController.removeService = (serviceName) => {
    device.services = device.services.filter( service => service.name !== serviceName);
    jsonfile.writeFile('./config.json', device, {spaces: 2, EOL: '\r\n'}, (error) => {
        console.log(error);
    });
};

const serviceController = {};


serviceController.init = () => {
   /* for (let service of device.services){
        serviceController.eventEmitter.on(`${service.name}`, (value) => {
            client.publish(`service/${device.name}/${service.name}`, JSON.stringify({value: value}));
        });
    }*/

};

serviceController.invokeSerivce = (serviceName, params) => {
    return serviceRegistry[serviceName](params);
};

client.on('connect', () => {
    client.publish('device', JSON.stringify(device));
    client.subscribe('service/device1/service1/down');
    serviceController.init();
});

client.subscribe(_topic);
client.subscribe(_serviceTopic);
client.subscribe(_deleteServiceTopic);

client.on('message', (topic, message) => {
    message = JSON.parse(message);
    if(topic === _topic){
        client.publish('device', JSON.stringify(device));
    }else if(topic === _serviceTopic){
        deviceController.addService(message);
    }else if (topic === _deleteServiceTopic){
        deviceController.removeService(message.serviceName);
    }else if (topic === 'service/device1/service1/down'){
        serviceController.invokeSerivce('service1', message).then((result) => {
            client.publish('service/device1/service1/up', JSON.stringify(result));
        });
    }
});

process.on('SIGINT', (code) => {
    client.publish('device/exit', JSON.stringify({
        exit: true,
        name : device.name
    }));
});




