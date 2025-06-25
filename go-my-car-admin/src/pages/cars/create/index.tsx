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
import { CAR_GEAR, CAR_TYPE, LOCATION } from '@/utils/constants';
import { useCreateCar } from '@/hooks/api/cars';
import Toast from '@/components/toast/commonToast';
import { useNavigate } from 'react-router-dom';
import { onFormErrors } from '@/utils/helper';
import { Loader2, Plus, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import dayjs from 'dayjs';

const sevenYearsAgo = dayjs().subtract(7, 'year');
const newDate = sevenYearsAgo.format('YYYY-MM-DD')
console.log("newDate", newDate)

const dateRangeSchema = z
  .object({
    startDate: z.preprocess(
      (val) => val ? new Date(val as string) : undefined,
      z.date({ required_error: 'Start Date is required' })
    ),
    endDate: z.preprocess(
      (val) => val ? new Date(val as string) : undefined,
      z.date({ required_error: 'End Date is required' })
    ),
  })
  .superRefine((data, ctx) => {
    if (data.startDate && data.endDate && data.endDate <= data.startDate) {
      ctx.addIssue({
        path: ['endDate'],
        code: z.ZodIssueCode.custom,
        message: 'End date must be after start date',
      });
    }
  });

const createCarValidationSchema = z
  .object({
    carName: z
      .string({ required_error: 'Car name is required' })
      .min(1, 'Car name cannot be empty')
      .max(50, 'Car name must be 50 characters or less')
      .trim(),
    carModal: z
      .string({
        required_error: 'Car registration date is required',
      })
        .refine(
      (date) => date >= newDate,
      { message: 'Car must be registered within the last 7 years' }
    ),
    carGear: z
      .string({ required_error: 'Car gear is required' }),
    carType: z
      .string({ required_error: 'Car type is required' }),
    carSeat: z
      .number({
        required_error: 'Car seat Value is required',
      }).min(1, 'Car seat must be a positive number')
      .max(50, 'Car seat maximum 50 seat')
      .positive('Car seat must be a positive number'),
    price: z.object({
      price1hr: z.number({ required_error: 'Price 1 hr Value is required', }).min(1, 'Price 1 hr must be a positive number').positive('Price 1 hr must be a positive number'),
      price8hr: z.number({ required_error: 'Price 8 hr Value is required', }).min(1, 'Price 8 hr must be a positive number').positive(' Price 8 hr must be a positive number'),
      price12hr: z.number({ required_error: 'Price 12 hr Value is required', }).min(1, 'Price 12 hr must be a positive number').positive('Price 12 hr must be a positive number'),
      fullDay: z.number({ required_error: 'Price full day Value is required', }).min(1, 'Price full day must be a positive number').positive('Price full day must be a positive number'),
    }),
  availableDates: z.array(dateRangeSchema).default([]),
unavailableDates: z.array(dateRangeSchema).default([]),

    iinsuranceExpiry: z
  .string({ required_error: 'Insurance expiry date is required' })
  .min(1, 'Insurance expiry date is required'),

       carColor: z
      .string({
        required_error: 'Car color Value is required',
      }).min(1, 'Car color is required'),
    // endDate: z
    //   .string({ required_error: 'End Date is required' })
    //   .transform(date => new Date(date)),

    fastag: z.boolean().default(false), // ✅ ADDED
    isAvailable: z.boolean().default(true), // ✅ ADDED
    // location: z.string().min(1, 'Location is required'), // ✅ ADDED
    location: z
      .string({ required_error: 'Car location is required' }),
    hostName: z.string().min(1, 'Host name is required'), // ✅ ADDED
    chassicNo: z.string().min(1, 'Chassic no is required'), // ✅ ADDED
    engineNo: z.string().min(1, 'Engine no is required'), // ✅ ADDED
    NumberPlate: z.string().min(1, 'Number plate is required'), // ✅ ADDED

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
      carSeat: undefined,
      price: undefined,
      fastag: false,
      isAvailable: false,
      insuranceExpiry: undefined,
      carColor: '',
    availableDates: [],
    unavailableDates: [],

      // startDate: new Date().toISOString().split('T')[0],
      // endDate: '',
      location: undefined,
      hostName: '',
      isActive: true,
      feature: [],
      chassicNo : '',
      engineNo : '',
      NumberPlate : ''
    },
  });


  const { control, register } = form;
  const [imagePreviews, setImagePreviews] = useState({});

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'feature',
  });
