Core Configuration Admin UI – Appendices
Entities: Account, EmploymentType, LeaveType, LeaveTypeRule
Version: 0.4
Date: 27 November 2025
 
Appendix A – Field Tables (Schemas)
This appendix summarises the core fields for each entity as tables of name, type, requirement and purpose. It is not a substitute for the Pydantic schemas, but is intended as a human-readable reference for UI developers.
A.1 AccountSchema
Field	Type	Required	Description
AccountId	UUID	Response only	Unique identifier of the Account.
Code	string	Yes	Short unique code for the account (e.g. 'ACME').
Name	string	Yes	Full name of the employer or client.
CreatedAt	datetime	Response only	Timestamp when the account was created.
ModifiedOn	datetime	Response only	Timestamp when the account was last updated.
A.2 EmploymentTypeSchema
Field	Type	Required	Description
EmploymentTypeId	UUID	Response only	Unique identifier of the employment type.
AccountId	UUID	Yes	Account this employment type belongs to.
Code	string	Yes	Short code (e.g. 'FT38', 'CASUAL').
Name	string	Yes	Name of the employment type ('Full-Time 38h/week', etc.).
Description	string	No	Free-text description for HR use.
IsActive	boolean	Yes	Whether this employment type is currently in use.
CreatedAt	datetime	Response only	Creation timestamp.
ModifiedOn	datetime	Response only	Last modification timestamp.
A.3.1 LeaveTypeSchema – Identity & NES Core
Field	Type	Required	Description
LeaveTypeId	UUID	Response only	Unique identifier of the leave type.
AccountId	UUID	Yes	Account this leave type belongs to.
Code	string	Yes	Short code (e.g. 'AL', 'PL').
Name	string	Yes	Name shown to users (e.g. 'Annual Leave').
Description	string	No	Longer description or internal notes.
NESCategory	enum	No	NES classification (e.g. ANNUAL, PERSONAL, LONG_SERVICE, OTHER).
A.3.2 LeaveTypeSchema – Entitlement Behaviour
Field	Type	Required	Description
IsPaid	boolean	Yes	True if this leave is paid time off.
AccruesDuringEmployment	boolean	Yes	True if entitlement accrues over time while employed.
IsCumulative	boolean	Yes	True if unused entitlements carry forward between periods.
A.3.3 LeaveTypeSchema – Loading & Cashout
Field	Type	Required	Description
HasLeaveLoading	boolean	Yes	Whether a leave loading applies to this type (e.g. 17.5%).
DefaultLeaveLoadingPct	decimal	No	Default loading percentage, if applicable.
IsCashedOutAllowed	boolean	Yes	Whether this leave type may ever be cashed out instead of taken as time off.
MinBalancePostCashoutWeeks	decimal	No	Minimum number of weeks that must remain after a cashout.
A.3.4 LeaveTypeSchema – Termination & Advanced Flags
Field	Type	Required	Description
IsPaidOnTermination	boolean	Yes	Whether unused balance is paid out when employment ends.
IsPublicHolidaySensitive	boolean	No	If true, public holiday behaviour is important for this leave type and is configured in rules.
IsShutdownEligible	boolean	No	If true, this leave type may be used in shutdown scenarios.
HasExcessThresholdFlag	boolean	No	If true, excess leave thresholds can be defined for this type.
AllowsAdvanceLeaveFlag	boolean	No	If true, advance leave (negative balances) may be allowed for this type.
HasHalfPayModeFlag	boolean	No	If true, half-pay modes (stretching leave with half pay) may be used.
HasMinimumBlockSizeFlag	boolean	No	If true, minimum block size rules can apply to this leave type.
ConvertibleToPersonalLeaveFlag	boolean	No	If true, balances may be convertible to Personal Leave under defined rules.
ConvertibleToOtherTypesFlag	boolean	No	If true, balances may be convertible to other leave types.
IsTransferableBetweenEmployers	boolean	No	Whether this leave can be transferred between employers (rare, context-specific).
HasAccrualExcludeFlags	boolean	No	If true, rules may exist to exclude certain periods (e.g. unpaid leave) from accrual.
IsActive	boolean	Yes	Whether this leave type can currently be used in requests.
A.4.1 LeaveTypeRuleSchema – Scope & Basics
Field	Type	Required	Description
LeaveTypeRuleId	UUID	Response only	Unique identifier of the rule.
AccountId	UUID	Yes	Account that this rule applies to.
LeaveTypeId	UUID	Yes	LeaveType that this rule configures.
EmploymentTypeId	UUID	Yes	EmploymentType that this rule is for.
Name	string	Yes	Readable name for the rule (e.g. 'AL – FT38 – Standard').
Code	string	No	Optional short code to identify the rule.
Description	string	No	Longer explanation of what this rule does.
RuleType	string/enum	No	Optional rule classification used internally for grouping.
RuleValue	string/number	No	Optional value used in conjunction with RuleType for simple rules.
EffectiveDate	date	Yes	Date from which this rule is effective.
Sequence	integer	Yes	Ordering among multiple rules for the same scope.
EmploymentTypeScope	string/enum	No	Further qualifier for which employees this rule applies to (if any).
IsActive	boolean	Yes	Whether the rule is currently in force.
A.4.2 LeaveTypeRuleSchema – Accrual Core & Public Holidays
Field	Type	Required	Description
AccrualMethod	enum	Yes	High-level method used to accrue leave (e.g. per hour, per period).
AccrualRate	decimal	Conditional	Base rate used with AccrualMethod to derive entitlement.
IncludePublicHolidays	boolean	No	Top-level flag for including PH in accrual.
AccrualPHMode	enum	No	Detailed control of how public holidays affect accrual.
FallbackCountsPH	boolean	No	Whether fallback basis counts PH as ordinary hours.
DeductsOnPublicHoliday	boolean	No	Whether TAKEN days on a public holiday still deduct leave.
A.4.3 LeaveTypeRuleSchema – Basis Fallback
Field	Type	Required	Description
BasisFallbackMode	enum	No	Fallback strategy for daily basis minutes when roster/pattern is not available.
BaseWeeklyHoursOverride	decimal	No	Override for base weekly hours used in various calculations.
A.4.4 LeaveTypeRuleSchema – Entitlement & Basis
Field	Type	Required	Description
AnnualEntitlementWeeks	decimal	No	Number of weeks of entitlement per year (e.g. 4.0).
AccrualBasis	enum	Conditional	Basis used to calculate entitlements (per week, per hour, etc.).
AccrualRatePerHour	decimal	Conditional	Rate per hour worked where relevant.
AccrualIncludeLeaveTypes	array[string]	No	Leave types which count towards accrual.
AccrualExcludeLeaveTypes	array[string]	No	Leave types which do not count towards accrual.
RoundingMode	enum	No	How to round entitlements (e.g. up, down, nearest).
ShiftworkerQualifier	string/enum	No	Qualifier used to identify shiftworkers where special rules apply.
AccruesForCasual	boolean	No	True if this leave accrues for casual employees.
A.4.5 LeaveTypeRuleSchema – Special Accrual Modes
Field	Type	Required	Description
HalfPayAccrualMode	enum	No	How accrual behaves during half-pay arrangements.
WorkersCompAccrualMode	enum	No	How accrual behaves during workers compensation periods.
StandDownAccrualMode	enum	No	How accrual behaves during stand-down periods.
A.4.6 LeaveTypeRuleSchema – Advance Leave
Field	Type	Required	Description
AdvanceLeaveHandlingMode	enum	No	Whether advance leave (negative balances) is disallowed or allowed with agreement.
MaxNegativeHours	decimal	No	Floor for how negative an employee's balance can go (e.g. -16 hours).
AdvanceRecoveryMode	enum	No	How negative leave is recovered (e.g. future accrual only).
A.4.7 LeaveTypeRuleSchema – Loading & Award References
Field	Type	Required	Description
LoadingCalculationMode	enum	No	How leave loading is calculated for this rule.
AwardRuleRef	string	No	Reference to the award/agreement clause this rule is based on.
HalfPayMode	enum	No	Half-pay behaviour (e.g. HALF_UNITS_HALF_CASH).
A.4.8 LeaveTypeRuleSchema – Evidence & Conversion
Field	Type	Required	Description
ConversionRules	string/json	No	Structured rules that convert this leave to other types.
EvidenceRequiredFlag	boolean	No	True if evidence of some form is relevant for this leave type.
EvidenceRequirementMode	enum (NONE | SOFT | STRICT)	No	Whether evidence is not required, recommended (soft), or mandatory (strict).
EvidenceContentMode	enum	No	Which types of evidence are acceptable (comment only, attachment only, either, etc.).
A.4.9 LeaveTypeRuleSchema – Minimum Block Size
Field	Type	Required	Description
MinimumBlockSizeMode	enum (NONE | WARN_ONLY | STRICT)	No	How minimum block size rules are applied.
MinimumBlockSizeHours	decimal	No	Minimum number of hours per leave block.
A.4.10 LeaveTypeRuleSchema – Cashout
Field	Type	Required	Description
CashingOutMode	enum (DISALLOWED | PERMITTED)	No	Whether cashout is allowed under this rule.
MaxCashoutWeeksPerYear	decimal	No	Maximum number of weeks that can be cashed out in the defined window.
CashoutPeriodWindowMonths	integer	No	Length of the rolling window (in months) used to calculate total cashed-out leave.
CashoutLimitMode	enum (STRICT | SOFT)	No	STRICT blocks when caps are exceeded; SOFT allows override with a reason.
A.4.11 LeaveTypeRuleSchema – Shutdown & Excess Leave
Field	Type	Required	Description
ShutdownDirectionMode	enum	No	Direction rules used for shutdown periods (future mini-project).
DefaultShutdownNoticeDays	integer	No	Default notice period for shutdowns, in days.
ExcessThresholdWeeks	decimal	No	Weeks of leave balance above which an employee is considered to have 'excess' leave.
ExcessDirectionMode	enum	No	How excess leave should be handled (e.g. warn, direct leave).
 
