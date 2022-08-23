# Goal

- Keep track of...
  - locations + start/end dates/times
  - who is participating

# ToDo

- adding another contact
  - [ ] user search
  - [?] create contactLink (lasts 24h - 1wk)
  - [?] display QR code on screen
- invite setting

  - [ ] who can invite me: anyone, my contacts

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
- [x] notifications
- [?] attach images to plan

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

# Service Worker http

- firefox

  `devtools.serviceWorkers.testing.enabled = true`

# Running tests

Inside that directory, you can run several commands:

`yarn playwright test`

    Runs the end-to-end tests.

`yarn playwright test --project=chromium`

    Runs the tests only on Desktop Chrome.

`yarn playwright test example`

    Runs the tests in a specific file.

`yarn playwright test --debug`

    Runs the tests in debug mode.

`yarn playwright codegen`

    Auto generate tests with Codegen.

We suggest that you begin by typing: `yarn playwright test`

And check out the following files:

- .\src\tests\example.spec.ts - Example end-to-end test
- .\tests-examples\demo-todo-app.spec.ts - Demo Todo App end-to-end tests
- .\playwright.config.ts - Playwright Test configuration

Visit https://playwright.dev/docs/intro for more information. ✨
