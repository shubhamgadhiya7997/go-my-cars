import { useEffect, useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import Toast from "@/components/toast/commonToast";
import { useCreateFees, useCreatePrivacy, useCreateSetting, useSetting } from "@/hooks/api/setting";
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

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from 'zod';
import { onFormErrors } from '@/utils/helper';
import { useCreateCar } from "@/hooks/api/cars";
import { useNavigate } from "react-router-dom";

function MediaAssetsHome() {
  const onSuccessHandler = (data: { message: string }) => {
    Toast("success", data?.message || "Terms and condition added successfully");
    console.log("Terms and condition:", data);
    refetch()
  };

  const onSuccessPrivacyHandler = (data: { message: string }) => {
    Toast("success", data?.message || "Privacy policy added successfully");
    console.log("Privacy policy:", data);
    refetch()
  };
  const {
    mutate,
    isSuccess,
    isPending: isAdding,
  } = useCreateSetting(onSuccessHandler);

  const {
    mutate: privacy,
    isSuccess: success,
    isPending: adding,
  } = useCreatePrivacy(onSuccessPrivacyHandler);
  const {
    data,
    isPending: isMediaAssets,
    refetch,
  } = useSetting(onSuccessHandler);
  console.log("1data", data)

  const [deletedImageId, setDeletedImageId] = useState<string[]>([]);
  const [imageList, setImageList] = useState<
    { id: string; fileName: string }[]
  >([]);
  const [privacyPolicy, setPrivacyPolicy] = useState<
    { id: string; fileName: string }[]
  >([]);
  console.log("imageList", imageList)
  const [files, setFiles] = useState<File[] | null>([]);
  const [privacyFiles, setPrivacyFiles] = useState<File[] | null>([]);

  console.log("files", files)
  console.log("privacyFiles", privacyFiles)
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log("1e.target", e.target)
    if (e.target.files) {
      setFiles(Array.from(e.target.files)); // Convert FileList to Array
    }
  };

  const handlePrivcyFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log("2e.target", e.target)
    if (e.target.files) {
      setPrivacyFiles(Array.from(e.target.files)); // Convert FileList to Array
    }
  };

  useEffect(() => {
    if (isSuccess || success) {
      setFiles([]);
      setPrivacyFiles([]);
      setDeletedImageId([]);
    }
  }, [isSuccess, success]);
  console.log("data", data?.data)
  useEffect(() => {
    setImageList(data?.data?.termsAndCondition);
    setPrivacyPolicy(data?.data?.privacyPolicy);
  }, [data?.data]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (files.length === 0) return;

    const formData = new FormData();

    files.forEach((file) => {
      formData.append("termsandcondition", file); // Append each file
    });



    mutate(formData);
  };

  const handleprivacySubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (privacyFiles.length === 0) return;

    const formData = new FormData();

    privacyFiles.forEach((file) => {
      formData.append("privacyPolicy", file); // Append each file
    });

    privacy(formData);
  };
  const ValidationSchema = z
    .object({
             convenienceFees: z.number({ required_error: 'convenience fees is required', }).min(1, 'convenience fees is required').positive('convenience fees is required'),
             protectionFees: z.number({ required_error: 'protection fees is required', }).min(1, 'protection fees is required').positive('protection fees is required'),
       
    })
      .strict();
const form = useForm({
    resolver: zodResolver(ValidationSchema),
    defaultValues: {
      convenienceFees: undefined,
      protectionFees: undefined
    }
  })
 const { control, register } = form;