Appendix B – JSON Request/Response Examples
This appendix provides JSON examples for create/read operations on each core entity. For LeaveTypeRule, a full schema example is included showing all known fields.
B.1 Account – Create & Read
POST /api/v1/accounts

Request:
{
  "Code": "ACME",
  "Name": "Acme Mining Pty Ltd",
}

Response (201 Created):
{
  "AccountId": "11111111-1111-1111-1111-111111111111",
  "Code": "ACME",
  "Name": "Acme Mining Pty Ltd",
  "IsActive": true,
  "CreatedAt": "2025-01-10T03:21:45Z",
  "ModifiedOn": "2025-01-10T03:21:45Z"
}
B.2 EmploymentType – Create & Read
POST /api/v1/employment-types

Request:
{
  "AccountId": "11111111-1111-1111-1111-111111111111",
  "Code": "FT38",
  "Name": "Full-Time 38h/week",
  "Description": "Standard full-time 38 hour per week contract",
  "IsActive": true
}

Response (201 Created):
{
  "EmploymentTypeId": "22222222-2222-2222-2222-222222222222",
  "AccountId": "11111111-1111-1111-1111-111111111111",
  "Code": "FT38",
  "Name": "Full-Time 38h/week",
  "Description": "Standard full-time 38 hour per week contract",
  "IsActive": true,
  "CreatedAt": "2025-01-11T02:00:00Z",
  "ModifiedOn": "2025-01-11T02:00:00Z"
}
B.3 LeaveType – Create & Read
POST /api/v1/leave-types

