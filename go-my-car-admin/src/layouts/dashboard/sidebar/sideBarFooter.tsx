import { SidebarFooter } from '@/components/ui/sidebar';
import AlertDialogComponent from '@/components/alertDialog/alertConfirmDialog';
import { useAuth } from '@/context/authContext';
import ChangePasswordDialog from '@/components/dialog/changePassword';
import { useChangePasswordMutation } from '@/hooks/api/auth/useChangePassword';
import { convertToFormData } from '@/utils/helper';
import Toast from '@/components/toast/commonToast';
import { useState } from 'react';
import { useLogoutQuery } from '@/hooks/api/auth/useLogout';
import { Button } from '@/components/ui/button';

export const SidebarFooterComponent = () => {
  const { logout } = useAuth();
  const handleLogout = async () => {
    // await logoutApi();
    logout();
  };
  const { refetch: logoutApi } = useLogoutQuery();

  const [isChangePasswordDialogOpen, setIsChangePasswordDialogOpen] =
    useState(false);

  const [isLogoutAlertOpen, setIsLogoutAlertOpen] = useState(false);
  const onHandleChangePasswordSuccess = () => {
    Toast('success', 'Password Change Success');
    setIsChangePasswordDialogOpen(false); // Close the modal on success
  };
  const { isPending, mutate: changePassword } = useChangePasswordMutation(
    onHandleChangePasswordSuccess
  );
  const handleChangePassword = (data: { [key: string]: string }) => {
    const payload = {
      oldPassword: data.user_old_password,
      newPassword: data.user_new_password,
    };
    changePassword(payload);
  };

  return (
    <SidebarFooter className='border-t border-r  dark:bg-gray-950'>
      <div className='flex flex-col gap-5 py-3'>
        {/* <Button variant="outline">Change Password</Button> */}

        <ChangePasswordDialog
          onHandleSubmit={handleChangePassword}
          isLoading={isPending}
          isOpen={isChangePasswordDialogOpen}
          onOpenChange={setIsChangePasswordDialogOpen}
        />
        {/* Logout Button with Alert Dialog */}
        <Button
          variant={'destructive'}
          onClick={() => setIsLogoutAlertOpen(true)}
        >
          Logout
        </Button>
        <AlertDialogComponent
          title='Are you sure you want to logout?'
          description='You will need to log in again to access your account.'
          confirmText='Logout'
          cancelText='Cancel'
          onConfirm={handleLogout}
          confirmButtonClass='bg-destructive text-white hover:bg-red-600'
          open={isLogoutAlertOpen}
          setOpen={setIsLogoutAlertOpen}
        />
      </div>
    </SidebarFooter>
  );
};
