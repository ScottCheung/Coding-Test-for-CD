Accrual Processing & Process Period Management
UI Developer Brief (Scott)
Leave Engine — Core Admin UI (Phase E)
Version 1.0 | Date: 19 Dec 2025

1. Purpose
This brief extends the existing Core Config Admin UI pack. It defines the next admin screens and action forms to build: Process Period Groups, Process Periods, and Accrual Processing (LeaveProcessRuns). It also provides domain context (what accrual processing is) and the precise API contracts, UI behaviour, and UX recommendations.
2. Pre-reads and existing standards
Reuse the architecture and UI patterns already established in the initial Core Config Admin UI pack:
•	Meta-driven forms and grids: labels/types/required/order/helpTextShort/helpTextLong come from /meta.
•	Ant Design components, with the same 'Table → Drawer/Modal form' pattern for CRUD.
•	Help pattern: helpTextShort always visible under field; helpTextLong behind an info icon.
•	Never hard-code business rules in the UI. Surface configuration and backend messages (warnings/errors).
Reference docs already provided:
•	CoreConfig_Admin_UI_API_Spec_v0_1.docx (27 Nov 2025)
•	CoreConfig_Admin_UI_Appendices_v0_4_FULL.docx (27 Nov 2025)
•	OnBoarding Pack Initial Entities - V1.docx
3. Domain context
3.1 Process Period Group
A ProcessPeriodGroup represents the governing calendar for a tenant/account (e.g., monthly periods, fortnightly periods). It groups ProcessPeriods that form a continuous chain used by processing engines (Leave now, Payroll later).
3.2 Process Period
A ProcessPeriod is a discrete date range (StartDate → EndDate) inside a ProcessPeriodGroup. Each period has governance state flags that control whether engines are allowed to post results into that period.
3.3 State semantics
State	IsOpen / IsClosed	Meaning
OPEN	1 / 0	Processing engines are allowed to post for this period.
NOT_OPEN	0 / 0	Valid state. Engines must block processing for this period.
CLOSED	0 / 1	Immutable. Closed dominates. Once closed, cannot be opened again.

3.4 What is accrual processing?
Accrual processing is the controlled, auditable operation that posts leave accrual ledger entries for a given Account and ProcessPeriod. It calculates entitlement earned during the period (for each EmployeeAppointment and each accruable LeaveType) and posts results into the LeaveLedger. In v1, processing is run explicitly by an Admin operator.
3.5 What is a Leave Processing Run (LeaveProcessRun)?
A LeaveProcessRun is an audit record of a processing execution attempt. It captures: AccountId, ProcessPeriodId, IdempotencyKey, Status (RUNNING/SUCCESS/FAILED), timestamps, and SummaryJson. This record is the operator-facing unit of work for the Accrual Processing screen.
4. Permissions and roles
All screens in this brief are Admin-only in v1. The API enforces Admin via JWT roles; the UI should also hide navigation/routes when the current user lacks the Admin role.
•	Auth endpoints:
•	POST /api/auth/login (returns access_token)
•	GET  /api/auth/me (returns user + roles)
5. UI deliverables
Deliver three Admin screens/modules:
5.1 Process Period Groups (CRUD)
Create and maintain ProcessPeriodGroup records (admin configuration).
5.2 Process Periods (CRUD + lifecycle actions)
Create and maintain ProcessPeriod records within a group; run lifecycle transitions (open/not-open/close).
5.3 Accrual Processing (Action form + results)
Initiate a LeaveProcessRun for an Account + ProcessPeriod and display the results in an operator-friendly way.
6. API contracts
6.1 Process Period Groups (CRUD)
Use the same meta-driven CRUD pattern as the initial four entities. Verify exact route names in Swagger; typical routes:
•	GET  /api/v1/process-period-groups
•	POST /api/v1/process-period-groups
•	PUT  /api/v1/process-period-groups/{id}
•	GET  /api/v1/process-period-groups/{id}
•	GET  /api/v1/meta/process-period-groups
6.2 Process Periods (CRUD)
Typical routes (verify in Swagger):
•	GET  /api/v1/process-periods?processPeriodGroupId={id}
•	POST /api/v1/process-periods
•	PUT  /api/v1/process-periods/{id}
•	GET  /api/v1/process-periods/{id}
•	GET  /api/v1/meta/process-periods
6.3 Process Period lifecycle actions (shared governance)
These endpoints are implemented in the shared workforce-platform router and included in Leave Engine: 
Action	Endpoint	Notes
Open	POST /api/v1/process-periods/{id}/open	409 if CLOSED.
Set NOT_OPEN	POST /api/v1/process-periods/{id}/set-not-open	409 if CLOSED.
Close (roll forward)	POST /api/v1/process-periods/{id}/close	Closes current (forces IsOpen=0), opens next. If next missing, creates exactly one next period then opens it.

