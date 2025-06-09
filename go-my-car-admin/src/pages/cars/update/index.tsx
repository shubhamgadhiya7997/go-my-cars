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
import { BASE_API_URL, CAR_GEAR, CAR_TYPE } from '@/utils/constants';

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

const updateCarValidationSchema = z
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
      }).min(4, 'carModal min 4 number'),
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
      carSheet: undefined,
      carPrice: undefined,
      fastag: false,
      isAvailable: false,
      startDate: '',
      endDate: '',
      location: '',
      hostName: '',
      isActive: true,
      feature: [],
      images: [],
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
      carSheet: undefined,
      carPrice: undefined,
      fastag: false,
      isAvailable: false,
      startDate: new Date().toISOString().split('T')[0],
      endDate: '',
      location: '',
      hostName: '',
      isActive: true,
      feature: [],
      images: [],
      carImage: [],
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
        carModal: carData.carModal || '',
        carGear: carData.carGear || '',
        carType: carData.carType || '',
        carSheet: Number(carData.carSheet) || '',
        carPrice: carData.carPrice || '',
        fastag: carData.fastag,
        isAvailable: carData.isAvailable,
        hostName: carData.hostName || '',
        startDate: carData.startDate
          ? new Date(carData.startDate).toISOString().split('T')[0]
          : '',
        endDate: carData.endDate
          ? new Date(carData.endDate).toISOString().split('T')[0]
          : '',
        location: carData.location || '',
        feature: carData.feature || [],
        images: carData.carImage || [],
        carImage: carData.carImage || [],
      });
    }
  }, [carDataResponse, form.reset]);
  const [removedImages, setRemovedImages] = useState([]);

  // Form submission handler
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
            <FormField
              control={form.control}
              name="carGear"
              render={({ field }) => (

                <FormItem>
                  <FormLabel>carGear</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
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
                    value={field.value}
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
