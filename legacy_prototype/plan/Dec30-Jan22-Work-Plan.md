# Work Plan: Employee Leave Request Feature
**Duration:** December 30, 2024 - January 20, 2025 (15 working days)  
**Developer Level:** Mid-level Software Engineer  
**Time Buffer:** 30% included in all estimates

---

## Overview
Build the employee-facing Leave Request initiation experience as a wizard-style flow. This feature allows employees to create, preview, and submit leave requests with full support for overlap rules, substitution, shortfall plans, evidence requirements, and forecast-aware balance calculations.

**Key API Operations:** CREATE (POST), READ (GET), UPDATE (PUT/POST), PREVIEW (POST), SUBMIT (PUT status)

---

## Stage 1: Foundation, UI Design & Core CRUD

### Day 1 - Wednesday, Dec 31
**Feature:** Project Setup, API Integration & UI Design Foundation
- [ ] Quickly review UI requirement file and API patterns
- [ ] Verify all API endpoints in Swagger (https://platform.ezeas.com/docs):
  - `GET /api/v1/leave-requests` (List requests)
  - `POST /api/v1/leave-requests` (Create/Upsert draft)
  - `GET /api/v1/leave-requests/{id}` (Read single request)
  - `POST /api/v1/leave-requests/preview` (Preview balance impact)
  - `PUT /api/v1/leave-requests/{id}/status` (Submit/Status change)
  - `POST /api/v1/leave-requests/{id}/apply-shortfall-plan` (Apply plan)
  - `GET /api/v1/leave-types` (List leave types)
  - `GET /api/v1/leave-type-rules` (List leave type rules)
- [ ] Create TypeScript types for all API contracts
- [ ] Build API service layer with error handling
- [ ] Set up feature branch and folder structure
- [ ] **UI Design:** Create wireframes for 5-step wizard flow

**Deliverable:** Complete API integration layer with typed interfaces + Initial wireframes

---

### Day 2 - Monday, Jan 5
**Feature:** UI Design & Wizard Shell
- [ ] **UI Design:** Design wizard stepper component (5 steps)
- [ ] **UI Design:** Design "At a Glance" side panel layout
- [ ] **UI Design:** Design sticky action bar with contextual buttons
- [ ] Create main wizard container component
- [ ] Implement step navigation logic (Next/Back/Cancel)
- [ ] Build responsive layout structure
- [ ] Set up wizard state management (Zustand/Context)
- [ ] Add routing between wizard steps

**Deliverable:** Functional wizard shell with navigation + Complete UI designs

---

### Day 3 - Tuesday, Jan 6
**Feature:** CREATE - Draft Leave Request (Step 1: Leave Type Selection)
- [ ] **UI Design:** Design leave type picker component
- [ ] **UI Design:** Design policy chips and rule guidance display
- [ ] Build Leave Type picker component
- [ ] Integrate `GET /api/v1/leave-types` to fetch available types
- [ ] Integrate `GET /api/v1/leave-type-rules` for rule details
- [ ] Display leave type rules and guidance (helpTextShort)
- [ ] Show policy chips (Evidence required, Substitution enabled, etc.)
- [ ] Implement `POST /api/v1/leave-requests` to create DRAFT
- [ ] Auto-save draft when leave type is selected
- [ ] Update side panel with selected leave type info

**Deliverable:** Working leave type selection with draft creation (CREATE operation)

---

### Day 4 - Wednesday, Jan 7
**Feature:** UPDATE - Date Selection & Partial-Day Modes (Step 2)
- [ ] **UI Design:** Design date range picker with calendar visualization
- [ ] **UI Design:** Design partial-day mode selector UI
- [ ] Create date range picker component
- [ ] Show public holidays and zero-basis days on calendar
- [ ] Implement partial-day mode selector:
  - FULL_DAY (default)
  - HALF_DAY (when allowed by policy)
  - SPECIFIED_MINUTES (with hours/minutes input)
- [ ] Calculate and display computed minutes for each mode
- [ ] Integrate `POST /api/v1/leave-requests` to update draft (upsert pattern)
- [ ] Auto-save on date/mode changes (debounced)

**Deliverable:** Complete date selection with partial-day support (UPDATE operation)

---

### Day 5 - Thursday, Jan 8
**Feature:** UPDATE - Evidence & Notes Capture (Step 3)
- [ ] **UI Design:** Design evidence section layout
- [ ] **UI Design:** Design file upload placeholder UI
- [ ] Create evidence section with soft evidence (attestation + text)
- [ ] Add hard evidence upload placeholder ("Upload coming soon")
- [ ] Implement reason/notes text area with character count
- [ ] Add validation for required evidence fields
- [ ] Integrate `POST /api/v1/leave-requests` to save evidence data
- [ ] Show evidence requirements based on leave type rules
- [ ] Handle `EvidenceComment`, `HasAttachmentEvidence`, `EvidenceExternalRef` fields

**Deliverable:** Evidence and notes capture with validation (UPDATE operation)

---

## Stage 2: Preview, Advanced Features & UI Polish

### Day 6 - Friday, Jan 9
**Feature:** PREVIEW - Balance Calculation & Display (Step 4 - Part 1)
- [ ] **UI Design:** Design preview summary cards layout
- [ ] **UI Design:** Design day-by-day breakdown table
- [ ] Integrate `POST /api/v1/leave-requests/preview` endpoint
- [ ] Implement debounced auto-preview (triggers on data change)
- [ ] Add manual "Preview" button with loading states
- [ ] Display preview summary cards:
  - Requested Minutes
  - Available Minutes (forecast-aware)
  - Shortfall Minutes (if any)
- [ ] Build day-by-day breakdown table (`LeaveRequestPreviewRowSchema`)
- [ ] Show loading spinner for slow previews (>500ms)
- [ ] Display `BasisRuleMinutes`, `BasisFallbackMinutes`, `BasisTotalMinutes`

**Deliverable:** Working preview with balance calculations (PREVIEW operation)

---

### Day 7 - Monday, Jan 12
**Feature:** PREVIEW - Overlap, Substitution & Warnings (Step 4 - Part 2)
- [ ] **UI Design:** Design warning/error callout components
- [ ] **UI Design:** Design "Why is this blocked?" explainer drawer
- [ ] Display overlap outcomes (blocked/allowed/substituted)
- [ ] Show substitution warnings with clear explanations
- [ ] Render warnings as yellow callouts
- [ ] Render errors as red callouts (409/422 handling)
- [ ] Add "Why is this blocked?" explainer drawer
- [ ] Display all server-returned warnings/errors verbatim
- [ ] Handle overlap rule responses from `GET /api/v1/leave-type-overlap-rules`

**Deliverable:** Complete preview with governance rules display

---

### Day 8 - Tuesday, Jan 13
**Feature:** CREATE - Shortfall Plan Application
- [ ] **UI Design:** Design shortfall plan selection cards
- [ ] **UI Design:** Design child request display
- [ ] Display `ProposedShortfallPlans` when returned by preview
- [ ] Make shortfall plans selectable (radio buttons or cards)
- [ ] Implement "Apply Plan" button
- [ ] Integrate `POST /api/v1/leave-requests/{id}/apply-shortfall-plan`
- [ ] Handle `ApplyShortfallPlanRequestSchema` with IdempotencyKey
- [ ] Refresh preview after plan applied
- [ ] Display linked child DRAFT requests (`ApplyShortfallPlanChildResultSchema`)
- [ ] Add idempotency protection (disable button during API call)

**Deliverable:** Shortfall plan selection and application (CREATE child requests)

---

### Day 9 - Wednesday, Jan 14
**Feature:** SUBMIT - Status Transitions (Step 5)
- [ ] **UI Design:** Design final confirmation modal
- [ ] **UI Design:** Design success/error states
- [ ] Create final confirmation modal with request summary
- [ ] Generate and store IdempotencyKey (UUID)
- [ ] Show IdempotencyKey in "Advanced" expander
- [ ] Integrate `PUT /api/v1/leave-requests/{id}/status` with `Status=SUBMITTED`
- [ ] Handle `LeaveRequestStatusUpdateSchema` contract
- [ ] Handle 409 (duplicate idempotency key) as safe retry
- [ ] Handle 422 validation errors with clear messages
- [ ] Handle 409 insufficient balance error (`INSUFFICIENT_BALANCE` code)
- [ ] Show success confirmation and navigate to request details
- [ ] Disable editing after submission

**Deliverable:** Complete submission flow with idempotency (SUBMIT operation)

---

### Day 10 - Thursday, Jan 15
**Feature:** READ - Draft Management & Auto-Save
- [ ] Integrate `GET /api/v1/leave-requests/{id}` to load existing drafts
- [ ] Integrate `GET /api/v1/leave-requests` with filters (status, employeeAppointmentId)
- [ ] Implement auto-save every 30 seconds (debounced)
- [ ] Show save status indicator (Saving.../Saved/Error)
- [ ] Add "Save Draft" button for manual saves
- [ ] Handle concurrent edit conflicts gracefully
- [ ] Test draft persistence across page reloads
- [ ] Support pagination for list view (page, pageSize, sort params)

**Deliverable:** Complete draft save/load functionality (READ/UPDATE operations)

---

## Stage 3: Polish, Testing & Handoff

### Day 11 - Friday, Jan 16
**Feature:** Visual Polish & Balance Meter
- [ ] **UI Design:** Design animated balance meter component
- [ ] **UI Design:** Design calendar heatmap visualization
- [ ] Create animated balance meter component
- [ ] Show current vs forecast-at-start balance
- [ ] Display safe/at-risk/shortfall states with color coding
- [ ] Add calendar heatmap visualization for requested days
- [ ] Polish all UI components (spacing, typography, colors)
- [ ] Ensure consistent design system usage
- [ ] Add micro-animations for better UX
- [ ] Implement smooth transitions between wizard steps

**Deliverable:** Polished UI with visual enhancements

---

### Day 12 - Monday, Jan 19
**Feature:** Error Handling & Edge Cases
- [ ] Implement comprehensive error handling:
  - 409 overlap blocked → Show blocking message with overlap details
  - 409 period closed → Show governance message
  - 409 insufficient balance → Show balance shortfall details
  - 422 validation errors → Show field-level messages
  - 422 missing IdempotencyKey → Show clear error
  - Network failures → Show retry option
- [ ] Test edge cases:
  - Zero balance scenarios
  - Negative balance scenarios
  - Partial-day edge cases (FirstDayMode, LastDayMode)
  - Date range edge cases
  - Evidence requirement scenarios
- [ ] Ensure no silent failures
- [ ] Add proper error logging

**Deliverable:** Robust error handling for all scenarios

---

### Day 13 - Tuesday, Jan 20
**Feature:** Responsive Design & Accessibility
- [ ] Make wizard responsive for mobile/tablet
- [ ] Ensure keyboard navigation works throughout
- [ ] Add ARIA labels and roles
- [ ] Test with screen reader
- [ ] Optimize for touch interactions
- [ ] Fix any layout issues on small screens
- [ ] Test on different browsers (Chrome, Safari, Firefox)
- [ ] Ensure side panel collapses properly on mobile
- [ ] Test wizard stepper on small screens

**Deliverable:** Fully responsive and accessible wizard

---

### Day 14 - Wednesday, Jan 21
**Feature:** Integration Testing & Performance
- [ ] Test complete CRUD flow:
  - CREATE draft → UPDATE with data → PREVIEW → SUBMIT
- [ ] Test shortfall plan application flow
- [ ] Test substitution scenarios
- [ ] Test overlap blocking scenarios
- [ ] Test closed period blocking
- [ ] Test evidence requirements (soft and hard)
- [ ] Test partial-day modes (FULL_DAY, HALF_DAY, SPECIFIED_MINUTES)
- [ ] Test `RequestType` variations (NORMAL, CASHOUT, SHUTDOWN_DIRECTION, EXCESS_DIRECTION)
- [ ] Optimize preview debounce timing
- [ ] Reduce unnecessary API calls
- [ ] Test with slow network conditions
- [ ] Verify idempotency works correctly

**Deliverable:** Fully tested and optimized feature

---

### Day 15 - Thursday, Jan 22
**Feature:** Documentation & Handoff
- [ ] Add JSDoc comments to all components
- [ ] Document complex logic and business rules
- [ ] Create component usage examples
- [ ] Write user guide document
- [ ] Document known limitations (file upload placeholder, etc.)
- [ ] List future enhancements:
  - File upload for hard evidence
  - Advanced leave request types (cashout, shutdown)
  - Bulk leave request creation
  - Leave request templates
- [ ] Create pull request with detailed description
- [ ] Prepare demo for stakeholders
- [ ] Record demo video showing complete flow

**Deliverable:** Complete documentation and PR ready for review

---

## API Endpoints Reference

### Leave Requests (Core)
| Method | Endpoint | Purpose |
|--------|----------|---------|
| `POST` | `/api/v1/leave-requests` | Create/Upsert draft (uses `LeaveRequestHeaderRequestSchema`) |
| `GET` | `/api/v1/leave-requests` | List requests (supports filters: status, employeeAppointmentId, dateFrom, dateTo) |
| `GET` | `/api/v1/leave-requests/{id}` | Get single request |
| `POST` | `/api/v1/leave-requests/preview` | Preview balance impact (`LeaveRequestPreviewRequestSchema`) |
| `PUT` | `/api/v1/leave-requests/{id}/status` | Submit/change status (`LeaveRequestStatusUpdateSchema`) |
| `POST` | `/api/v1/leave-requests/{id}/apply-shortfall-plan` | Apply shortfall plan |
| `GET` | `/api/v1/leave-requests/{id}/rows` | Get request rows (day-by-day breakdown) |
| `GET` | `/api/v1/leave-requests/{id}/ledger` | Get posted ledger entries |
| `POST` | `/api/v1/leave-requests/{id}/reopen` | Reopen request (set status=DRAFT) |

### Leave Types & Rules
| Method | Endpoint | Purpose |
|--------|----------|---------|
| `GET` | `/api/v1/leave-types` | List leave types |
| `GET` | `/api/v1/leave-types/{id}` | Get leave type details |
| `GET` | `/api/v1/leave-type-rules` | List leave type rules |
| `GET` | `/api/v1/leave-type-overlap-rules` | List overlap rules |

### Supporting Data
| Method | Endpoint | Purpose |
|--------|----------|---------|
| `GET` | `/api/v1/public-holidays` | List public holidays |
| `GET` | `/api/v1/employee-appointments` | List employee appointments |
| `GET` | `/api/auth/me` | Get current user info |

---

## Key Schema Contracts

### LeaveRequestHeaderRequestSchema (Create/Update)
```typescript
{
  LeaveRequestId?: string | null;
  EmployeeAppointmentId: string;
  LeaveTypeId: string;
  DateFrom: string; // YYYY-MM-DD
  DateTo: string; // YYYY-MM-DD
  StartTime?: string | null; // HH:MM:SS
  EndTime?: string | null;
  FirstDayMinutes?: number | null;
  LastDayMinutes?: number | null;
  FirstDayMode?: "FULL_DAY" | "HALF_DAY" | "SPECIFIED_MINUTES" | null;
  LastDayMode?: "FULL_DAY" | "HALF_DAY" | "SPECIFIED_MINUTES" | null;
  Status: "DRAFT" | "SUBMITTED";
  ReasonText?: string | null;
  IdempotencyKey?: string | null;
  RequestType?: "NORMAL" | "CASHOUT" | "SHUTDOWN_DIRECTION" | "EXCESS_DIRECTION" | null;
  BasisType?: "BASE_HOURS" | "ROSTER" | "MANUAL_HOURS" | null;
  IsHalfPayFlag?: boolean | null;
  IsAdvanceLeaveFlag?: boolean | null;
  SignedAgreementRef?: string | null;
  EvidenceComment?: string | null;
  HasAttachmentEvidence?: boolean | null;
  EvidenceExternalRef?: string | null;
  EvidenceOverrideReason?: string | null;
  CashoutOverrideReason?: string | null;
  IsDirectedFlag?: boolean | null;
}
```

### LeaveRequestStatusUpdateSchema (Submit)
```typescript
{
  Status: "DRAFT" | "SUBMITTED" | "APPROVED" | "REJECTED";
  IdempotencyKey?: string | null; // Required when Status='SUBMITTED'
}
```

### ApplyShortfallPlanRequestSchema
```typescript
{
  IdempotencyKey: string; // UUID, required
  PlanId?: string | null;
  Segments: Array<{
    LeaveTypeId: string;
    DateFrom: string;
    DateTo: string;
    Minutes: number;
  }>;
}
```

---

## Key Deliverables Checklist

### Must Have (V1)
- [ ] **CREATE:** Draft leave request creation via `POST /api/v1/leave-requests`
- [ ] **READ:** Load existing drafts via `GET /api/v1/leave-requests/{id}`
- [ ] **UPDATE:** Edit draft (leave type, dates, evidence, notes)
- [ ] **PREVIEW:** Forecast-aware balance calculation via `POST /api/v1/leave-requests/preview`
- [ ] **SUBMIT:** Idempotent submission via `PUT /api/v1/leave-requests/{id}/status`
- [ ] Wizard navigation (5 steps with stepper)
- [ ] Partial-day modes (FULL_DAY, HALF_DAY, SPECIFIED_MINUTES)
- [ ] Overlap and substitution handling
- [ ] Shortfall plan display and application
- [ ] Evidence requirement capture (EvidenceComment, HasAttachmentEvidence, EvidenceExternalRef)
- [ ] Comprehensive error handling (409, 422, network errors)
- [ ] Auto-save functionality (every 30 seconds)
- [ ] Responsive design (mobile, tablet, desktop)
- [ ] Accessibility compliance (ARIA, keyboard navigation, screen reader)
- [ ] Complete UI designs for all components

---

## Risk Mitigation

### Potential Blockers
1. **API endpoints not ready** → Work with mock data, coordinate with backend team
2. **Complex overlap rules** → Start with simple cases, add complexity incrementally
3. **Preview performance issues** → Implement caching, optimize debounce timing
4. **Evidence upload not ready** → Use placeholder UI, prepare for future integration
5. **Partial-day mode complexity** → Test thoroughly with different scenarios

### Escalation Points
- **End of Day 2:** If API contracts don't match design docs or Swagger
- **End of Day 5:** If evidence requirements are unclear
- **End of Day 8:** If preview integration has major issues
- **End of Day 12:** If critical bugs block testing
- **End of Day 14:** If integration tests reveal fundamental issues

---

## Success Criteria
✅ Employee can CREATE a DRAFT leave request via API  
✅ Employee can READ and load existing drafts  
✅ Employee can UPDATE draft with dates, evidence, and notes  
✅ PREVIEW shows accurate forecast-aware balance from API  
✅ All warnings/errors from backend are displayed clearly  
✅ Substitution and overlap outcomes are explained  
✅ Shortfall plans can be applied successfully (CREATE child requests)  
✅ SUBMIT uses IdempotencyKey correctly per API contract  
✅ All error cases are handled gracefully (409, 422, network)  
✅ UI is responsive and accessible  
✅ Complete UI designs delivered for all components  
✅ Auto-save works reliably  
✅ Partial-day modes work correctly  

---

## Notes
- **API Documentation:** https://platform.ezeas.com/docs
- **CRUD Focus:** Each feature is organized around API operations
- **UI Design:** Design work integrated into development days
- **Testing:** Continuous testing throughout, not just at the end
- **Communication:** Daily standup and progress updates
- **Evidence Upload:** Placeholder only in V1, full implementation in V2