6.4 Accrual Processing Runs (LeaveProcessRun)
•	POST /api/v1/leave-processing-runs  (create-and-execute run; synchronous)
•	GET  /api/v1/leave-processing-runs/{id}  (fetch a run by id)
Request body (POST):
{
  "AccountId": "<guid>",
  "ProcessPeriodId": "<guid>",
  "IdempotencyKey": "<uuid>"
}
Response behaviour (POST):
•	201 Created: new run created and executed; response returns the final row (often SUCCESS or FAILED).
•	200 OK: idempotent repeat (same AccountId + ProcessPeriodId + IdempotencyKey); returns existing row and does NOT execute again.
•	409 Conflict: blocked by governance (period closed/not-open) or another run already RUNNING for same account/period.
•	422: invalid UUID/GUID input
Fields to render from the response:
•	Status, StartedAt, CompletedAt, ErrorMessage (if FAILED)
•	SummaryJson (JSON string) - parse and render
SummaryJson (v1) - render these prominently:
•	StartDate, EndDate
•	EmployeeAppointments, LeaveTypes, AccrualCalls
•	ErrorCount and Errors (first N)
•	LeaveTypeOrder: list of {LeaveTypeId, Code, Order} (admin-configured order for auditability)
Note: There is not yet a list endpoint for run history. If needed, it is tracked as a follow-up task.
7. UX guidance (make it beautiful)
7.1 Accrual Processing page layout
Recommended layout:
•	Left column: Run form (ProcessPeriod selector, Account selector if required, IdempotencyKey generator + copy button, Run button).
•	Right column: Run result panel (status badge, timestamps, summary cards).
•	Below: collapsible Details section with a JSON viewer and an Errors table.
Operator delight ideas:
•	Status badges for Period state (OPEN/NOT_OPEN/CLOSED) and Run state (SUCCESS/FAILED).
•	Inline governance hints: if period is NOT_OPEN/CLOSED, disable Run button and show why.
•	Progress indicator during execution: spinner + 'Executing accrual processing…' and an elapsed timer.
•	Copy buttons: IdempotencyKey, RunId; copy-to-clipboard on any key identifiers.
•	Summary cards: large-number tiles for EmployeeAppointments, LeaveTypes, AccrualCalls, ErrorCount.
•	LeaveTypeOrder table: show Code + Order; hide raw GUIDs by default and allow expand for IDs.
7.2 Process Periods UX
Recommended grid columns:
•	StartDate, EndDate
•	State badge (OPEN / NOT_OPEN / CLOSED)
•	ProcessPeriodGroup (name/code)
•	Actions: Open, Set Not-Open, Close
On Close: show a confirmation modal summarising what will happen:
•	The current period will be closed (cannot be undone).
•	The next period will be opened automatically.
•	If no next period exists, one will be created automatically and opened.
After Close: show a toast with OpenedNextProcessPeriodId and CreatedNextProcessPeriodId (if returned).
8. Error handling (must match API)
Handle explicitly (show server detail message):
•	409 ProcessPeriod is closed
•	409 ProcessPeriod is not open
•	409 Another LeaveProcessRun is already RUNNING for this account/period
•	422 Validation errors (bad UUID/GUID)
•	5xx Unexpected server error (show friendly message + allow retry)
9. Acceptance criteria
•	Operator can create ProcessPeriodGroups and ProcessPeriods using meta-driven forms.
•	Operator can transition periods via open/not-open/close; close rolls forward and creates next if missing.
•	Operator can start an accrual run and see final status + parsed SummaryJson.
•	Operator sees clear governance messaging for 409 conflicts and cannot run into closed/not-open periods accidentally.
•	UI supports idempotent retries: re-run with same IdempotencyKey returns existing result without re-executing.
10. Implementation notes
Backend remains the source of truth. The UI’s job is to initiate, display, and help the operator understand what happened.
If meta/help text is missing for any ProcessPeriod* fields, raise it so we enrich Meta.py rather than guessing in the UI.