const { fields: availableDateFields, append: appendAvailableDate, remove: removeAvailableDate } = useFieldArray({
  control: form.control,
  name: 'availableDates'
});
const {
  fields: unavailableDateFields,
  append: appendUnavailableDate,
  remove: removeUnavailableDate
} = useFieldArray({
  control: form.control,
  name: 'unavailableDates'
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
    formData.append('carSeat', data.carSeat);
    formData.append('price', JSON.stringify(data.price));
    formData.append('fastag', data.fastag);
    formData.append('isAvailable', data.isAvailable);
    formData.append('hostName', data.hostName);
    formData.append('chassicNo', data.chassicNo);
    formData.append('engineNo', data.engineNo);
    formData.append('NumberPlate', data.NumberPlate);
    formData.append('insuranceExpiry', data.insuranceExpiry);
    formData.append('carColor', data.carColor);
    formData.append('availableDates', JSON.stringify(data.availableDates));
    if(data.unavailableDates){
      formData.append('unavailableDates', JSON.stringify(data.unavailableDates));
    }

    // formData.append('startDate', new Date(data.startDate).toISOString());
    // formData.append('endDate', new Date(data.endDate).toISOString());
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
                      placeholder="Enter car name"
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


            <FormField
              control={form.control}
              name="carGear"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Car Gear Type</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select car gear type" />
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
                    Select car gear type
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
                  <FormLabel>Car Fuel Type</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select car fuel type" />
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
                    Select car fuel type
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Global Usage Limit */}
            <FormField
              control={form.control}
              name="carSeat"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Car Seat</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Enter car seat"
                      {...field}
                      onChange={(e) => {
                        const value = e.target.value;
                        field.onChange(value === '' ? undefined : Number(value));
                      }}
                    />
                  </FormControl>
                  <FormDescription>
                    Enter car seat
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="carModal"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Car Registration</FormLabel>
                  <FormControl>
                    <Input
                      type="date" {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Enter car registration date
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="price.price1hr"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Price (1 to 8 hr)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Enter price for 1 hour"
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
              name="price.price8hr"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Price (8 to 12 hr)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Enter price for 8 hours"
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
              name="price.price12hr"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Price (12 to 24 hr)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Enter price for 12 hours"
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
              name="price.fullDay"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Price (Full Day)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Enter price for full day"
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
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Location</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select location" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {Object.values(LOCATION).map(type => (
                        <SelectItem key={type} value={type}>
                          {type.charAt(0).toUpperCase() + type.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                
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
                    <FormLabel className="text-base">Fastag</FormLabel>
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
                    <FormLabel className="text-base">Available</FormLabel>
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
          <div>
  <div className="flex items-center justify-between mb-4">
    <label className="block">Available Dates</label>
    <Button
      type="button"
      variant="secondary"
      onClick={() =>
        appendAvailableDate({ startDate: '', endDate: '' })
      }
      className="flex items-center gap-2"
    >
      <Plus className="h-4 w-4" />
      Add Available Date
    </Button>
  </div>

  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    {availableDateFields.map((field, index) => (
      <div key={field.id} className="border p-4 rounded-md space-y-2">
        {/* Start Date */}
        <FormField
          control={form.control}
          name={`availableDates.${index}.startDate`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Start Date</FormLabel>
              <FormControl>
                <Input
                  type="datetime-local"
                  value={field.value ? dayjs(field.value).format("YYYY-MM-DDTHH:mm") : ''}
                  onChange={(e) => {
                    const value = e.target.value;
                    field.onChange(value ? new Date(value) : '');
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* End Date */}
        <FormField
          control={form.control}
          name={`availableDates.${index}.endDate`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>End Date</FormLabel>
              <FormControl>
                <Input
                  type="datetime-local"
                  value={field.value ? dayjs(field.value).format("YYYY-MM-DDTHH:mm") : ''}
                  onChange={(e) => {
                    const value = e.target.value;
                    field.onChange(value ? new Date(value) : '');
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Remove Button */}
        <Button
          type="button"
          variant="ghost"
          onClick={() => removeAvailableDate(index)}
          className="text-red-500 mt-2"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    ))}
  </div>
</div>

        <div>
  <div className="flex items-center justify-between mb-4">
    <label className="block">Unavailable Dates</label>
    <Button
      type="button"
      variant="secondary"
      onClick={() =>
        appendUnavailableDate({ startDate: '', endDate: '' })
      }
      className="flex items-center gap-2"
    >
      <Plus className="h-4 w-4" />
      Add Unavailable Date
    </Button>
  </div>

  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    {unavailableDateFields.map((field, index) => (
      <div key={field.id} className="border p-4 rounded-md space-y-2">
        {/* Start Date */}
        <FormField
          control={form.control}
          name={`unavailableDates.${index}.startDate`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Start Date</FormLabel>
              <FormControl>
                <Input
                  type="datetime-local"
                  value={field.value ? dayjs(field.value).format("YYYY-MM-DDTHH:mm") : ''}
                  onChange={(e) => {
                    const value = e.target.value;
                    field.onChange(value ? new Date(value) : '');
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* End Date */}
        <FormField
          control={form.control}
          name={`unavailableDates.${index}.endDate`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>End Date</FormLabel>
              <FormControl>
                <Input
                  type="datetime-local"
                  value={field.value ? dayjs(field.value).format("YYYY-MM-DDTHH:mm") : ''}
                  onChange={(e) => {
                    const value = e.target.value;
                    field.onChange(value ? new Date(value) : '');
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Remove Button */}
        <Button
          type="button"
          variant="ghost"
          onClick={() => removeUnavailableDate(index)}
          className="text-red-500 mt-2"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    ))}
  </div>
</div>

            <FormField
              control={form.control}
              name="hostName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Host Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter host name"
                      {...field}

                    />
                  </FormControl>
                  <FormDescription>
                    Enter host name
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
  <FormField
              control={form.control}
              name="chassicNo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Chassic No</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter chassic number"
                      {...field}

                    />
                  </FormControl>
                  <FormDescription>
                    Enter chassic number
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
              <FormField
              control={form.control}
              name="engineNo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Engine No</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter engine number"
                      {...field}

                    />
                  </FormControl>
                  <FormDescription>
                  Enter engine number
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
              <FormField
              control={form.control}
              name="NumberPlate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Car Number</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="GJ01AA999"
                      {...field}

                    />
                  </FormControl>
                  <FormDescription>
                   Enter car number
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
                 <FormField
              control={form.control}
              name="insuranceExpiry"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Car insurance expiry date</FormLabel>
                  <FormControl>
                    <Input
                      type="date" {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Enter car insurance expiry date
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="carColor"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Car Color</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter car color"
                      {...field}

                    />
                  </FormControl>
                  <FormDescription>
                   Enter car number
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
