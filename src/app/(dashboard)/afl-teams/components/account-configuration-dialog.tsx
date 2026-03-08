/** @format */

import * as React from 'react';
import { useForm } from 'react-hook-form';
import { Building2, Hash, X } from 'lucide-react';
import { Button } from '@/components/UI/Button';
import { InputField } from '@/components/UI/input';
import {
  Account,
  AccountCreate,
  useCreateAccount,
  useUpdateAccount,
} from '@/api';
import { H2, Muted } from '@/components/UI/text/typography';
import { notify } from '@/lib/notifications';

interface AccountConfigurationDialogProps {
  onClose: () => void;
  account: Account | null;
}

// Local form data type to handle UI state including IsActive which might not be in Create
interface AccountFormData {
  Name: string;
  Code: string;
  IsActive: boolean;
}

export function AccountConfigurationDialog({
  onClose,
  account,
}: AccountConfigurationDialogProps) {
  const createAccount = useCreateAccount();
  const updateAccount = useUpdateAccount();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isValid, dirtyFields },
  } = useForm<AccountFormData>({
    mode: 'onChange',
    defaultValues: {
      Name: '',
      Code: '',
      IsActive: true,
    },
  });

  React.useEffect(() => {
    if (account) {
      reset({
        Name: account.Name,
        Code: account.Code,
        IsActive: account.IsActive,
      });
    } else {
      reset({
        Name: '',
        Code: '',
        IsActive: true,
      });
    }
  }, [account, reset]);

  const onSubmit = async (data: AccountFormData) => {
    try {
      if (account) {
        await updateAccount.mutateAsync({
          id: account.AccountId,
          data: {
            Name: data.Name,
            Code: data.Code,
          },
        });
        notify.success(
          `You successfully updated the account ———— ${data.Name}`,
          'Update Account Success',
        );
      } else {
        await createAccount.mutateAsync({
          Name: data.Name,
          Code: data.Code,
          // IsActive is not part of Create interface, assuming default true on server
        });
        notify.success(
          `You successfully created a new account ———— ${data.Name}`,
          'Create Account Success',
        );
      }
      onClose();
    } catch (error: any) {
      notify.error(
        error?.response?.data?.message ||
        (account
          ? 'Failed to update account. Please try again.'
          : 'Failed to create account. Please try again.'),
        account ? 'Update Account Error' : 'Create Account Error',
      );
    }
  };

  const isLoading = createAccount.isPending || updateAccount.isPending;
  const isEdited = Object.keys(dirtyFields).length > 0;

  return (
    <div className='flex flex-col h-full p-panel'>
      {/* Header */}
      <div className='drawer-header'>
        <div>
          <H2 className='text-primary'>
            {account
              ? `Edit Account - ${account.Name}${isEdited ? ' ( Edited )' : ''}`
              : 'Create Account'}
          </H2>
          <Muted className='text-ink-secondary'>
            {account
              ? 'Update account details.'
              : 'Create a new client account.'}
          </Muted>
        </div>

        <Button Icon={X} onClick={onClose} />
      </div>

      {/* Form */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className='flex flex-col flex-1 overflow-hidden'
      >
        <div className='form-body'>
          <InputField
            label={`Account Name${dirtyFields.Name ? ' ( Edited )' : ''}`}
            icon={Building2}
            placeholder='e.g. Acme Corp'
            {...register('Name', {
              required: 'Name is required',
              maxLength: {
                value: 100,
                message: 'Name must be 100 characters or less',
              },
            })}
            error={errors.Name?.message}
            maxLength={100}
          />
          <InputField
            label={`Account Code${dirtyFields.Code ? ' ( Edited )' : ''}`}
            icon={Hash}
            placeholder='e.g. ACME'
            {...register('Code', {
              required: 'Code is required',
              maxLength: {
                value: 20,
                message: 'Code must be 20 characters or less',
              },
            })}
            error={errors.Code?.message}
            maxLength={20}
          />
        </div>

        {/* Footer */}
        <div className='footer'>
          <Button
            type='button'
            variant='outline'
            onClick={onClose}
            className='rounded-full'
          >
            Cancel
          </Button>
          <Button
            type='submit'
            disabled={isLoading || !isValid || Object.keys(errors).length > 0}
            className='rounded-full'
          >
            {isLoading
              ? 'Saving...'
              : account
                ? 'Save Changes'
                : 'Create Account'}
          </Button>
        </div>
      </form>
    </div>
  );
}
