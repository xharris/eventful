# Goal

- Keep track of...
  - locations + start/end dates/times
  - who is participating

# ToDo

- agenda
  - [x] months are not in order
  - [x] show year next to month name
  - [ ] show old events, but scroll to current date
  - [x] separate agendas for TBD and dated events? (two columns)
    - OR make TDB collapsible (might prefer this one)
- notifications
  - api/fcm: refresh registration token for user
    - check if all of this users registered tokens are still valid
  - req.messaging
    - send(refModel, ref, data)
    - addToken(token, userId)
    - (DO LATER) subTopic(topic, userId)
    - (DO LATER) unsubTopic
    - (DO LATER) sendToTopic(topic)

# Nice features

- [ ] very simple, mini calendar showing busy/free dates. also shown on event page to show when plans are.
- [ ] notifications

# Revisit Later

- [ ] Carpool plan 'what' username autocomplete? Should the value just store a user id as a string and parse it differently in the UI?

# How

- Event (name)
  - has a...
    - name
    - root group (cant be deleted)
    - pretty much just a holder of root group
  - Plan
    - belongs to a group / event
    - (choose at least 2)
      - [x] what
      - [x] where
      - [x] duration (start/[end])
      - [x] person(s)
        - checkbox for just including everyone (default TRUE~)
  - ~~Group~~ --> Agenda filter
    - for grouping plans
    - has a...
      - name
      - category (optional)
        - makes all immediate plans display differently
- Plans can be used for... (category)
  - lodging
  - multiple carpool
  - meet-up location
- User
  - can store list of locations
  - can store list of contacts
- Calendar (agenda view for starters)
  - list of dates with events for each date
    - below it, show all plans that occur on that date
- Contact
