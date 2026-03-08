import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';

export interface LeaveType {
    LeaveTypeId: string;
    AccountId: string;
    Code: string;
    Name: string;
    Description?: string;
    MinIncrementMinutes: number;
    MinNoticeDays: number;
    CountsForAnnualLeaveAccrual: boolean;
    NESCategory?: string;
    IsPaid?: boolean;
    AccruesDuringEmployment?: boolean;
    IsCumulative?: boolean;
    HasLeaveLoading?: boolean;
    DefaultLeaveLoadingPct?: number;
    IsCashedOutAllowed?: boolean;
    MinBalancePostCashoutWeeks?: number;
    IsPaidOnTermination?: boolean;
    IsPublicHolidaySensitive?: boolean;
    IsShutdownEligible?: boolean;
    HasExcessThresholdFlag?: boolean;
    AllowsAdvanceLeaveFlag?: boolean;
    HasHalfPayModeFlag?: boolean;
    HasMinimumBlockSizeFlag?: boolean;
    ConvertibleToPersonalLeaveFlag?: boolean;
    ConvertibleToOtherTypesFlag?: boolean;
    IsTransferableBetweenEmployers?: boolean;
    HasAccrualExcludeFlags?: boolean;
    IsActive: boolean;
    IsDeleted: boolean;
    CreatedAt: string;
    ModifiedOn?: string;
    AddedById?: string;
    ModifiedById?: string;
}

export interface LeaveTypeCreate {
    AccountId: string;
    Name: string;
    Code: string;
    Description?: string;
    NESCategory?: string;
    IsPaid?: boolean;
    AccruesDuringEmployment?: boolean;
    IsCumulative?: boolean;
    HasLeaveLoading?: boolean;
    DefaultLeaveLoadingPct?: number;
    IsCashedOutAllowed?: boolean;
    MinBalancePostCashoutWeeks?: number;
    IsPaidOnTermination?: boolean;
    CountsForAnnualLeaveAccrual?: boolean;
    IsPublicHolidaySensitive?: boolean;
    IsShutdownEligible?: boolean;
    HasExcessThresholdFlag?: boolean;
    AllowsAdvanceLeaveFlag?: boolean;
    HasHalfPayModeFlag?: boolean;
    HasMinimumBlockSizeFlag?: boolean;
    ConvertibleToPersonalLeaveFlag?: boolean;
    ConvertibleToOtherTypesFlag?: boolean;
    IsTransferableBetweenEmployers?: boolean;
    HasAccrualExcludeFlags?: boolean;
    IsActive?: boolean;
}

export interface LeaveTypeUpdate {
    Name?: string;
    Code?: string;
    Description?: string;
    NESCategory?: string;
    IsPaid?: boolean;
    AccruesDuringEmployment?: boolean;
    IsCumulative?: boolean;
    CountsForAnnualLeaveAccrual?: boolean;
    HasLeaveLoading?: boolean;
    DefaultLeaveLoadingPct?: number;
    IsCashedOutAllowed?: boolean;
    MinBalancePostCashoutWeeks?: number;
    IsPaidOnTermination?: boolean;
    IsPublicHolidaySensitive?: boolean;
    IsShutdownEligible?: boolean;
    HasExcessThresholdFlag?: boolean;
    AllowsAdvanceLeaveFlag?: boolean;
    HasHalfPayModeFlag?: boolean;
    HasMinimumBlockSizeFlag?: boolean;
    ConvertibleToPersonalLeaveFlag?: boolean;
    ConvertibleToOtherTypesFlag?: boolean;
    IsTransferableBetweenEmployers?: boolean;
    HasAccrualExcludeFlags?: boolean;
    IsActive?: boolean;
    IsDeleted?: boolean;
}

// Leave Types Meta
export const getLeaveTypesMeta = async () => {
    const response = await api.get('/api/v1/leave-types/meta');
    return response.data;
};

export const useLeaveTypesMeta = () => {
    return useQuery({
        queryKey: ['leave-types', 'meta'],
        queryFn: getLeaveTypesMeta,
    });
};

export const getLeaveTypes = async () => {
    const response = await api.get<LeaveType[]>('/api/v1/leave-types/');
    return response.data;
};

export const getLeaveType = async (id: string) => {
    const response = await api.get<LeaveType>(`/api/v1/leave-types/${id}`);
    return response.data;
};

export const createLeaveType = async (data: LeaveTypeCreate) => {
    const response = await api.post<LeaveType>('/api/v1/leave-types/', data);
    return response.data;
};

export const updateLeaveType = async ({ id, data }: { id: string; data: LeaveTypeUpdate }) => {
    const response = await api.put<LeaveType>(`/api/v1/leave-types/${id}`, data);
    return response.data;
};

