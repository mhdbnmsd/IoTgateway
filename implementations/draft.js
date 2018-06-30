const EventEmitter = require('events');
const mqtt = require('mqtt');
const client = mqtt.connect('mqtt://localhost:1883');
let eventEmitter = new EventEmitter();

client.subscribe('service/device1/service1/down');

client.on('message', (topic, message) => {
    message = JSON.parse(message);
    if(topic === 'service/device1/service1/down') {
        eventEmitter.once('service1', (value) => {
            console.log(value);
            console.log(message);
            client.publish('service/device1/service1/up', value);
        });
    }
});