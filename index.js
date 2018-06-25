const mqtt = require('mqtt');
const client = mqtt.connect('mqtt://localhost:1883');
const jsonfile = require('jsonfile');

let config = jsonfile.readFileSync('./config.json');
let _topic = `device/${config.name}`;
let _serviceTopic = `device/${config.name}/service`;
let _deleteServiceTopic = `device/${config.name}/service/delete`;

client.on('connect', () => {
    client.publish('device', JSON.stringify(config));
});

client.subscribe(_topic);
client.subscribe(_serviceTopic);
client.subscribe(_deleteServiceTopic);

client.on('message', (topic, message) => {
    message = JSON.parse(message);
    if(topic === _topic){
        console.log(message);
        client.publish('device', JSON.stringify(config));
    }else if(topic === _serviceTopic){
        console.log(message);
        config.services.push(message);
        jsonfile.writeFile('./config.json', config, {spaces: 2, EOL: '\r\n'}, (error) => {
            console.log(error);
        })
    }else if (topic === _deleteServiceTopic){
        console.log(message);
        config.services = config.services.filter( service => service.name !== message.serviceName);
        jsonfile.writeFile('./config.json', config, {spaces: 2, EOL: '\r\n'}, (error) => {
           console.log(error);
        });
    }
});

process.on('SIGINT', (code) => {
    client.publish('device/exit', JSON.stringify({
        exit: true,
        name : config.name
    }));
});