import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';

export interface Account {
    AccountId: string;
    Name: string;
    Code: string;
    IsActive: boolean;
    CreatedAt: string;
    ModifiedOn?: string;
}

export interface AccountCreate {
    Name: string;
    Code: string;
    IsActive?: boolean;
}

export interface AccountUpdate {
    Name?: string;
    Code?: string;
    IsActive?: boolean;
}

export const getAccounts = async () => {
    const response = await api.get<Account[]>('/api/v1/accounts/');
    return response.data;
};

export const getAccount = async (id: string) => {
    const response = await api.get<Account>(`/api/v1/accounts/${id}`);
    return response.data;
};

export const createAccount = async (data: AccountCreate) => {
    const response = await api.post<Account>('/api/v1/accounts/', data);
    return response.data;
};

export const updateAccount = async ({ id, data }: { id: string; data: AccountUpdate }) => {
    const response = await api.put<Account>(`/api/v1/accounts/${id}`, data);
    return response.data;
};

export const useAccounts = () => {
    return useQuery({
        queryKey: ['accounts'],
        queryFn: getAccounts,
    });
};

export const useAccount = (id: string) => {
    return useQuery({
        queryKey: ['accounts', id],
        queryFn: () => getAccount(id),
        enabled: !!id,
    });
};

export const useCreateAccount = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: createAccount,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['accounts'] });
        },
    });
};

export const deleteAccount = async (id: string) => {
    const response = await api.delete(`/api/v1/accounts/${id}`);
    return response.data;
};

export const deleteAccounts = async (ids: string[]) => {
    // For multiple deletions, we'll call the single delete endpoint for each ID
    // If the backend supports batch deletion in the future, this can be updated
    const promises = ids.map(id => deleteAccount(id));
    return Promise.all(promises);
};

export const useUpdateAccount = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: updateAccount,
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ['accounts'] });
            queryClient.invalidateQueries({ queryKey: ['accounts', data.AccountId] });
        },
    });
};

export const useDeleteAccount = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: deleteAccount,
        onMutate: async (id) => {
            await queryClient.cancelQueries({ queryKey: ['accounts'] });
            const previousAccounts = queryClient.getQueryData<Account[]>(['accounts']);

            if (previousAccounts) {
                queryClient.setQueryData<Account[]>(['accounts'], (old) =>
                    old ? old.filter(account => account.AccountId !== id) : []
                );
            }

            return { previousAccounts };
        },
        onError: (err, id, context) => {
            if (context?.previousAccounts) {
                queryClient.setQueryData(['accounts'], context.previousAccounts);
            }
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ['accounts'] });
        },
    });
};

export const useDeleteAccounts = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: deleteAccounts,
        onMutate: async (ids) => {
            await queryClient.cancelQueries({ queryKey: ['accounts'] });
            const previousAccounts = queryClient.getQueryData<Account[]>(['accounts']);

            if (previousAccounts) {
                queryClient.setQueryData<Account[]>(['accounts'], (old) =>
                    old ? old.filter(account => !ids.includes(account.AccountId)) : []
                );
            }

            return { previousAccounts };
        },
        onError: (err, ids, context) => {
            if (context?.previousAccounts) {
                queryClient.setQueryData(['accounts'], context.previousAccounts);
            }
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ['accounts'] });
        },
    });
};
