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

// Define the plan schema with Zod
const createCarValidationSchema = z
  .object({
    carName: z
      .string({ required_error: 'carName is required' })
      .min(1, 'carName cannot be empty')
      .max(50, 'carName must be 50 characters or less')
      .toUpperCase()
      .trim(),
    carModal: z
      .number({
        required_error: 'carModal Value is required',
      }),
    carGear: z
      .string({ required_error: 'carGear is required' }),
    carType: z
      .string({ required_error: 'carType is required' }),
    carSheet: z
      .number({
        required_error: 'carSheet Value is required',
      }).min(1, 'carSheet cannot be empty'),
    carPrice: z
      .number({
        required_error: 'carPrice Value is required',
      }).min(1, 'carPrice cannot be empty'),
    startDate: z
      .string({ required_error: 'Start Date is required' })
      .transform(date => new Date(date)),
    endDate: z
      .string({ required_error: 'End Date is required' })
      .refine(date => !isNaN(Date.parse(date)), {
        message: 'Invalid End Date format',
      })
      .transform(date => new Date(date)),
    fastag: z.boolean().default(false), // ✅ ADDED
    isAvailable: z.boolean().default(true), // ✅ ADDED
    location: z.string().min(1, 'Location is required'), // ✅ ADDED
    hostName: z.string().min(1, 'Host name is required'), // ✅ ADDED
    isActive: z.boolean().optional(), // ✅ ADDED
    feature: z
      .array(z.string().min(1, 'Each feature must not be empty'))
      .min(1, 'At least one feature is required'),
    images: z.array(z.any()), // ✅ ADDED
  })
  .strict();

