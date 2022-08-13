# Goal

- Keep track of...
  - locations + start/end dates/times
  - who is participating

# ToDo

- [x] get api/events start/end dates from plans
- [x] contact list on user page
- [x] simple chat window
  - message
    - text (str)
    - replyTo (message.\_id)
- agenda
  - months are not in order
  - show year next to month name
  - show old events, but scroll to current date
  - separate agendas for TBD and dated events? (two columns)
    - OR make TDB collapsible (might prefer this one)

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
