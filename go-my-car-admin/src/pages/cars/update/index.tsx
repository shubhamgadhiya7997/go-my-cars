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
import { BASE_API_URL, CAR_GEAR, CAR_TYPE, LOCATION } from '@/utils/constants';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import Toast from '@/components/toast/commonToast';
import { useNavigate, useParams } from 'react-router-dom';
import { onFormErrors } from '@/utils/helper';
import { useState, useEffect } from 'react';
import { Loader2, Plus, Trash2 } from 'lucide-react';
import {
  useGetViewCars,
  useUpdateCars,
} from '@/hooks/api/cars';
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

const updateCarValidationSchema = z
  .object({
    carName: z
      .string({ required_error: 'carName is required' })
      .min(1, 'carName cannot be empty')
      .max(50, 'carName must be 50 characters or less')
      .toUpperCase()
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
      .string({ required_error: 'carGear is required' }),
    carType: z
      .string({ required_error: 'carType is required' }),
    carSeat: z
         .number({
           required_error: 'Car seat Value is required',
         }).min(1, 'Car seat must be a positive number')
         .positive('Car seat must be a positive number'),
   price: z.object({
        price1hr: z.number({ required_error: 'Price 1 hr Value is required', }).min(1, 'Price 1 hr must be a positive number').positive('Price 1 hr must be a positive number'),
        price8hr: z.number({ required_error: 'Price 8 hr Value is required', }).min(1, 'Price 8 hr must be a positive number').positive(' Price 8 hr must be a positive number'),
        price12hr: z.number({ required_error: 'Price 12 hr Value is required', }).min(1, 'Price 12 hr must be a positive number').positive('Price 12 hr must be a positive number'),
        fullDay: z.number({ required_error: 'Price full day Value is required', }).min(1, 'Price full day must be a positive number').positive('Price full day must be a positive number'),
      }),
    // startDate: z
    //   .string({ required_error: 'Start Date is required' })
    //   .transform(date => new Date(date)),
    // endDate: z
    //   .string({ required_error: 'End Date is required' })
    //   .refine(date => !isNaN(Date.parse(date)), {
    //     message: 'Invalid End Date format',
    //   })
    //   .transform(date => new Date(date)),
      availableDates: z.array(dateRangeSchema).default([]),
    unavailableDates: z.array(dateRangeSchema).default([]),
   insuranceExpiry: z
  .string({ required_error: 'Insurance expiry date is required' })
  .min(1, 'Insurance expiry date is required'),

           carColor: z
          .string({
            required_error: 'Car color Value is required',
          }).min(1, 'Car color is required'),
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
    carImage: z.array(z.any()), // ✅ ADDED
  })
  .strict();