Request:
{
  "AccountId": "11111111-1111-1111-1111-111111111111",
  "Code": "AL",
  "Name": "Annual Leave",
  "Description": "Standard annual leave entitlement",
  "NESCategory": "ANNUAL",
  "IsPaid": true,
  "AccruesDuringEmployment": true,
  "IsCumulative": true,
  "HasLeaveLoading": true,
  "DefaultLeaveLoadingPct": 17.5,
  "IsCashedOutAllowed": true,
  "MinBalancePostCashoutWeeks": 2.0,
  "IsPaidOnTermination": true,
  "IsPublicHolidaySensitive": true,
  "IsShutdownEligible": true,
  "HasExcessThresholdFlag": true,
  "AllowsAdvanceLeaveFlag": true,
  "HasHalfPayModeFlag": true,
  "HasMinimumBlockSizeFlag": true,
  "ConvertibleToPersonalLeaveFlag": false,
  "ConvertibleToOtherTypesFlag": false,
  "IsTransferableBetweenEmployers": false,
  "HasAccrualExcludeFlags": true,
  "IsActive": true
}

Response (201 Created):
{
  "LeaveTypeId": "33333333-3333-3333-3333-333333333333",
  "AccountId": "11111111-1111-1111-1111-111111111111",
  "Code": "AL",
  "Name": "Annual Leave",
  "Description": "Standard annual leave entitlement",
  "NESCategory": "ANNUAL",
  "IsPaid": true,
  "AccruesDuringEmployment": true,
  "IsCumulative": true,
  "HasLeaveLoading": true,
  "DefaultLeaveLoadingPct": 17.5,
  "IsCashedOutAllowed": true,
  "MinBalancePostCashoutWeeks": 2.0,
  "IsPaidOnTermination": true,
  "IsPublicHolidaySensitive": true,
  "IsShutdownEligible": true,
  "HasExcessThresholdFlag": true,
  "AllowsAdvanceLeaveFlag": true,
  "HasHalfPayModeFlag": true,
  "HasMinimumBlockSizeFlag": true,
  "ConvertibleToPersonalLeaveFlag": false,
  "ConvertibleToOtherTypesFlag": false,
  "IsTransferableBetweenEmployers": false,
  "HasAccrualExcludeFlags": true,
  "IsActive": true,
  "CreatedAt": "2025-01-12T01:23:45Z",
  "ModifiedOn": "2025-01-12T01:23:45Z"
}
B.4 LeaveTypeRule – Create & Read (Full Schema)
POST /api/v1/leave-type-rules

