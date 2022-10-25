## Notifications/Live Updates

### Reference

server-to-client-evt: ServerToClientEvents interface in index.d.ts

> Notifications/Live updates should be called synchronously (don't use await). The api call shouldn't be blocked by these calls.

### Sending a notification

```js
req.notification.send(
  {
    refModel: 'events',
    ref: docMessage2.event,
    key: '<server-to-client-evt>',
  },
  {
    general: {
      title: 'My Event',
      body: 'Time changed',
      url: `${req.get('host')}/e/<event-id>`,
    },
  }
)
```

**Android notification anatomy**

```
[smallicon] App Name - Time stamp
Title                               Large
Text                                Icon
```

### Sending a live update (no notification)

```js
req.io.to('event/<event-id>').emit('<server-to-client-evt>', doc)
```

### Subscribing to live update in UI (an example)

```js
const { useOn } = useSocket()
useOn(
  '<server-to-client-evt>', // such as 'message:add'
  (message: Eventful.API.MessageGet) => {
    qc.setQueriesData<Eventful.API.MessageGet[]>(['messages', { event }], (old = []) => [
      message,
      ...old.filter((msg) => msg._id !== message._id),
    ])
  },
  [qc, event]
)
```
