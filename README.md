# Goal

- Keep track of...
  - locations + start/end dates/times
  - who is participating

# How

- Event (name)
  - has a...
    - name
    - root group (cant be deleted)
    - pretty much just a holder of root group
  - Plan
    - belongs to a group / event
    - (choose at least 2)
      - what/where
      - duration (start/[end])
      - person(s)
        - checkbox for just including everyone (default TRUE~)
  - Group
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
- Calendar (agenda view for starters)
  - list of dates with events for each date
    - below it, show all plans that occur on that date
