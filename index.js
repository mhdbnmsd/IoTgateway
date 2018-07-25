const mqtt = require('mqtt');
const client = mqtt.connect('mqtt://localhost:1883');
const jsonfile = require('jsonfile');
const fs = require('fs');
const reload = require('require-reload')(require);

let serviceRegistry = require('./service-registry.js');
let device = jsonfile.readFileSync('./config.json');
let _topic = `device/${device.name}`;
let _serviceTopic = `device/${device.name}/service`;
let _deleteServiceTopic = `device/${device.name}/service/delete`;

const deviceController = {};

deviceController.addService = (service) => {
    device.services.push(service);
    serviceController.generateService(service.name);
    jsonfile.writeFile('./config.json', device, {spaces: 2, EOL: '\r\n'}, (error) => {
        if(error) console.log(error);
    });
};

deviceController.removeService = (serviceName) => {
    device.services = device.services.filter( service => service.name !== serviceName);
    jsonfile.writeFile('./config.json', device, {spaces: 2, EOL: '\r\n'}, (error) => {
        if(error) console.log(error);
    });
};

const serviceController = {};

serviceController.init = () => {
    for(let service of device.services){
        client.subscribe(`service/${device.name}/${service.name}/down`);
    }
};

serviceController.generateService = (serviceName) => {
   let code = `
serviceRegistry.${serviceName} = (params) => {
    return new Promise((resolve, reject) => {
        // Write your code here; 
        let result = {};
        resolve(result);
   });
};
`;
   fs.appendFile('./service-registry.js', code, (error) => {
        if (error) console.log(error);
        serviceRegistry = reload('./service-registry.js');
        client.subscribe(`service/${device.name}/${serviceName}/down`);
   });
};

serviceController.invokeSerivce = (serviceName, params) => {
    return serviceRegistry[serviceName](params);
};

client.on('connect', () => {
    client.publish('device', JSON.stringify(device));
    serviceController.init();
});

client.subscribe(_topic);
client.subscribe(_serviceTopic);
client.subscribe(_deleteServiceTopic);

let reg = new RegExp(`service\/${device.name}\/*\/down`);
reg = reg.compile();

client.on('message', (topic, message) => {
    message = JSON.parse(message);
    if(topic === _topic){
        client.publish('device', JSON.stringify(device));
    }else if(topic === _serviceTopic){
        deviceController.addService(message);
    }else if (topic === _deleteServiceTopic){
        deviceController.removeService(message.serviceName);
    }else if (reg.test(topic)){
        let service = serviceController.getServiceName(topic);
        console.log(service);
        serviceController.invokeSerivce(service, message).then((result) => {
            console.log(result);
            client.publish(`service/${device.name}/${service}/up`, JSON.stringify(result));
        });
    }
});

process.on('SIGINT', (code) => {
    client.publish('device/exit', JSON.stringify({
        exit: true,
        name : device.name
    }));
});

serviceController.getServiceName = (topic) => {
    return topic.split('/')[2];
};






