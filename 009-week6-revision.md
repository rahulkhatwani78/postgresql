# Week 6 Revision Notes: PostgreSQL Advanced Concepts

This document summarizes the key concepts covered in files 006, 007, and 008, including query optimization, connection pooling, pagination techniques, database concurrency, isolation levels, and MVCC.

## 1. PostgreSQL Optimization & Connection Pooling

### EXPLAIN ANALYZE
- **`EXPLAIN`**: Shows the database planner's execution plan for a query (how tables are scanned, join algorithms used).
- **`EXPLAIN ANALYZE`**: Actually executes the query, providing both estimated costs and actual execution times.
- **Key Metrics**: Execution Time, Planning Time, Cost (`startup_cost..total_cost`), Rows, and Loops.

### Query Optimization Best Practices
1. **Strategic Indexing**: Index frequently used columns in `WHERE`, `JOIN`, `ORDER BY`, and `GROUP BY`. Avoid over-indexing as it slows down writes.
2. **Retrieve Necessary Data**: Avoid `SELECT *`.
3. **Pagination**: Use `LIMIT` and `OFFSET` or cursors for large datasets.
4. **Avoid Functions on Indexed Columns**: Bypasses standard indexes; functional indexes can be considered instead.
5. **Optimize JOINs**: Prefer `INNER JOIN` over `OUTER JOIN`.
6. **Analyze Query Plans**: Routinely use `EXPLAIN ANALYZE` to find sequential scans and other bottlenecks.

### Connection Pooling
- **Purpose**: Connecting to a database is expensive. Pooling maintains active connections in memory, eliminating the overhead of repeated connections.
- **Benefits**: Improved performance, scalability (handling thousands of concurrent requests with fewer physical database connections), and better resource management.
- **Node.js `pg` Pool**: Allows setting properties like `max` (maximum connections) and `idleTimeoutMillis`. Surplus queries queue up when max connections are reached.

---

## 2. Pagination Techniques

Pagination divides a large dataset into smaller, manageable chunks.

### Offset-Based Pagination
- Uses `LIMIT` (max rows) and `OFFSET` (rows to skip). 
- **Offset Formula**: `OFFSET = (page_number - 1) * page_size`
- **Pros**: Easy to implement, supports random access (jump to any page), stateless.
- **Cons**: Performance degrades significantly with large offsets (the database has to count and skip rows), prone to data anomalies (duplicates or missing rows if data changes).

### Keyset / Cursor-Based Pagination
- Remembers the last value of sorted column(s) and fetches records *after* that value using a `WHERE` clause.
- **Pros**: Extremely fast and consistent performance regardless of depth (leverages indexes directly), consistent data (not affected by data changes).
- **Cons**: No random access (only next/prev), requires careful handling of cursors/indexes (often needs multi-column sorting for tie-breakers).
- **Recommendation**: Best for infinite scrolling, large datasets, and APIs where random access is not needed.

---

## 3. Database Concurrency, Isolation Levels, and MVCC

### Locks and Deadlocks
- **Locks**: Mechanisms to ensure data integrity. E.g., Transaction A locks a row to prevent Transaction B from editing it simultaneously.
- **Deadlock**: Two or more transactions waiting on each other's locks, creating a circular dependency. The DBMS detects this and automatically aborts one transaction (the "victim").

### Isolation Levels
Isolation prevents read phenomena (Dirty Read, Non-Repeatable Read, Phantom Read).
1. **Read Uncommitted**: Can see uncommitted data (acts as Read Committed in PostgreSQL).
2. **Read Committed**: **(PostgreSQL Default)** Can only see data committed before the query started. Prevents dirty reads.
3. **Repeatable Read**: Ensures reading the same row twice in a transaction yields the same result. Prevents non-repeatable reads.
4. **Serializable**: Strictest. Simulates sequential execution of transactions. Prevents dirty, non-repeatable, and phantom reads.

### MVCC (Multiversion Concurrency Control)
- **Problem**: Traditional aggressive locking blocks operations (readers block writers, writers block readers).
- **MVCC Solution**: **Readers never block writers, and writers never block readers**.
- PostgreSQL achieves this by maintaining multiple versions of a row rather than overwriting it immediately.
- **System Columns**:
  - `xmin`: Transaction ID that inserted/created the row.
  - `xmax`: Transaction ID that deleted or updated the row (0 if none).
  - `ctid`: Physical location.
- **How it Works**: An `UPDATE` marks the old row as "dead" (`xmax` set) and inserts a new "live" row (`xmin` set to new TXID). Transactions see the database state corresponding to their snapshot.
- **VACUUM**: Cleans up "dead tuples" left by `UPDATE` and `DELETE` on disk to prevent table bloat. Usually managed by the `autovacuum` daemon.
