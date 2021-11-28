# Simple CRUD API

Simple CRUD API using in-memory database underneath

## Installation

Dillinger requires [Node.js](https://nodejs.org/) LTS to run.

Start this program:
```sh
node index.js
```

API path /person:

  * GET /person or /person/${personId} return all persons or person with corresponding personId
  * POST /person is used to create record about new person and store it in database
  * PUT /person/${personId} is used to update record about existing person
  * DELETE /person/${personId} is used to delete record about existing person from database

Faces are objects with the following properties:

  * id — unique identifier (string, uuid) generated on server side
  * name — person's name (string, required)
  * age — person's age (number, required)
  * hobbies — person's hobbies (array of strings or empty array, required)

