## Stage 1 — API Design

### GET /notifications
Headers:
Authorization: Bearer token

Response:
[
  {
    id,
    studentID,
    message,
    type,
    isRead,
    createdAt
  }
]

---

### POST /notifications
Body:
{
  "studentID": 1042,
  "message": "Placement update",
  "type": "placement"
}

Response:
{
  "success": true
}

---

### GET /notifications/unread
Response:
[
  { ...unread notifications }
]

---

## Stage 2 — Database Design

Database: PostgreSQL

Schema:

notifications(
  id PRIMARY KEY,
  studentID INT,
  message TEXT,
  type VARCHAR,
  isRead BOOLEAN,
  createdAt TIMESTAMP
)

Index:
(studentID, isRead, createdAt DESC)

---

## Stage 3 — Query Optimization

Problem:
Slow query for unread notifications

Solution:
Composite index:
(studentID, isRead, createdAt DESC)

---

## Stage 4 — Performance

Issues:
High DB load

Solutions:
- Redis caching for frequent queries
- Pagination (limit + offset)
- Lazy loading for large datasets

---

## Stage 5 — notify_all Issue

Problem:
Synchronous notifications are slow and unreliable

Solution:
- Use message queue (Kafka / RabbitMQ)
- Async workers process notifications
- Improves reliability and scalability

---

## Stage 6 — Priority Inbox

Logic:

Priority:
placement > result > event

Weight:
placement = 3
result = 2
event = 1

Sort by:
priority DESC + createdAt DESC

Return top 10 notifications