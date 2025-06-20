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
import { useCreateBanner } from '@/hooks/api/banner';
import Toast from '@/components/toast/commonToast';
import { useNavigate } from 'react-router-dom';
import { onFormErrors } from '@/utils/helper';
import { Loader2, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';

// Define the plan schema with Zod
const createBannerValidationSchema = z
  .object({
 
    isSelected: z.boolean().default(false), // ✅ ADDED
    images: z.array(z.any()), // ✅ ADDED
  })
  .strict();

// Define the form component
const CreateBanner = () => {
  const navigate = useNavigate();
  const onSuccessCreateBanner = (data: any) => {
    Toast('success', data?.message || 'Banner Added Successfully');
    navigate('/banner');
  };
  const { mutate: createBanner, isPending: iscreateBannerPending } =
    useCreateBanner(onSuccessCreateBanner);

  // Initialize the form with default values
  type CreateBannerSchema = z.infer<typeof createBannerValidationSchema>;

  const form = useForm<CreateBannerSchema>({
    resolver: zodResolver(createBannerValidationSchema),
    defaultValues: {
      isSelected: false,
    },
  });
  const { control, register } = form;
  const [imagePreviews, setImagePreviews]: any = useState({});

  
  const {
    fields: imageFields,
    append: appendImage,
    remove: removeImage,
  } = useFieldArray({
    control,
    name: 'images',
  });

  function onSubmit(data: any) {
    console.log("data", data)
    const formData = new FormData();

    formData.append('isSelected', data.isSelected);
   
    // Append images
    if (data.images) {
      data.images.forEach((fileWrapper: any, idx: any) => {
        const file = fileWrapper instanceof FileList ? fileWrapper[0] : fileWrapper;
        if (file instanceof File) {
          formData.append('images', file); // Backend should expect 'images' as an array
        }
      });
    }

    createBanner(formData);
  }

  return (
    <div className="container  ">
      <h1 className="text-2xl font-bold mb-6">Create New Banner</h1>
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
                          setImagePreviews((prev: any) => ({ ...prev, [index]: previewUrl }));
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

          {/* Submit Button */}
          <div className="flex justify-end space-x-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/banner')}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={iscreateBannerPending}>
              {iscreateBannerPending ? 'Creating...' : 'Create Banner'}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default CreateBanner;