function onSubmit(data) {
    console.log("123data", data)
    createFees(data)
}
  const navigate = useNavigate();
  const onSuccess = data => {
    Toast('success', data?.message || 'Fees Added Successfully');
    navigate('/setting');
  };

  useEffect(() => {
     form.reset({
convenienceFees: data?.data?.convenienceFees,
      protectionFees: data?.data?.protectionFees
     })
  }, [data, form.reset])
  const { mutate: createFees, } =
    useCreateFees(onSuccess);


  return (
    <>
      <h1 className="text-2xl font-bold mb-6">Settings</h1>
      <p className="flex rounded-xl border bg-card text-card-foreground shadow justify-space-between">
      
        <CardContent>
          <h1 className=" font-semibold leading-none tracking-tight">Upload a terms And Condition</h1>
          <p className="text-sm text-muted-foreground">  Select a file to upload and click the upload button.</p>
          <form onSubmit={handleSubmit} className="grid gap-4">
            <div className="flex items-center justify-left w-full">
              <label
                htmlFor="dropzone-file"
                className="flex flex-col items-center justify-center w-[50%] h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"
              >
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <UploadIcon className="w-10 h-10 text-gray-400" />
                  <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                    <span className="font-semibold">Click to upload</span>
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    PDF
                  </p>
                </div>
                <input
                  id="dropzone-file"
                  type="file"
                  accept="application/pdf"
                  className="hidden"

                  onChange={handleFileChange}
                />
              </label>
            </div>
            {files && (
              <div className="flex items-center justify-between">
                <div className="flex flex-wrap">
                  {files.map((file, index) => (
                    <div key={index} className="flex">
                      <div>
                        <p className="font-medium">{file.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {(file.size / 1024).toFixed(2)} KB
                        </p>
                      </div>
                      <div className="bg-green-800 h-full w-[1px] mx-2 rounded-full"></div>
                    </div>
                  ))}
                </div>
                {files.length > 0 && (
                  <Button type="submit" disabled={isAdding}>
                    {isAdding ? <p>Uploading...</p> : <p>Upload</p>}
                  </Button>
                )}
              </div>
            )}
          </form>

        
              <div

                className="w-auto overflow-hidden relative"
              >
             
<p>{imageList ?? "upload terms and condition"}</p>

              </div>

        </CardContent>

           <CardContent>
                 <h1 className="font-semibold leading-none tracking-tight">Upload a privacy policy</h1>
          <p className="text-sm text-muted-foreground">   Select a file to upload and click the upload button.</p>
        
          <form onSubmit={handleprivacySubmit} className="grid gap-4">
            <div className="flex items-center justify-left w-full">
              <label
                htmlFor="dropzone-file1"
                className="flex flex-col items-center justify-center w-[50%] h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"
              >
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <UploadIcon className="w-10 h-10 text-gray-400" />
                  <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                    <span className="font-semibold">Click to upload1</span>
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    PDF
                  </p>
                </div>
                <input
                  id="dropzone-file1"
                  type="file"
                  accept="application/pdf"
                  className="hidden"

                  onChange={handlePrivcyFileChange}
                />
              </label>
            </div>
            {privacyFiles && (
              <div className="flex items-center justify-between">
                <div className="flex flex-wrap">
                  {privacyFiles.map((file, index) => (
                    <div key={index} className="flex">
                      <div>
                        <p className="font-medium">{file.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {(file.size / 1024).toFixed(2)} KB
                        </p>
                      </div>
                      <div className="bg-green-800 h-full w-[1px] mx-2 rounded-full"></div>
                    </div>
                  ))}
                </div>
                {privacyFiles.length > 0 && (
                  <Button type="submit" disabled={isAdding}>
                    {isAdding ? <p>Uploading...</p> : <p>Upload</p>}
                  </Button>
                )}
              </div>
            )}
          </form>


          <div

            className="w-auto overflow-hidden relative"
          >
            <p>{privacyPolicy ?? "upload privacy policy"}</p>


          </div>
        </CardContent>
      </p>



        <Card>
        <CardHeader>
          <CardTitle>Fees Structure</CardTitle>
          
        </CardHeader>
        <CardContent>
          <Form {...form}>
           <form
                    onSubmit={form.handleSubmit(onSubmit, onFormErrors)}
                    className="space-y-8 w-full max-w-5xl"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            <FormField
                       control={form.control}
                       name="convenienceFees"
                       render={({ field }) => (
                         <FormItem>
                           <FormLabel>Convenience Fees</FormLabel>
                           <FormControl>
                             <Input
                             type="number"
                               placeholder="Enter convenience fees"
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
                       name="protectionFees"
                       render={({ field }) => (
                         <FormItem>
                           <FormLabel>Protection Fees</FormLabel>
                           <FormControl>
                             <Input
                             type="number"
                               placeholder="Enter protection fees"
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
                     </div>
                       <div className="flex justify-end space-x-4 ">
                   
                    <Button type="submit">
                       Submit
                    </Button>
                  </div>
</form>
       </Form>
        </CardContent>
       
      </Card>
    </>
  );
}

function UploadIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="17 8 12 3 7 8" />
      <line x1="12" x2="12" y1="3" y2="15" />
    </svg>
  );
}

export default MediaAssetsHome;
