self.addEventListener('push', event => {
  const data = event.data ? event.data.json() : {title: 'El Recesó', body:'Tienes una notificación'};
  const options = {
    body: data.body,
    icon: 'icon-192.png',
    badge: 'icon-192.png',
    data: data
  };
  event.waitUntil(self.registration.showNotification(data.title, options));
});

self.addEventListener('notificationclick', event => {
  event.notification.close();
  event.waitUntil(clients.openWindow('/'));
});