// Define the form component
const CreateCar = () => {
  const navigate = useNavigate();
  const onSuccessCreateCar = data => {
    Toast('success', data?.message || 'Car Added Successfully');
    navigate('/car');
  };
  const { mutate: createCar, isPending: isCreateCarPending } =
    useCreateCar(onSuccessCreateCar);

  // Initialize the form with default values
  const form = useForm({
    resolver: zodResolver(createCarValidationSchema),
    defaultValues: {
      carName: '',
      carModal: undefined,
      carGear: undefined,
      carType: undefined,
      carSheet: undefined,
      carPrice: undefined,
      fastag: false,
      isAvailable: false,
      startDate: new Date().toISOString().split('T')[0],
      endDate: '',
      location: '',
      hostName: '',
      isActive: true,
      feature: []
    },
  });
  const { control, register } = form;
  const [imagePreviews, setImagePreviews] = useState({});

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'feature',
  });

  const {
    fields: imageFields,
    append: appendImage,
    remove: removeImage,
  } = useFieldArray({
    control,
    name: 'images',
  });

  function onSubmit(data) {
    console.log("data", data)
    const formData = new FormData();

    formData.append('carName', data.carName);
    formData.append('carModal', data.carModal);
    formData.append('carGear', data.carGear);
    formData.append('carType', data.carType);
    formData.append('carSheet', data.carSheet);
    formData.append('carPrice', data.carPrice);
    formData.append('fastag', data.fastag);
    formData.append('isAvailable', data.isAvailable);
    formData.append('hostName', data.hostName);

    formData.append('startDate', new Date(data.startDate).toISOString());
    formData.append('endDate', new Date(data.endDate).toISOString());
    formData.append('location', data.location);
    formData.append('feature', data.feature);

    // Append targets
    // data.features.forEach((target, idx) => {
    //   formData.append(`features[${idx}]`, target);
    // });

    // Append images
    if (data.images) {
      data.images.forEach((fileWrapper, idx) => {
        const file = fileWrapper instanceof FileList ? fileWrapper[0] : fileWrapper;
        if (file instanceof File) {
          formData.append('images', file); // Backend should expect 'images' as an array
        }
      });
    }

    createCar(formData);
  }

  return (
    <div className="container  ">
      <h1 className="text-2xl font-bold mb-6">Create New Car</h1>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit, onFormErrors)}
          className="space-y-8 w-full max-w-5xl"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Coupon Code */}
            <FormField
              control={form.control}
              name="carName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Car Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter Car Name"
                      {...field}

                    />
                  </FormControl>
                  <FormDescription>
                    Unique name for the car (max 50 characters)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Discount Type */}
            <FormField
              control={form.control}
              name="carModal"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>car Modal</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Enter Car Modal"
                      {...field}

                      onChange={e => field.onChange(Number(e.target.value))}

                    />
                  </FormControl>
                  <FormDescription>
                    Enter car modal
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Discount Value */}
            <FormField
              control={form.control}
              name="carGear"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>carGear</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Car Gear" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {Object.values(CAR_GEAR).map(type => (
                        <SelectItem key={type} value={type}>
                          {type.charAt(0).toUpperCase() + type.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Select car gear
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="carType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>carType</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Car Type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {Object.values(CAR_TYPE).map(type => (
                        <SelectItem key={type} value={type}>
                          {type.charAt(0).toUpperCase() + type.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Select car type
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Global Usage Limit */}
            <FormField
              control={form.control}
              name="carSheet"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>car Sheet</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Enter car Sheet"
                      {...field}
                      onChange={e => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormDescription>
                    Enter car sheet
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="carPrice"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>car Price (hr)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Enter car Price"
                      {...field}
                      onChange={e => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormDescription>
                    Enter car price
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="fastag"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">fastag</FormLabel>
                    <FormDescription>
                      Toggle to activate or deactivate the fastag
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
            <FormField
              control={form.control}
              name="isAvailable"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">isAvailable</FormLabel>
                    <FormDescription>
                      Toggle to activate or deactivate the car
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
            {/* Start Date */}
            <FormField
              control={form.control}
              name="startDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Start Date</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* End Date */}
            <FormField
              control={form.control}
              name="endDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>End Date</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
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
                    <Input
                      placeholder="Enter location"
                      {...field}

                    />
                  </FormControl>
                  <FormDescription>
                    Choose car location
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="hostName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>hostName</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter hostName"
                      {...field}

                    />
                  </FormControl>
                  <FormDescription>
                    Choose hostName
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Targets Section */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <label className="block">feature</label>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => append('')}
                  className="flex items-center gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Add feature
                </Button>

              </div>
              {typeof form.formState.errors.feature?.message === 'string' && (
                <p className="text-red-500 text-sm">
                  {form.formState.errors.feature.message}
                </p>
              )}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {fields.map((field, index) => (
                  <div key={field.id} className="flex gap-2 flex-col">
                    <Input
                      {...register(`feature.${index}`)}
                      placeholder={`Feature ${index + 1}`}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => remove(index)}
                      className="px-2 w-fit text-red-600"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>



                  </div>
                ))}


              </div>

              {/* {errors.targets && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.targets.message ||
                    errors.targets?.root?.message ||
                    errors.targets[0]?.message}
                </p>
              )} */}
            </div>

            {/* Is Active */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <label className="block font-medium">Upload Images</label>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => appendImage(null)}
                  className="flex items-center gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Add Image
                </Button>
                <FormMessage />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {imageFields.map((field, index) => (
                  <div key={field.id} className="flex flex-col gap-2">
                    <Input
                      type="file"
                      accept="image/*"
                      {...register(`images.${index}`)}
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const previewUrl = URL.createObjectURL(file);
                          setImagePreviews((prev) => ({ ...prev, [index]: previewUrl }));
                        }
                      }}
                    />
                    {imagePreviews[index] && (
                      <img
                        src={imagePreviews[index]}
                        alt={`Preview ${index}`}
                        className="w-32 h-32 object-cover border rounded"
                      />
                    )}
                    {typeof form.formState.errors.image?.message === 'string' && (
                      <p className="text-red-500 text-sm">
                        {form.formState.errors.image.message}
                      </p>
                    )}
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => {
                        removeImage(index);
                        setImagePreviews((prev) => {
                          const updated = { ...prev };
                          delete updated[index];
                          return updated;
                        });
                      }}
                      className="px-2 w-fit text-red-600"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>



          </div>

          {/* Submit Button */}
          <div className="flex justify-end space-x-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/car')}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isCreateCarPending}>
              {isCreateCarPending ? 'Creating...' : 'Create Car'}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default CreateCar;
