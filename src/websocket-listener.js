'use strict'
const SockJS = require('sockjs-client');
const Stomp = require("@stomp/stompjs");

function register(registrations) {
    const socket = SockJS("http://localhost:8080/message");
    const stompClient = Stomp.over(socket);
    stompClient.connect({}, frame => {
        registrations.forEach(registration => {
            stompClient.subscribe(registration.route, registration.callback);
        });
    });
}

module.exports.register = register;