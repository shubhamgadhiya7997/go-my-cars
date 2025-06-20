import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, useFieldArray } from 'react-hook-form';
import * as z from 'zod';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import Toast from '@/components/toast/commonToast';
import { useNavigate, useParams } from 'react-router-dom';
import { onFormErrors } from '@/utils/helper';
import { useEffect, useState } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { useUpdateCoupon, useViewCoupon } from '@/hooks/api/coupon';
import { Switch } from '@/components/ui/switch';

const UpdateCoupon = () => {
  const { id } = useParams();
  console.log("id", id)
  const navigate = useNavigate();

  // Fetch banner details
  const {
    data: supportDataResponse,
    isLoading: isSpportLoading,
    isError: isSpportDataError,
    error: supportDataError,
    refetch: refetchBanner,
  } = useViewCoupon(id);

  const onSuccessUpdateCoupon = data => {
    Toast('success', data?.message || 'Coupon Updated Successfully');
    navigate('/coupon');
  };
  const { mutate: updateCoupon, isPending: isUpdateCouponPending } =
    useUpdateCoupon(onSuccessUpdateCoupon);

  const updateCouponValidationSchema = z
    .object({
       couponCode: z
            .string({ required_error: 'couponCode is required' })
             .min(1, 'couponCode cannot be empty')
            .trim(),
        amount: z
            .number({
              required_error: 'amount Value is required',
            }),
      isActive: z.boolean().optional(),

    })
    .strict();

  const form = useForm({
    resolver: zodResolver(updateCouponValidationSchema),
    defaultValues: {
         couponCode: '',
      amount: '',
      isActive: false
    },
  });
 
  const [bannerData, setBannerData] = useState({});

  useEffect(() => {
    const bannerData = supportDataResponse?.data;
    if (bannerData) {
      setBannerData(bannerData);
    }
    form.reset({
      couponCode: bannerData?.couponCode || '',
      amount: bannerData?.amount || undefined,
      isActive: bannerData?.isActive || false,

    });
  }, [supportDataResponse]);


  function onSubmit(data) {
    console.log("data", data)
    const payload = {
      couponCode: data.couponCode,
      amount: data.amount,
      isActive: data.isActive
    }
    updateCoupon({
      id,
      data: payload,
    });
  }

  // Loading state
  if (isSpportLoading) {
    return <div>Loading coupon details...</div>;
  }

  // Loading state
  if (isSpportDataError) {
    return (
      <div className="text-danger font-semibold">{supportDataError.message}</div>
    );
  }
  return (
    <div className="container  ">
      <h1 className="text-2xl font-bold mb-6">Update coupon</h1>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit, onFormErrors)}
          className="space-y-8 w-full max-w-5xl"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="couponCode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>couponCode</FormLabel>
                  <FormControl>
                    <Input placeholder="couponCode" 
                    {...field}
                    
                     />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>amount</FormLabel>
                  <FormControl>
                    <Input type="number" 
                    placeholder="amount"{...field}
                     onChange={(e) => {
    const value = e.target.value;
    field.onChange(value === '' ? undefined : Number(value));
  }}
                     />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="isActive"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">isActive</FormLabel>
                    <FormDescription>
                      Toggle to activate or deactivate the coupon
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={(val) => field.onChange(val)}
                    />
                  </FormControl>
                </FormItem>
              )}
            />



          </div>

          {/* Submit Button */}
          <div className="flex justify-end space-x-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/coupon')}
            >
              Cancel
            </Button>
            <Button type="submit" >
              Update Coupon
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default UpdateCoupon;
