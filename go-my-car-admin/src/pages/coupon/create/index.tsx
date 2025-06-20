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
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { CAR_GEAR, CAR_TYPE } from '@/utils/constants';
import { useCreateCar } from '@/hooks/api/cars';
import Toast from '@/components/toast/commonToast';
import { useNavigate } from 'react-router-dom';
import { onFormErrors } from '@/utils/helper';
import { Loader2, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { useCreateCoupon } from '@/hooks/api/coupon';

// Define the plan schema with Zod
const createCarValidationSchema = z
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

// Define the form component
const CreateCoupon = () => {
  const navigate = useNavigate();
  const onSuccessCreateCar = data => {
    Toast('success', data?.message || 'Coupon Added Successfully');
    navigate('/coupon');
  };
  const { mutate: createCoupon, isPending: isCreateCarPending } =
    useCreateCoupon(onSuccessCreateCar);

  // Initialize the form with default values
  const form = useForm({
    resolver: zodResolver(createCarValidationSchema),
    defaultValues: {
      couponCode: '',
      amount: '',
      isActive: false
    },
  });

 
  function onSubmit(data) {
    console.log("data", data)
    const payload = {
      couponCode: data.couponCode,
      amount: data.amount,
      isActive: data.isActive
    }

    createCoupon(payload);
  }

  return (
    <div className="container  ">
      <h1 className="text-2xl font-bold mb-6">Create New Coupon</h1>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit, onFormErrors)}
          className="space-y-8 w-full max-w-5xl"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Coupon Code */}
            <FormField
              control={form.control}
              name="couponCode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>couponCode</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter couponCode"
                      {...field}

                    />
                  </FormControl>
                 
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Discount Type */}
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>car Modal</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Enter amount"
                      {...field}

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
            <Button type="submit" disabled={isCreateCarPending}>
              {isCreateCarPending ? 'Creating...' : 'Create Coupon'}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default CreateCoupon;