export const deleteLeaveType = async (id: string) => {
    await api.delete(`/api/v1/leave-types/${id}`);
};

export const deleteLeaveTypes = async (ids: string[]) => {
    const promises = ids.map(id => deleteLeaveType(id));
    return Promise.all(promises);
};

export const useLeaveTypes = () => {
    return useQuery({
        queryKey: ['leave-types'],
        queryFn: getLeaveTypes,
    });
};

export const useLeaveType = (id: string) => {
    return useQuery({
        queryKey: ['leave-types', id],
        queryFn: () => getLeaveType(id),
        enabled: !!id,
    });
};

export const useCreateLeaveType = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: createLeaveType,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['leave-types'] });
        },
    });
};

export const useUpdateLeaveType = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: updateLeaveType,
        onSuccess: (data, variables) => {
            // Update the cache for the specific leave type directly from PUT response
            queryClient.setQueryData(['leave-types', variables.id], data);

            // Update the list view with the new data
            queryClient.setQueryData<LeaveType[]>(['leave-types'], (old) =>
                old ? old.map(lt => lt.LeaveTypeId === variables.id ? data : lt) : []
            );
        },
    });
};

export const useDeleteLeaveType = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: deleteLeaveType,
        onMutate: async (id) => {
            await queryClient.cancelQueries({ queryKey: ['leave-types'] });
            const previousTypes = queryClient.getQueryData<LeaveType[]>(['leave-types']);

            if (previousTypes) {
                queryClient.setQueryData<LeaveType[]>(['leave-types'], (old) =>
                    old ? old.filter(type => type.LeaveTypeId !== id) : []
                );
            }

            return { previousTypes };
        },
        onError: (err, id, context) => {
            if (context?.previousTypes) {
                queryClient.setQueryData(['leave-types'], context.previousTypes);
            }
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ['leave-types'] });
        },
    });
};

export const useDeleteLeaveTypes = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: deleteLeaveTypes,
        onMutate: async (ids) => {
            await queryClient.cancelQueries({ queryKey: ['leave-types'] });
            const previousTypes = queryClient.getQueryData<LeaveType[]>(['leave-types']);

            if (previousTypes) {
                queryClient.setQueryData<LeaveType[]>(['leave-types'], (old) =>
                    old ? old.filter(type => !ids.includes(type.LeaveTypeId)) : []
                );
            }

            return { previousTypes };
        },
        onError: (err, ids, context) => {
            if (context?.previousTypes) {
                queryClient.setQueryData(['leave-types'], context.previousTypes);
            }
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ['leave-types'] });
        },
    });
};

// Leave Type Rules

export interface LeaveTypeRule {
    LeaveTypeRuleId: string;
    AccountId: string;
    LeaveTypeId: string;
    EmploymentTypeId: string;
    Code: string;
    Name: string;
    Description?: string;
    EffectiveDate?: string;
    Sequence?: number;
    IsActive: boolean;

    // Scope & Basics
    RuleType?: string;
    RuleValue?: string | number;
    EmploymentTypeScope?: string;

    // Accrual Core
    AccrualMethod: string;
    AccrualRate?: number;
    IncludePublicHolidays: boolean;
    DeductsOnPublicHoliday: boolean;

    // Public Holiday & Basis Fallback
    AccrualPHMode?: string;
    FallbackCountsPH?: boolean;
    BasisFallbackMode?: string;
    BaseWeeklyHoursOverride?: number;

    // Entitlement & Accrual Basis
    AnnualEntitlementWeeks?: number;
    AccrualBasis?: string;
    AccrualRatePerHour?: number;
    AccrualIncludeLeaveTypes?: string[];
    AccrualExcludeLeaveTypes?: string[];
    AccruesForCasual?: boolean;
    RoundingMode?: string;
    ShiftworkerQualifier?: string;

    // Special Accrual Modes
    HalfPayAccrualMode?: string;
    WorkersCompAccrualMode?: string;
    StandDownAccrualMode?: string;

    // Advance Leave
    AdvanceLeaveHandlingMode?: string;
    MaxNegativeHours?: number;
    AdvanceRecoveryMode?: string;

    // Loading & Award
    LoadingCalculationMode?: string;
    AwardRuleRef?: string;
    HalfPayMode?: string; // e.g. HALF_UNITS_HALF_CASH

    // Evidence
    ConversionRules?: string; // JSON string
    EvidenceRequiredFlag?: boolean;
    EvidenceRequirementMode?: string;
    EvidenceContentMode?: string;

    // Minimum Block Size
    MinimumBlockSizeMode?: string;
    MinimumBlockSizeHours?: number;

