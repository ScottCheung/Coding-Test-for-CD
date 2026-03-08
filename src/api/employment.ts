import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';

export interface EmploymentType {
    EmploymentTypeId: string;
    AccountId?: string;
    Code: string;
    Name: string;
    Description?: string;
    IsActive: boolean;
    IsDeleted: boolean;
    CreatedAt: string;
}

export interface EmploymentTypeCreate {
    AccountId: string;
    Code: string;
    Name: string;
    Description?: string;
    IsActive: boolean;
    IsDeleted?: boolean;
}

export interface EmploymentTypeUpdate {
    AccountId?: string;
    Code?: string;
    Name?: string;
    Description?: string;
    IsActive?: boolean;
    IsDeleted?: boolean;
}

export interface EmploymentTypeMeta {
    fields: Array<{
        name: string;
        displayName: string;
        type: string;
        required: boolean;
        order: number;
        options?: any[];
    }>;
}

// API Functions
export const getEmploymentTypesMeta = async () => {
    const response = await api.get<EmploymentTypeMeta>('/api/v1/employment-types/meta');
    return response.data;
};

export const getEmploymentTypes = async () => {
    const response = await api.get<EmploymentType[]>('/api/v1/employment-types/');
    return response.data;
};

export const getEmploymentType = async (id: string) => {
    const response = await api.get<EmploymentType>(`/api/v1/employment-types/${id}`);
    return response.data;
};

export const createEmploymentType = async (data: EmploymentTypeCreate) => {
    const response = await api.post<EmploymentType>('/api/v1/employment-types/', data);
    return response.data;
};

export const updateEmploymentType = async ({ id, data }: { id: string; data: EmploymentTypeUpdate }) => {
    const response = await api.put<EmploymentType>(`/api/v1/employment-types/${id}`, data);
    return response.data;
};

export const deleteEmploymentType = async (id: string) => {
    const response = await api.delete(`/api/v1/employment-types/${id}`);
    return response.data;
};

export const deleteEmploymentTypes = async (ids: string[]) => {
    // For multiple deletions, call the single delete endpoint for each ID
    const promises = ids.map(id => deleteEmploymentType(id));
    return Promise.all(promises);
};

// React Query Hooks
export const useEmploymentTypesMeta = () => {
    return useQuery({
        queryKey: ['employment-types', 'meta'],
        queryFn: getEmploymentTypesMeta,
    });
};

export const useEmploymentTypes = () => {
    return useQuery({
        queryKey: ['employment-types'],
        queryFn: getEmploymentTypes,
    });
};

export const useEmploymentType = (id: string) => {
    return useQuery({
        queryKey: ['employment-types', id],
        queryFn: () => getEmploymentType(id),
        enabled: !!id,
    });
};

export const useCreateEmploymentType = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: createEmploymentType,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['employment-types'] });
        },
    });
};

export const useUpdateEmploymentType = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: updateEmploymentType,
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ['employment-types'] });
            queryClient.invalidateQueries({ queryKey: ['employment-types', data.EmploymentTypeId] });
        },
    });
};

export const useDeleteEmploymentType = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: deleteEmploymentType,
        onMutate: async (id) => {
            await queryClient.cancelQueries({ queryKey: ['employment-types'] });
            const previousTypes = queryClient.getQueryData<EmploymentType[]>(['employment-types']);

            if (previousTypes) {
                queryClient.setQueryData<EmploymentType[]>(['employment-types'], (old) =>
                    old ? old.filter(type => type.EmploymentTypeId !== id) : []
                );
            }

            return { previousTypes };
        },
        onError: (err, id, context) => {
            if (context?.previousTypes) {
                queryClient.setQueryData(['employment-types'], context.previousTypes);
            }
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ['employment-types'] });
        },
    });
};

export const useDeleteEmploymentTypes = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: deleteEmploymentTypes,
        onMutate: async (ids) => {
            await queryClient.cancelQueries({ queryKey: ['employment-types'] });
            const previousTypes = queryClient.getQueryData<EmploymentType[]>(['employment-types']);

            if (previousTypes) {
                queryClient.setQueryData<EmploymentType[]>(['employment-types'], (old) =>
                    old ? old.filter(type => !ids.includes(type.EmploymentTypeId)) : []
                );
            }

            return { previousTypes };
        },
        onError: (err, ids, context) => {
            if (context?.previousTypes) {
                queryClient.setQueryData(['employment-types'], context.previousTypes);
            }
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ['employment-types'] });
        },
    });
};