Request (full schema example):
{
  "AccountId": "11111111-1111-1111-1111-111111111111",
  "LeaveTypeId": "33333333-3333-3333-3333-333333333333",
  "EmploymentTypeId": "22222222-2222-2222-2222-222222222222",

  "Name": "Annual Leave – Full-Time 38h – Standard",
  "Code": "AL-FT38-STD",
  "Description": "Standard 4 week annual leave rule for 38h full-time workers",

  "RuleType": null,
  "RuleValue": null,

  "AccrualMethod": "PER_HOUR_WORKED",
  "AccrualRate": null,
  "IncludePublicHolidays": true,
  "AccrualPHMode": "INCLUDE",
  "FallbackCountsPH": true,
  "DeductsOnPublicHoliday": false,

  "BasisFallbackMode": "WEEKDAY_5",
  "BaseWeeklyHoursOverride": 38,

  "EffectiveDate": "2025-01-01",
  "Sequence": 1,
  "EmploymentTypeScope": null,

  "AnnualEntitlementWeeks": 4.0,
  "AccrualBasis": "PER_HOUR",
  "AccrualRatePerHour": 0.0769,
  "AccrualIncludeLeaveTypes": null,
  "AccrualExcludeLeaveTypes": null,
  "RoundingMode": "NONE",
  "ShiftworkerQualifier": null,
  "AccruesForCasual": false,

  "HalfPayAccrualMode": null,
  "WorkersCompAccrualMode": null,
  "StandDownAccrualMode": null,

  "AdvanceLeaveHandlingMode": "ALLOW_WITH_AGREEMENT",
  "MaxNegativeHours": -16,
  "AdvanceRecoveryMode": "ALWAYS",

  "LoadingCalculationMode": null,
  "AwardRuleRef": null,
  "HalfPayMode": "HALF_UNITS_HALF_CASH",

  "ConversionRules": null,

  "EvidenceRequiredFlag": false,
  "EvidenceRequirementMode": "NONE",
  "EvidenceContentMode": "ANY",

  "MinimumBlockSizeMode": "WARN_ONLY",
  "MinimumBlockSizeHours": 4,

  "CashingOutMode": "PERMITTED",
  "MaxCashoutWeeksPerYear": 2.0,
  "CashoutPeriodWindowMonths": 12,
  "CashoutLimitMode": "SOFT",

  "ShutdownDirectionMode": null,
  "DefaultShutdownNoticeDays": null,
  "ExcessThresholdWeeks": 8.0,
  "ExcessDirectionMode": null,

  "IsActive": true
}