    // Cashout
    CashingOutMode?: string;
    MaxCashoutWeeksPerYear?: number;
    CashoutPeriodWindowMonths?: number;
    CashoutLimitMode?: string;

    // Shutdown & Excess
    ShutdownDirectionMode?: string;
    DefaultShutdownNoticeDays?: number;
    ExcessThresholdWeeks?: number;
    ExcessDirectionMode?: string;

    // Audit
    CreatedAt?: string;
    ModifiedOn?: string;
}

export interface LeaveTypeRuleCreate {
    AccountId: string;
    LeaveTypeId: string;
    EmploymentTypeId: string;
    Code: string;
    Name: string;
    Description?: string;
    EffectiveDate: string;
    Sequence?: number;
    IsActive: boolean;

    RuleType?: string;
    RuleValue?: string | number;
    EmploymentTypeScope?: string;

    AccrualMethod: string;
    AccrualRate?: number;
    IncludePublicHolidays: boolean;
    DeductsOnPublicHoliday: boolean;

    AccrualPHMode?: string;
    FallbackCountsPH?: boolean;
    BasisFallbackMode?: string;
    BaseWeeklyHoursOverride?: number;
    AnnualEntitlementWeeks?: number;
    AccrualBasis?: string;
    AccrualRatePerHour?: number;
    AccrualIncludeLeaveTypes?: string[];
    AccrualExcludeLeaveTypes?: string[];
    AccruesForCasual?: boolean;
    RoundingMode?: string;
    ShiftworkerQualifier?: string;
    HalfPayAccrualMode?: string;
    WorkersCompAccrualMode?: string;
    StandDownAccrualMode?: string;
    AdvanceLeaveHandlingMode?: string;
    MaxNegativeHours?: number;
    AdvanceRecoveryMode?: string;
    LoadingCalculationMode?: string;
    AwardRuleRef?: string;
    HalfPayMode?: string;
    ConversionRules?: string;
    EvidenceRequiredFlag?: boolean;
    EvidenceRequirementMode?: string;
    EvidenceContentMode?: string;
    MinimumBlockSizeMode?: string;
    MinimumBlockSizeHours?: number;
    CashingOutMode?: string;
    MaxCashoutWeeksPerYear?: number;
    CashoutPeriodWindowMonths?: number;
    CashoutLimitMode?: string;
    ShutdownDirectionMode?: string;
    DefaultShutdownNoticeDays?: number;
    ExcessThresholdWeeks?: number;
    ExcessDirectionMode?: string;
}

export interface LeaveTypeRuleUpdate {
    AccountId?: string;
    LeaveTypeId?: string;
    EmploymentTypeId?: string;
    Code?: string;
    Name?: string;
    Description?: string;
    EffectiveDate?: string;
    Sequence?: number;
    IsActive?: boolean;

    RuleType?: string;
    RuleValue?: string | number;
    EmploymentTypeScope?: string;

    AccrualMethod?: string;
    AccrualRate?: number;
    IncludePublicHolidays?: boolean;
    DeductsOnPublicHoliday?: boolean;

    AccrualPHMode?: string;
    FallbackCountsPH?: boolean;
    BasisFallbackMode?: string;
    BaseWeeklyHoursOverride?: number;
    AnnualEntitlementWeeks?: number;
    AccrualBasis?: string;
    AccrualRatePerHour?: number;
    AccrualIncludeLeaveTypes?: string[];
    AccrualExcludeLeaveTypes?: string[];
    AccruesForCasual?: boolean;
    RoundingMode?: string;
    ShiftworkerQualifier?: string;
    HalfPayAccrualMode?: string;
    WorkersCompAccrualMode?: string;
    StandDownAccrualMode?: string;
    AdvanceLeaveHandlingMode?: string;
    MaxNegativeHours?: number;
    AdvanceRecoveryMode?: string;
    LoadingCalculationMode?: string;
    AwardRuleRef?: string;
    HalfPayMode?: string;
    ConversionRules?: string;
    EvidenceRequiredFlag?: boolean;
    EvidenceRequirementMode?: string;
    EvidenceContentMode?: string;
    MinimumBlockSizeMode?: string;
    MinimumBlockSizeHours?: number;
    CashingOutMode?: string;
    MaxCashoutWeeksPerYear?: number;
    CashoutPeriodWindowMonths?: number;
    CashoutLimitMode?: string;
    ShutdownDirectionMode?: string;
    DefaultShutdownNoticeDays?: number;
    ExcessThresholdWeeks?: number;
    ExcessDirectionMode?: string;
}

