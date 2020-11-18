importScripts("https://www.gstatic.com/firebasejs/8.0.1/firebase-app.js");
importScripts("https://www.gstatic.com/firebasejs/8.0.1/firebase-messaging.js");

let config = {
    apiKey: 'AIzaSyDsDa2-gM_KJn9L_AthUXMn-nCXnt4S2A4',
    authDomain: 'fertigapp-68aa4.firebaseapp.com',
    databaseURL: 'https://fertigapp-68aa4.firebaseio.com/',
    projectId: 'fertigapp-68aa4',
    storageBucket: 'fertigapp-68aa4.appspot.com',
    messagingSenderId: '23323218827',
    appId: '1:23323218827:web:c7541412782fd7b3fd158e',
    measurementId: 'G-4MBLF8M9ES'
};
firebase.initializeApp(config);

const messaging = firebase.messaging();
messaging.setBackgroundMessageHandler(function (payload) {
    console.log(' Received background message ', payload);
    const title = 'Recipe PWA'
    const options = {
            body: "New Recipe Alert",
            icon: "https://raw.githubusercontent.com/idoqo/laravel-vue-recipe-pwa/master/public/recipe-book.png"
        };
    return self.registration.showNotification(
        title,
        options
    );
});
self.addEventListener('notificationclick', function(event) {
    var messageId = event.notification.data;
    clients.openWindow("/messages?reply=" + messageId)
    event.notification.close();

    if (event.action === 'like') {
        silentlyLikeItem();
    }
    else if (event.action === 'reply') {
        clients.openWindow("/messages?reply=" + messageId);
    }
    else {
        clients.openWindow("/messages?reply=" + messageId);
    }
}, false);

//https://github.com/firebase/quickstart-js/tree/master/messaging
//https://stackoverflow.com/questions/40462414/firebase-cloud-messaging-setbackgroundmessagehandler-not-called
//https://stackoverflow.com/questions/38728176/can-you-use-a-service-worker-with-a-self-signed-certificate
//https://stackoverflow.com/questions/34160509/options-for-testing-service-workers-via-http/34161385#34161385