Response (201 Created):
{
  "LeaveTypeRuleId": "44444444-4444-4444-4444-444444444444",
  "AccountId": "11111111-1111-1111-1111-111111111111",
  "LeaveTypeId": "33333333-3333-3333-3333-333333333333",
  "EmploymentTypeId": "22222222-2222-2222-2222-222222222222",

  "Name": "Annual Leave – Full-Time 38h – Standard",
  "Code": "AL-FT38-STD",
  "Description": "Standard 4 week annual leave rule for 38h full-time workers",

  "RuleType": null,
  "RuleValue": null,

  "AccrualMethod": "PER_HOUR_WORKED",
  "AccrualRate": null,
  "IncludePublicHolidays": true,
  "AccrualPHMode": "INCLUDE",
  "FallbackCountsPH": true,
  "DeductsOnPublicHoliday": false,

  "BasisFallbackMode": "WEEKDAY_5",
  "BaseWeeklyHoursOverride": 38,

  "EffectiveDate": "2025-01-01",
  "Sequence": 1,
  "EmploymentTypeScope": null,

  "AnnualEntitlementWeeks": 4.0,
  "AccrualBasis": "PER_HOUR",
  "AccrualRatePerHour": 0.0769,
  "AccrualIncludeLeaveTypes": null,
  "AccrualExcludeLeaveTypes": null,
  "RoundingMode": "NONE",
  "ShiftworkerQualifier": null,
  "AccruesForCasual": false,

  "HalfPayAccrualMode": null,
  "WorkersCompAccrualMode": null,
  "StandDownAccrualMode": null,

  "AdvanceLeaveHandlingMode": "ALLOW_WITH_AGREEMENT",
  "MaxNegativeHours": -16,
  "AdvanceRecoveryMode": "ALWAYS",

  "LoadingCalculationMode": null,
  "AwardRuleRef": null,
  "HalfPayMode": "HALF_UNITS_HALF_CASH",

  "ConversionRules": null,

  "EvidenceRequiredFlag": false,
  "EvidenceRequirementMode": "NONE",
  "EvidenceContentMode": "ANY",

  "MinimumBlockSizeMode": "WARN_ONLY",
  "MinimumBlockSizeHours": 4,

  "CashingOutMode": "PERMITTED",
  "MaxCashoutWeeksPerYear": 2.0,
  "CashoutPeriodWindowMonths": 12,
  "CashoutLimitMode": "SOFT",

  "ShutdownDirectionMode": null,
  "DefaultShutdownNoticeDays": null,
  "ExcessThresholdWeeks": 8.0,
  "ExcessDirectionMode": null,

  "IsActive": true,
  "CreatedAt": "2025-01-13T00:00:00Z",
  "ModifiedOn": "2025-01-13T00:00:00Z"
}
 
Appendix C – Meta Field Groupings for UI Tabs
This appendix proposes how to group fields into tabs/sections for each entity, based on the meta definition (/meta endpoints). The exact implementation may adjust specific field orders, but the intent is to keep related concepts together and hide complexity behind sensible groupings.
C.1 Account – Single Section
The Account entity is intentionally simple. All editable fields (Code, Name, IsActive) can live in a single form section. Meta for accounts should mark Code and Name as required, IsActive as a boolean, and audit fields as read-only/hidden in standard forms.
C.2 EmploymentType – Single Section per Account
EmploymentType fields (AccountId, Code, Name, Description, IsActive) can also fit in a single form section. Meta for employment-types should ensure AccountId is a lookup to accounts, Code and Name are required, Description is optional, and IsActive is a boolean toggle.
C.3 LeaveType – Tab Grouping by Order
LeaveType is more complex and should be presented as a tabbed form. The meta definition for leave-types should expose all fields from LeaveTypeSchema with sensible order values. A recommended grouping using the order field is as follows:
Tab	Suggested Order Range	Fields (Examples)
Basics	< 50	AccountId, Code, Name, Description, IsActive
NES & Entitlement	50–69	NESCategory, IsPaid, AccruesDuringEmployment, IsCumulative
Loading & Cashout	70–89	HasLeaveLoading, DefaultLeaveLoadingPct, IsCashedOutAllowed, MinBalancePostCashoutWeeks
Termination & Advanced	90+	IsPaidOnTermination, IsPublicHolidaySensitive, IsShutdownEligible, HasExcessThresholdFlag, AllowsAdvanceLeaveFlag, HasHalfPayModeFlag, HasMinimumBlockSizeFlag, Convertible/Transfer flags, HasAccrualExcludeFlags
The actual order values should be set in the leave-types meta definition to match these ranges so the UI can group fields by order into the appropriate tabs.
C.4 LeaveTypeRule – Tab Grouping by Order
LeaveTypeRule has many fields and should be edited via a multi-tab drawer. The leave-type-rules meta already assigns order values to fields; this section provides a suggested mapping from order ranges to UI tabs. The UI can group fields by their meta order into these sections.
Tab	Suggested Order Range	Fields (Examples)
Scope & Basics	10–60	AccountId, LeaveTypeId, EmploymentTypeId, Code, Name, Description, EffectiveDate, Sequence, IsActive
Accrual & Public Holidays	70–130	AccrualMethod, AccrualRate, IncludePublicHolidays, AccrualPHMode, FallbackCountsPH, DeductsOnPublicHoliday
Basis Fallback	140–160	BasisFallbackMode, BaseWeeklyHoursOverride
Entitlement & Basis	170–220	AnnualEntitlementWeeks, AccrualBasis, AccrualRatePerHour, AccrualIncludeLeaveTypes, AccrualExcludeLeaveTypes, RoundingMode, AccruesForCasual, ShiftworkerQualifier
Special Accrual Modes	230–260	HalfPayAccrualMode, WorkersCompAccrualMode, StandDownAccrualMode
Advance Leave	270–300	AdvanceLeaveHandlingMode, MaxNegativeHours, AdvanceRecoveryMode
Loading & Award	310–340	LoadingCalculationMode, AwardRuleRef, HalfPayMode
Evidence & Conversion	350–380	ConversionRules, EvidenceRequiredFlag, EvidenceRequirementMode, EvidenceContentMode
Minimum Block Size	390–410	MinimumBlockSizeMode, MinimumBlockSizeHours
Cashout	420–450	CashingOutMode, MaxCashoutWeeksPerYear, CashoutPeriodWindowMonths, CashoutLimitMode
Shutdown & Excess Leave	460–500	ShutdownDirectionMode, DefaultShutdownNoticeDays, ExcessThresholdWeeks, ExcessDirectionMode
Versioning & Lifecycle	800+	Audit fields, CreatedAt, ModifiedOn (read-only)
The actual order values in the leave-type-rules meta should be adjusted or confirmed to align with these ranges. The UI can then group fields dynamically by order without hard-coding field names into tabs.
 