const UpdateCars = () => {
  const { id } = useParams();
  console.log("id", id)
  const navigate = useNavigate();

  const {
    data: carDataResponse,
    isLoading: isCarLoading,
    isError: isCarDataError,
    error: carDataError,
  } = useGetViewCars(id);

  const onSuccessUpdateCar = data => {
    Toast('success', data?.message || 'Car Updated Successfully');
    navigate('/car');
  };
  const { mutate: updateCar, isPending: isUpdateCarPending } =
    useUpdateCars(onSuccessUpdateCar);

  // Initialize the form
  const handleResetCarForm = () => {
    form.reset({
      carName: '',
      carModal: undefined,
      carGear: '',
      carType: '',
      carSeat: undefined,
      price: undefined,
      fastag: false,
      isAvailable: false,
       insuranceExpiry: undefined,
      carColor: '',
     availableDates: [],
    unavailableDates: [],
      location: undefined,
      hostName: '',
      isActive: true,
      feature: [],
      images: [],
       chassicNo : '',
      engineNo : '',
      NumberPlate : ''
    });

    setImagePreviews({});
  };

  const form = useForm({
    resolver: zodResolver(updateCarValidationSchema),
    defaultValues: {
      carName: '',
      carModal: undefined,
      carGear: undefined,
      carType: undefined,
      carSeat: undefined,
      price: undefined,
      fastag: false,
      isAvailable: false,
       availableDates: [],
    unavailableDates: [],
           insuranceExpiry: undefined,
      carColor: '',
      location: undefined,
      hostName: '',
      isActive: true,
      feature: [],
      images: [],
      carImage: [],
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
  const {
    fields: imageFields,
    append: appendImage,
    remove: removeImage,
  } = useFieldArray({
    control,
    name: 'images',
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

  const [carData, setCarData] = useState({});

 
  console.log("carDataResponse", carDataResponse)
  useEffect(() => {
    const carData = carDataResponse?.data;
    if (carData) {
      setCarData(carData);
      const previews = {};
      carData.carImage?.forEach((img, index) => {
        previews[index] = typeof img === 'string' ? `${BASE_API_URL}/static/${img}` : URL.createObjectURL(img); // adjust path if needed
      });

      setImagePreviews(previews);

      form.reset({
        carName: carData.carName || '',
        carModal: carData.carModal
          ? new Date(carData.carModal).toISOString().split('T')[0]
          : '',
        carGear: carData.carGear || '',
        carType: carData.carType || '',
        carSeat: Number(carData.carSeat) || '',
        price: carData.price || '',
        fastag: carData.fastag,
        isAvailable: carData.isAvailable,
        hostName: carData.hostName || '',
        chassicNo: carData.chassicNo || '',
        engineNo: carData.engineNo || '',
        NumberPlate: carData.NumberPlate || '',
        insuranceExpiry: carData.insuranceExpiry
          ? new Date(carData.insuranceExpiry).toISOString().split('T')[0]
          : '',
            carColor: carData.carColor || '',
        // startDate: carData.startDate
        //   ? new Date(carData.startDate).toISOString().split('T')[0]
        //   : '',
        // endDate: carData.endDate
        //   ? new Date(carData.endDate).toISOString().split('T')[0]
        //   : '',
        availableDates:carData.availableDates || [],
        unavailableDates:carData.unavailableDates || [],
        location: carData.location || '',
        feature: carData.feature || [],
        images: carData.carImage || [],
        carImage: carData.carImage || [],
      });
    }
  }, [carDataResponse, form.reset]);
  console.log("carData", carData)
  const [removedImages, setRemovedImages] = useState([]);

  // Form submission handler
  function onSubmit(data) {
    console.log("data", data)
    const formData = new FormData();

    formData.append('carName', data.carName);
    formData.append('carModal', new Date(data.carModal).toISOString());
    formData.append('insuranceExpiry', new Date(data.insuranceExpiry).toISOString());
    formData.append('carColor', data.carColor);
    formData.append('carGear', data.carGear);
    formData.append('carType', data.carType);
    formData.append('carSeat', data.carSeat);
    formData.append('price', JSON.stringify(data.price));
    formData.append('fastag', data.fastag);
    formData.append('isAvailable', data.isAvailable);
    formData.append('hostName', data.hostName);
    // formData.append('startDate', new Date(data.startDate).toISOString());
    // formData.append('endDate', new Date(data.endDate).toISOString());
     formData.append('availableDates', JSON.stringify(data.availableDates));
    if(data.unavailableDates){
      formData.append('unavailableDates', JSON.stringify(data.unavailableDates));
    }

    formData.append('location', data.location);
      formData.append('chassicNo', data.chassicNo);
    formData.append('engineNo', data.engineNo);
    formData.append('NumberPlate', data.NumberPlate);

    formData.append('feature', data.feature);
    if (removedImages.length > 0) {
      formData.append('imageToRemove', removedImages.join(','));
    }

    if (data.images) {
      data.images.forEach((fileWrapper, idx) => {
        const file = fileWrapper instanceof FileList ? fileWrapper[0] : fileWrapper;
        if (file instanceof File) {
          formData.append('images', file); // Backend should expect 'images' as an array
        }
      });
    }
    updateCar({
      id,
      data: formData,
    });
  }

  // Loading state
  if (isCarLoading) {
    return <div>Loading car details...</div>;
  }

  // Loading state
  if (isCarDataError) {
    return (
      <div className="text-danger font-semibold">{carDataError.message}</div>
    );
  }

  return (
    <div className="container">
      <h1 className="text-2xl font-bold mb-6">Update Car</h1>
      
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit, onFormErrors)}
          className="space-y-8 w-full max-w-5xl"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
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
           
            <FormField
              control={form.control}
              name="carGear"
              render={({ field }) => (

                <FormItem>
                <FormLabel>Car Gear Type</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
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
                    value={field.value}
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
                  <FormLabel>Price (1 hr to 8 hr)</FormLabel>
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
                  <FormLabel>Price (8 hr to 12 hr)</FormLabel>
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
                  <FormLabel>Price (12 hr to 24 hr)</FormLabel>
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
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select carlocation" />
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
                  Enter car color
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

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
                        const currentImage = form.getValues(`images.${index}`);

                        // Only add image name if it's an existing image (i.e., a string, not a File)
                        if (typeof currentImage === 'string') {
                          setRemovedImages(prev => [...prev, currentImage]);
                        }

                        // Remove from field array
                        removeImage(index);

                        // Remove preview
                        setImagePreviews(prev => {
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
          {/* Submit and Action Buttons */}
          <div className="flex justify-end space-x-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/car')}
            >
              Cancel
            </Button>


            <Button
              onClick={handleResetCarForm}
              variant="secondary"
            >
              {'Reset Car'}
            </Button>
            <Button type="submit" disabled={isUpdateCarPending}>
              {isUpdateCarPending ? 'Updating...' : 'Update Car'}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default UpdateCars;
