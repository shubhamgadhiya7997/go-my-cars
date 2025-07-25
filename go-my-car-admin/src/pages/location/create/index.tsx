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
import Toast from '@/components/toast/commonToast';
import { useNavigate } from 'react-router-dom';
import { onFormErrors } from '@/utils/helper';
import { Loader2, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { useCreateLocation } from '@/hooks/api/location';

// Define the plan schema with Zod
const createLocationValidationSchema = z
  .object({
    name: z
      .string({ required_error: 'location is required' })
      .min(1, 'location cannot be empty')
      .trim(),

    isActive: z.boolean().optional(),

  })
  .strict();

// Define the form component
const CreateLocation = () => {
  const navigate = useNavigate();
  const onSuccessCreateLocation = data => {
    Toast('success', data?.message || 'Location Added Successfully');
    navigate('/location');
  };
  const { mutate: createLocation, isPending: isCreateLocationPending } =
    useCreateLocation(onSuccessCreateLocation);

  // Initialize the form with default values
  const form = useForm({
    resolver: zodResolver(createLocationValidationSchema),
    defaultValues: {
      name: '',
      isActive: false
    },
  });


  function onSubmit(data) {
    console.log("data", data)
    const payload = {
      name: data.name,
      isActive: data.isActive
    }

    createLocation(payload);
  }

  return (
    <div className="container  ">
      <h1 className="text-2xl font-bold mb-6">Create New Location</h1>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit, onFormErrors)}
          className="space-y-8 w-full max-w-5xl"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Coupon Code */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter location name"
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
            <Button type="submit" disabled={isCreateLocationPending}>
              {isCreateLocationPending ? 'Creating...' : 'Create Location'}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default CreateLocation;
