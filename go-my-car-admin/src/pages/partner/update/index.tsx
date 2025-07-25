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
import { useUpdatePartner, useUpdateSupport, useViewPartner, useViewSupport } from '@/hooks/api/partner';



// Define the form component
const UpdatePartner = () => {
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
  } = useViewPartner(id);

  console.log("1supportDataResponse", supportDataResponse)
  // Update banner mutation
  const onSuccessUpdateCoupon = data => {
    Toast('success', data?.message || 'partner Updated Successfully');
    navigate('/partner');
  };
  const { mutate: updateSupport, isPending: isUpdateCouponPending } =
    useUpdatePartner(onSuccessUpdateCoupon);

  const updateSupportValidationSchema = z
    .object({
      email: z.string().optional(), // ✅ ADDED
      fullName: z.string().optional(), // ✅ ADDED
      phoneNumber: z.string().optional(), // ✅ ADDED
      detail: z.string().optional(), // ✅ ADDED
      location: z.string().optional(), // ✅ ADDED
      area: z.string().optional(), // ✅ ADDED
      carName: z.string().optional(), // ✅ ADDED
      carNumber: z.string().optional(), // ✅ ADDED
      registrationDate: z.string().optional(), // ✅ ADDED

      reply: z
        .string({ required_error: 'message is required' })
        .min(1, 'message cannot be empty')

    })
    .strict();

  const form = useForm({
    resolver: zodResolver(updateSupportValidationSchema),
    defaultValues: {
      Reply: ''
    },
  });
  const { control, register } = form;


  const [bannerData, setBannerData] = useState({});

  useEffect(() => {
    const bannerData = supportDataResponse?.data;
    if (bannerData) {
      setBannerData(bannerData);
    }
    form.reset({
      email: bannerData?.email || '',
      phoneNumber: bannerData?.phoneNumber || '',
      fullName: bannerData?.fullName || '',
      registrationDate: bannerData?.registrationDate ? new Date(bannerData?.registrationDate).toISOString().split('T')[0] || '' : '',
      location: bannerData?.location || '',
      area: bannerData?.area || '',
      carName: bannerData?.carName || '',
      carNumber: bannerData?.carNumber || '',
      reply: bannerData?.reply || '',
    });
  }, [supportDataResponse]);


  function onSubmit(data) {
    console.log("data", data)
    const payload = {
      reply: data.reply,
      email: data.email
    }
    updateSupport({
      id,
      data: payload,
    });
  }

  // Loading state
  if (isSpportLoading) {
    return <div>Loading partner details...</div>;
  }

  // Loading state
  if (isSpportDataError) {
    return (
      <div className="text-danger font-semibold">{supportDataError.message}</div>
    );
  }
  return (
    <div className="container  ">
      <h1 className="text-2xl font-bold mb-6">Update partner</h1>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit, onFormErrors)}
          className="space-y-8 w-full max-w-5xl"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>email</FormLabel>
                  <FormControl>
                    <Input placeholder="email" disabled={true} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="fullName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>fullName</FormLabel>
                  <FormControl>
                    <Input placeholder="fullName" disabled={true} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phoneNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>phoneNumber</FormLabel>
                  <FormControl>
                    <Input placeholder="phoneNumber" disabled={true} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>location</FormLabel>
                  <FormControl>
                    <Input placeholder="location" disabled={true} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
              <FormField
              control={form.control}
              name="area"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>area</FormLabel>
                  <FormControl>
                    <Input placeholder="area" disabled={true} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

             <FormField
              control={form.control}
              name="carName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>car Name</FormLabel>
                  <FormControl>
                    <Input placeholder="carName" disabled={true} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="carNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>car Number</FormLabel>
                  <FormControl>
                    <Input placeholder="carNumber" disabled={true} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="registrationDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>registration Date</FormLabel>
                  <FormControl>
                    <Input type="date"  disabled={true} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="reply"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Reply</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter reply mail"
                      className="min-h-32"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />


          </div>

          {/* Submit Button */}
          <div className="flex justify-end space-x-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/partner')}
            >
              Cancel
            </Button>
            <Button type="submit" >
              Update Partner
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default UpdatePartner;