// Field Metadata Types
export interface FieldMetadata {
    name: string;
    displayName: string;
    type: string;
    order: number;
    required?: boolean;
    hidden?: boolean;
    helpTextShort?: string;
    helpTextLong?: string;
    lookup?: {
        source: string;
        valueField: string;
        labelField: string;
        orderBy?: string;
        searchable?: boolean;
        filters?: Record<string, any>;
    };
}

export interface EntityMetadata {
    entity: string;
    primaryKey: string;
    fields: FieldMetadata[];
    actions?: {
        create?: boolean;
        update?: boolean;
        delete?: boolean;
    };
}

// Leave Type Rules Meta
export const getLeaveTypeRulesMeta = async () => {
    const response = await api.get('/api/v1/leave-type-rules/meta');
    return response.data;
};

export const useLeaveTypeRulesMeta = () => {
    return useQuery({
        queryKey: ['leave-type-rules', 'meta'],
        queryFn: getLeaveTypeRulesMeta,
    });
};

export const getLeaveTypeRules = async (leaveTypeId?: string) => {
    const url = leaveTypeId
        ? `/api/v1/leave-type-rules/?leave_type_id=${leaveTypeId}`
        : '/api/v1/leave-type-rules/';
    const response = await api.get<LeaveTypeRule[]>(url);
    return response.data;
};

export const getLeaveTypeRule = async (id: string) => {
    const response = await api.get<LeaveTypeRule>(`/api/v1/leave-type-rules/${id}`);
    return response.data;
};

export const createLeaveTypeRule = async (data: LeaveTypeRuleCreate) => {
    const response = await api.post<LeaveTypeRule>('/api/v1/leave-type-rules/', data);
    return response.data;
};

export const updateLeaveTypeRule = async ({ id, data }: { id: string; data: LeaveTypeRuleUpdate }) => {
    const response = await api.put<LeaveTypeRule>(`/api/v1/leave-type-rules/${id}`, data);
    return response.data;
};

export const deleteLeaveTypeRule = async (id: string) => {
    await api.delete(`/api/v1/leave-type-rules/${id}`);
};

export const deleteLeaveTypeRules = async (ids: string[]) => {
    const promises = ids.map(id => deleteLeaveTypeRule(id));
    return Promise.all(promises);
};

export const useLeaveTypeRules = (leaveTypeId?: string) => {
    return useQuery({
        queryKey: ['leave-type-rules', leaveTypeId],
        queryFn: () => getLeaveTypeRules(leaveTypeId),
    });
};

export const useLeaveTypeRule = (id: string) => {
    return useQuery({
        queryKey: ['leave-type-rules', 'detail', id],
        queryFn: () => getLeaveTypeRule(id),
        enabled: !!id,
    });
};

export const useCreateLeaveTypeRule = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: createLeaveTypeRule,
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['leave-type-rules'] });
            if (variables.LeaveTypeId) {
                queryClient.invalidateQueries({ queryKey: ['leave-type-rules', variables.LeaveTypeId] });
            }
        },
    });
};

export const useUpdateLeaveTypeRule = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: updateLeaveTypeRule,
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ['leave-type-rules'] });
            queryClient.invalidateQueries({ queryKey: ['leave-type-rules', data.LeaveTypeId] });
            queryClient.invalidateQueries({ queryKey: ['leave-type-rules', 'detail', data.LeaveTypeRuleId] });
        },
    });
};

export const useDeleteLeaveTypeRule = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: deleteLeaveTypeRule,
        onMutate: async (id) => {
            await queryClient.cancelQueries({ queryKey: ['leave-type-rules'] });

            // We need to update all potential lists since we don't know which one the rule belongs to easily
            // But typically we can just invalidate. For optimistic update, we'll try to update the active queries.

            queryClient.setQueriesData<{ LeaveTypeRuleId: string }[]>({ queryKey: ['leave-type-rules'] }, (old) => {
                if (!old) return [];
                return old.filter(rule => rule.LeaveTypeRuleId !== id);
            });

            return {}; // We're not storing previous state for rollback here for simplicity across multiple queries, relying on invalidate on error/settled
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ['leave-type-rules'] });
        },
    });
};

export const useDeleteLeaveTypeRules = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: deleteLeaveTypeRules,
        onMutate: async (ids) => {
            await queryClient.cancelQueries({ queryKey: ['leave-type-rules'] });

            queryClient.setQueriesData<{ LeaveTypeRuleId: string }[]>({ queryKey: ['leave-type-rules'] }, (old) => {
                if (!old) return [];
                return old.filter(rule => !ids.includes(rule.LeaveTypeRuleId));
            });

            return {};
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ['leave-type-rules'] });
        },
    });
};
