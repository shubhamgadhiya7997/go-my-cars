import { useForm } from 'react-hook-form';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import LoadingButton from '../button/LoadingButton';
import { useEffect } from 'react';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

type FormData = {
  user_old_password: string;
  user_new_password: string;
  user_confirm_password: string;
};
interface ChangePasswordDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onHandleSubmit: (data: FormData) => void;
  isLoading: boolean;
}

const ChangePasswordSchema = z.object({
  user_old_password: z
    .string()
    .min(6, 'Password must be at least 6 characters'),
  user_new_password: z
    .string()
    .min(6, 'Password must be at least 6 characters'),
  user_confirm_password: z
    .string()
    .min(6, 'Password must be at least 6 characters'),
});

export default function ChangePasswordDialog({
  isOpen,
  onOpenChange,
  onHandleSubmit,
  isLoading,
}: ChangePasswordDialogProps) {
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(ChangePasswordSchema),
  });

  const onSubmit = (data: FormData) => {
    if (data.user_new_password !== data.user_new_password) {
      return;
    }
    console.log('Password changed successfully', data);
    onHandleSubmit(data);
    // Call API to change password here
  };
  useEffect(() => {
    if (!isOpen) reset(); // Reset form when dialog closes
  }, [isOpen, reset]);

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button variant='outline'>Change Password</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Change Password</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
          <div>
            <Label htmlFor='user_old_password'>Old Password</Label>
            <Input
              id='user_old_password'
              type='password'
              {...register('user_old_password', {
                required: 'Old password is required',
              })}
            />
            {errors.user_old_password && (
              <p className='text-red-500 text-sm'>
                {errors.user_old_password.message}
              </p>
            )}
          </div>
          <div>
            <Label htmlFor='user_new_password'>New Password</Label>
            <Input
              id='user_new_password'
              type='password'
              {...register('user_new_password', {
                required: 'New password is required',
              })}
            />
            {errors.user_new_password && (
              <p className='text-red-500 text-sm'>
                {errors.user_new_password.message}
              </p>
            )}
          </div>
          <div>
            <Label htmlFor='user_confirm_password'>Confirm New Password</Label>
            <Input
              id='user_confirm_password'
              type='password'
              {...register('user_confirm_password', {
                required: 'Please confirm your new password',
                validate: (value) =>
                  value === watch('user_new_password') ||
                  'Passwords do not match',
              })}
            />
            {errors.user_confirm_password && (
              <p className='text-red-500 text-sm'>
                {errors.user_confirm_password.message}
              </p>
            )}
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button type='button' variant='outline'>
                Cancel
              </Button>
            </DialogClose>

            <LoadingButton
              type='submit'
              variant='default'
              isLoading={isLoading}
            >
              Save Changes
            </LoadingButton>
            {/* <Button type="submit">Save Changes</Button> */}
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
