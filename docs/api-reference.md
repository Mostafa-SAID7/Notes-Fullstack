# API Reference

Base URL: `http://localhost:5272/api`

Interactive docs (Swagger UI): `http://localhost:5272/swagger`

---

## Notes

### `GET /api/Notes`

Returns all notes.

**Response `200 OK`**

```json
[
  {
    "id": 1,
    "title": "My first note",
    "desc": "Some description",
    "createdDate": "2024-04-20T10:00:00Z"
  }
]
```

---

### `GET /api/Notes/{id}`

Returns a single note by ID.

**Path params**

| Param | Type | Description |
|-------|------|-------------|
| `id` | int | Note ID |

**Response `200 OK`** — note object  
**Response `404 Not Found`** — note does not exist

---

### `POST /api/Notes`

Creates a new note.

**Request body**

```json
{
  "id": 0,
  "title": "My note",
  "desc": "Description"
}
```

**Response `200 OK`** — created note object

---

### `PUT /api/Notes`

Updates an existing note.

**Request body**

```json
{
  "id": 5,
  "title": "Updated title",
  "desc": "Updated description"
}
```

**Response `200 OK`** — updated note object  
**Response `404 Not Found`** — note does not exist

---

### `DELETE /api/Notes/{id}`

Deletes a note by ID.

**Response `200 OK`** — deleted note object  
**Response `404 Not Found`** — note does not exist
