# Security Specification & Test Payloads

## 1. Data Invariants
- A user document must have a non-empty name (`nome`) up to 60 characters and a valid hex color (`colore`).
- An exercise document in `/exercises` must have a non-empty name (`name`) up to 100 characters.
- A scheda in `/users/{userId}/schede` must have a non-empty name and a `blocchi` list.
- A log in `/users/{userId}/logs` must contain a valid `exerciseId` and `sessionId`.
- Malformed document IDs, oversized strings (>10000 chars), or extraneous properties are disallowed.

## 2. The Dirty Dozen Payloads (Negative Test Cases)
1. **Oversized User Name**: `nome` exceeding 60 characters.
2. **Missing User Name**: payload without `nome`.
3. **Invalid Hex Color**: `colore` with malicious script or non-color string.
4. **Oversized Exercise Name**: `name` exceeding 100 characters.
5. **Missing Exercise Name**: payload without `name`.
6. **Malicious Exercise Image**: binary blob payload exceeding size limits.
7. **Empty Scheda Name**: scheda creation with empty string name.
8. **Missing Scheda Blocchi**: scheda creation without `blocchi` array.
9. **Log Missing Exercise ID**: log created with missing or non-string `exerciseId`.
10. **Log Missing Session ID**: log created with missing or non-string `sessionId`.
11. **Path Variable Poisoning**: injecting URI encoded malicious string into document ID.
12. **Catch-All Denial**: attempting to read or write to arbitrary undeclared collections (e.g., `/admin`, `/secrets`).