Appendix D – Meta-Based Field Help (helpTextShort / helpTextLong)
This appendix defines the standard pattern for providing field-level help to all UIs via the meta endpoints. The goal is to have a single source of truth in the backend for what each field means, so that any UI (internal or external) can display consistent explanations without hard-coding help text.
D.1 Meta Extensions
Each field entry in the meta definition for an entity (e.g. accounts, employment-types, leave-types, leave-type-rules) will be extended to include two optional properties:
•	helpTextShort – a one-line description suitable for always-visible inline help.
•	helpTextLong – a longer, multi-line explanation suitable for a tooltip, popover, or help drawer.
These properties are in addition to existing meta properties such as name, displayName, type, order, required, and lookup/options.
D.2 Example Meta Entry
Example meta entry for MinimumBlockSizeHours on LeaveTypeRule:
{
  "name": "MinimumBlockSizeHours",
  "displayName": "Minimum Block Size (hours)",
  "type": "number",
  "order": 395,
  "required": false,
  "helpTextShort": "Minimum hours per block of leave.",
  "helpTextLong": "MinimumBlockSizeHours is the smallest block of leave (in hours) that employees can request for this rule.\n\n"
                  "Why it matters:\n"
                  "- Prevents tiny fragments of leave that are hard to manage or may not comply with policy or awards.\n\n"
                  "Behaviour:\n"
                  "- If MinimumBlockSizeMode = STRICT, requests under this size are blocked with an error.\n"
                  "- If MinimumBlockSizeMode = WARN_ONLY, requests under this size are allowed but show a MIN_BLOCK_SIZE warning.\n\n"
                  "Example:\n"
                  "- If set to 4, a 2-hour annual leave request will trigger a warning or error depending on the mode."
}
D.3 UI Behaviour Standard
All Admin UIs should follow the same pattern when rendering fields from meta:
1.	Render displayName as the field label (e.g. Ant Design Form.Item label).
2.	Render helpTextShort (if present) as always-visible inline help under the field (e.g. Form.Item extra).
3.	Render an info icon next to the label when helpTextLong is present.
4.	On hover or click of the info icon, show helpTextLong in a tooltip, popover or drawer so users can read the full explanation.
If helpTextShort or helpTextLong are absent for a field, the UI must still render the field based on its type, required flag and other meta properties; help text is optional but strongly recommended for all fields that carry non-obvious business meaning.
D.4 Migration Strategy
Initially, some entities may not yet have helpTextShort/helpTextLong populated for every field. Admin UIs should be built assuming these properties will exist and should use them when available. During the migration period, UIs may fall back to generic help or omit the info icon where help text is not yet defined.
As the meta definitions are progressively enriched with help text for Account, EmploymentType, LeaveType and LeaveTypeRule, all UIs can automatically display richer context without code changes. This pattern should be treated as the gold standard for new entities going forward.
