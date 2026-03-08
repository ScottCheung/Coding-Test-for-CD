Leave Request — Employee Initiation
UI Developer Brief 
Leave Engine — Employee Experience (V1)
Version 1.0 | Date: 19 Dec 2025

1. Purpose
This brief defines the primary employee-facing Leave Request initiation experience. It must set a new UX standard: fast, guided, safe (governance-aware), and deeply informative. The form must handle the capabilities we have built: overlap governance, substitution (sick while on AL), shortfall plan suggestions and apply-plan, evidence requirements, partial-day modes, and forecast-aware balance evaluation.
2. Pre-reads and existing standards
Reuse the established UI patterns from the Core Config Admin UI pack and initial entity onboarding. Do not reinvent:
•	Meta-driven form rendering (labels/types/required/order/helpTextShort/helpTextLong).
•	Consistent GUID-as-string handling in UI and API payloads.
•	Error handling: surface server 'detail' messages; do not guess business rules client-side.
•	API contract discipline: PascalCase payloads where returned by backend; do not silently rename keys.
Reference docs already provided to Scott (do not repeat here):
•	CoreConfig_Admin_UI_API_Spec_v0_1.docx
•	CoreConfig_Admin_UI_Appendices_v0_4_FULL.docx
•	OnBoarding Pack Initial Entities - V1.docx
3. Domain context (employee view)
3.1 What an employee is trying to do
An employee is requesting time away from work. The system must help them choose the correct leave type, select dates (and partial-day options), understand the impact to balance (forecast-aware), understand evidence requirements, and avoid invalid submissions (overlap rules, closed periods, etc.).
3.2 Key objects (mental model)
•	LeaveRequest: the employee’s request (starts as DRAFT; then SUBMITTED; then APPROVED/REJECTED/etc.).
•	LeaveType: the category of leave (Annual Leave, Personal Leave, etc.). Rules are defined via LeaveTypeRule.
•	Overlap rules: determine whether overlapping leave requests are blocked, allowed, or substituted (e.g., PL over AL).
•	Shortfall plans: when balance is insufficient, preview may propose a plan that uses fallback leave types; applying the plan creates child leave requests linked to the parent.
•	Evidence: some leave types and circumstances require supporting evidence; the UI must guide the user and capture it cleanly.
4. Roles and permissions
This screen is for the EMPLOYEE experience. Users may have multiple roles (Employee + Approver + Admin), but this module should render the employee workflow. Backend authorization remains the source of truth.
•	Role claims are provided via GET /api/auth/me.
5. UX principles (non-negotiable)
•	Guided, not intimidating: the user should always know what to do next.
•	Immediate feedback: preview early; warn clearly; block only when necessary.
•	Explain ‘why’: when something is blocked or warned, provide a short reason and an optional deeper explanation (helpTextLong).
•	Safety first: never allow submission into closed periods or invalid overlaps (server-enforced). UI should pre-warn but must handle 409/422 correctly.
•	Beautiful operator-grade clarity: balances, forecasts, and rule outcomes must be readable at a glance.
6. Deliverable
Dev will deliver the Employee Leave Request initiation flow as a wizard-style experience:
•	Step 1: Choose Leave Type + display rule guidance (helpTextShort + key rule highlights).
•	Step 2: Select dates + partial-day modes (Full/Half/Specified minutes where enabled).
•	Step 3: Provide context (reason/notes) and evidence (if required).
•	Step 4: Preview results (forecast-aware) including warnings, substitution, shortfall plans; optionally apply plan.
•	Step 5: Submit (idempotent) with final confirmation screen.
7. Screen and component specification
7.1 Leave Request Wizard layout
•	Top: Stepper (Leave Type → Dates → Evidence/Notes → Preview → Submit).
•	Right side panel: ‘At a glance’ cards (Selected Leave Type, Date range, Requested minutes/days, Forecast balance impact).
•	Bottom: Sticky action bar (Back / Next / Save Draft / Preview / Submit).
7.2 Field behaviours (meta-driven where possible)
Where the LeaveRequest fields are available via /meta, render them using the same conventions as admin forms. However, the employee experience must be curated: hide raw GUID fields; provide pickers for LeaveType, Appointment, etc.
7.3 Partial-day modes
Mode	Meaning	UI
FULL_DAY	Uses the basis minutes for that day.	Default selection; show computed minutes.
HALF_DAY	Uses half the basis minutes (computed).	Enable when policy allows; show computed minutes.
SPECIFIED_MINUTES	User enters hours/minutes; engine stores minutes.	Numeric input + validation; show conversion.

