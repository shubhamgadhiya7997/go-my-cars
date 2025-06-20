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
import { BASE_API_URL } from '@/utils/constants';


import Toast from '@/components/toast/commonToast';
import { useNavigate, useParams } from 'react-router-dom';
import { onFormErrors } from '@/utils/helper';
import { useState, useEffect } from 'react';
import { Loader2, Plus, Trash2 } from 'lucide-react';

import { useGetBannerId, useUpdateBanner, useUpdateBannerId } from '@/hooks/api/banner';

// Define the update banner validation schema (same as create banner)
const updateCouponValidationSchema = z
  .object({
    isSelected: z.boolean().default(false), // ✅ ADDED
    images: z.array(z.any()), // ✅ ADDED
     carImage: z.array(z.any()), // ✅ ADDED
  })
  .strict();

// Define the update banner component
const UpdateBanner = () => {
  const { id } = useParams();
  console.log("id", id)
  const navigate = useNavigate();

  // Fetch banner details
  const {
    data: bannerDataResponse,
    isLoading: isCouponLoading,
    isError: isCouponDataError,
    error: couponDataError,
    refetch: refetchBanner,
  } = useGetBannerId(id);

 
  // Update banner mutation
  const onSuccessUpdateCoupon = (data: any) => {
    Toast('success', data?.message || 'banner Updated Successfully');
    navigate('/banner');
  };
  const { mutate: updateBanner, isPending: isUpdateCouponPending } =
    useUpdateBannerId(onSuccessUpdateCoupon);

type UpdateBannerSchema = z.infer<typeof updateCouponValidationSchema>;

  const form = useForm<UpdateBannerSchema>({
    resolver: zodResolver(updateCouponValidationSchema),
    defaultValues: {
      isSelected: false,
      images: [],
      carImage: [],
    },
  });
  const { control, register } = form;
  const [imagePreviews, setImagePreviews] : any = useState({});

  
  const {
    fields: imageFields,
    append: appendImage,
    remove: removeImage,
  } = useFieldArray({
    control,
    name: 'images',
  });

  const [bannerData, setBannerData] = useState({});

  useEffect(() => {
    const bannerData = bannerDataResponse?.data;
    if (bannerData) {
      setBannerData(bannerData);
      const previews: any = {};
      bannerData.carImage?.forEach((img : any, index: any) => {
        previews[index] = typeof img === 'string' ? `${BASE_API_URL}/static/${img}` : URL.createObjectURL(img); // adjust path if needed
      });

      setImagePreviews(previews);

      form.reset({
        isSelected: bannerData.isSelected,
        images: bannerData.carImage || [],
        carImage: bannerData.carImage || [],
      });
    }
  }, [bannerDataResponse, form.reset, refetchBanner]);
  const [removedImages, setRemovedImages] = useState([]);

  // Form submission handler
  function onSubmit(data: any) {
    console.log("data", data)
    const formData = new FormData();

    formData.append('isSelected', data.isSelected);
    if (removedImages.length > 0) {
      formData.append('imageToRemove', removedImages.join(','));
    }

    // Append images
    if (data.images) {
      data.images.forEach((fileWrapper: any, idx: any) => {
        const file = fileWrapper instanceof FileList ? fileWrapper[0] : fileWrapper;
        if (file instanceof File) {
          formData.append('images', file); // Backend should expect 'images' as an array
        }
      });
    }
    updateBanner({
      id,
      data: formData,
    });
  }

  // Loading state
  if (isCouponLoading) {
    return <div>Loading banner details...</div>;
  }

  // Loading state
  if (isCouponDataError) {
    return (
      <div className="text-danger font-semibold">{couponDataError.message}</div>
    );
  }

  return (
    <div className="container">
      <h1 className="text-2xl font-bold mb-6">Update Banner</h1>
      {/* Coupon Usage Statistics */}

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit, onFormErrors)}
          className="space-y-8 w-full max-w-5xl"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
            <FormField
              control={form.control}
              name="isSelected"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">isSelected</FormLabel>
                    <FormDescription>
                      Toggle to activate or deactivate the isSelected
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
                          setImagePreviews((prev:any) => ({ ...prev, [index]: previewUrl }));
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
                        setImagePreviews((prev: any) => {
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
              onClick={() => navigate('/banner')}
            >
              Cancel
            </Button>

    
            <Button type="submit" disabled={isUpdateCouponPending}>
              {isUpdateCouponPending ? 'Updating...' : 'Update Banner'}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default UpdateBanner;
