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
import { useUpdateLocation, useViewLocation } from '@/hooks/api/location';

const UpdateLocation = () => {
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
  } = useViewLocation(id);

  const onSuccessUpdateCoupon = data => {
    Toast('success', data?.message || 'Location Updated Successfully');
    navigate('/location');
  };
  const { mutate: updateCoupon, isPending: isUpdateCouponPending } =
    useUpdateLocation(onSuccessUpdateCoupon);

  const updateLocationValidationSchema = z
    .object({
       name: z
            .string({ required_error: 'name is required' })
             .min(1, 'name cannot be empty')
            .trim(),
      isActive: z.boolean().optional(),

    })
    .strict();

  const form = useForm({
    resolver: zodResolver(updateLocationValidationSchema),
    defaultValues: {
         name: '',
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
      name: bannerData?.name || '',
      isActive: bannerData?.isActive || false,

    });
  }, [supportDataResponse]);


  function onSubmit(data) {
    console.log("data", data)
    const payload = {
      name: data.name,
      isActive: data.isActive
    }
    updateCoupon({
      id,
      data: payload,
    });
  }

  // Loading state
  if (isSpportLoading) {
    return <div>Loading location details...</div>;
  }

  // Loading state
  if (isSpportDataError) {
    return (
      <div className="text-danger font-semibold">{supportDataError.message}</div>
    );
  }
  return (
    <div className="container  ">
      <h1 className="text-2xl font-bold mb-6">Update Location</h1>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit, onFormErrors)}
          className="space-y-8 w-full max-w-5xl"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter location name" 
                    {...field}
                    
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
                      Toggle to activate or deactivate the location
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
              onClick={() => navigate('/location')}
            >
              Cancel
            </Button>
            <Button type="submit" >
              Update Location
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default UpdateLocation;