7.4 Evidence capture (soft vs hard)
Evidence requirements vary by LeaveTypeRule and circumstance. The UI must support two broad categories:
•	Soft evidence: user attestation + free text (e.g., ‘I confirm…’) captured in the request.
•	Hard evidence: uploaded documents or references (medical certificate, statutory declaration).
If upload capability is not yet implemented, still design the UI section now with a placeholder ‘Upload coming soon’ and capture a ‘EvidenceProvided = No’ + ‘EvidenceNotes’ fields if available. Do not block submission unless the backend blocks it.
8. Preview (the heart of the experience)
Preview must be easy to read and must clearly show: calculated minutes, forecast-aware balance impact, warnings/errors, overlap outcomes, substitution outcomes, and shortfall plans if the request exceeds available balance.
8.1 Preview call pattern
•	Trigger preview automatically when date range and leave type are set (debounced), and again on explicit ‘Preview’ click.
•	Preview must be repeatable and fast; show a spinner + elapsed time if preview takes > 500ms.
•	Always render server-returned warnings/errors verbatim (no silent remapping).
8.2 What to render in Preview
•	Summary cards: Requested Minutes, Available Minutes (forecast-aware), Shortfall Minutes (if any).
•	Day-by-day breakdown: each day row shows basis minutes, taken minutes, and flags (public holiday, zero-basis day).
•	Overlap outcomes: blocked vs allowed vs substitution; include ‘why’ text.
•	Substitution warnings: e.g. ‘Personal Leave will substitute over Annual Leave’ (when applicable).
•	ProposedShortfallPlans: show as selectable plans when present (each plan includes segments by LeaveType).
8.3 Apply shortfall plan (creates child leave requests)
If ProposedShortfallPlans are returned, provide an ‘Apply Plan’ action:
•	User selects a plan → UI calls apply-plan endpoint → backend creates linked child DRAFT leave requests.
•	UI must then refresh the parent LeaveRequest preview and show the child requests as linked items.
•	Idempotency: if the user clicks apply twice, backend is repeat-safe; UI should disable the button during call and show final result.
9. Submission & status transitions
Leave Requests have a canonical status transition endpoint. The UI must follow the contract exactly.
•	Canonical status route:
•	PUT /api/v1/leave-requests/{id}/status
•	Key rules:
•	Submission requires IdempotencyKey (UUID). Missing key on SUBMITTED returns 422; duplicate key returns 409.
•	Reject is header-only; Reopen via status=DRAFT; Approve posts ledger idempotently.
•	Only allow Apply Plan / editing while DRAFT.
•	UI behaviour at submit:
•	Require a final confirmation modal summarising leave type, dates, minutes, and any evidence requirement.
•	Generate and store an IdempotencyKey for submit; show it in an ‘Advanced’ expander for support/debug.
•	If submit returns 409 (duplicate), treat as safe retry and reload the request state.
10. API endpoints (verify in Swagger)
Exact endpoint paths may evolve; always confirm in Swagger. The UI must be resilient to payloads returned by backend.
•	Leave Requests CRUD: GET/POST/PUT /api/v1/leave-requests (DRAFT editing).
•	Preview: POST /api/v1/leave-requests/preview (or /{id}/preview depending on current router).
•	Apply shortfall plan: POST /api/v1/leave-requests/{id}/apply-shortfall-plan (confirm exact route in Swagger).
•	Status changes: PUT /api/v1/leave-requests/{id}/status (canonical).
11. Error handling (must be polished)
Handle these cases explicitly:
•	409 overlap blocked: show a blocking message and highlight the overlapping request range.
•	409 period closed/not-open: show governance message and instruct user to contact admin.
•	422 validation errors: show field-level messages.
•	Preview warnings: show as yellow callouts; errors as red callouts; do not hide.
12. UI ‘delight’ ideas (operator-grade UX for employees)
•	Balance meter: current vs forecast-at-start; show safe/at-risk/shortfall states.
•	Calendar heatmap: highlight requested days; show public holidays and zero-basis days.
•	Inline policy chips: e.g. ‘Evidence required’, ‘Substitution may occur’, ‘Shortfall plan available’.
•	Explainers: ‘Why is this blocked?’ link opens a drawer with rule explanation (from helpTextLong).
•	Save Draft always visible; auto-save optional but recommended.
13. Acceptance criteria
•	Employee can create a DRAFT leave request, edit it, and submit it via the canonical status endpoint with IdempotencyKey.
•	Preview shows forecast-aware balance impact, and all warnings/errors returned by backend are rendered clearly.
•	Substitution and overlap outcomes are shown with explicit messaging.
•	If ProposedShortfallPlans are returned, user can select and apply a plan, resulting in linked child DRAFT requests being created and displayed.
•	Evidence requirements are surfaced clearly and captured (or placeholdered) without breaking flow.
