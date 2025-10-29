import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useState } from "react";
import axios from "axios";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { Plus } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";
import { IPhoto, Photo } from "@/lib/validators";
type IProps = {
  albums: IAlbums[] | undefined;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

const GalleryModalCreate = ({ albums, open, onOpenChange }: IProps) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const form = useForm({
    resolver: zodResolver(Photo),
    defaultValues: {
      title: "",
      url: "",
      albumId: 1,
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64Url = reader.result as string;
        setPreviewUrl(base64Url);
        form.setValue("url", base64Url);
        form.setValue("thumbnailUrl", base64Url);
      };
      reader.readAsDataURL(file);
    }
  };

  const mutation = useMutation({
    mutationFn: async (newPhoto: any) => {
      return axios.post("/api/photos", {
        title: newPhoto.title,
        url: newPhoto.url,
        thumbnailUrl: newPhoto.thumbnailUrl,
        albumId: newPhoto.albumId,
      });
    },
    mutationKey: ["photos"],
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["photos"] });

      onOpenChange(false);
      setPreviewUrl(null);
      form.reset({ title: "", url: "", albumId: 1 });
      toast.success("Thêm ảnh thành công!", {
        style: {
          "--normal-bg": "var(--background)",
          "--normal-text":
            "light-dark(var(--color-green-600), var(--color-green-400))",
          "--normal-border":
            "light-dark(var(--color-green-600), var(--color-green-400))",
        } as React.CSSProperties,
      });
    },
    onError: (error: any) => {
      toast.error(
        " Lỗi: " + (error?.response?.data?.message || "Không thể thêm ảnh")
      );
    },
  });
  function onSubmit(values: IPhoto) {
    mutation.mutate({
      title: values.title,
      url: values.url,
      thumbnailUrl: values.url,
      albumId: values.albumId || 1,
    });
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Plus /> Thêm Ảnh Mới
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] " aria-describedby={undefined}>
        <DialogHeader>
          <DialogTitle>Thêm Ảnh Mới</DialogTitle>
          <DialogDescription>
            Nhập tiêu đề và chọn file ảnh từ máy tính
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="albumId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Album</FormLabel>
                  <Select
                    value={field.value?.toString()}
                    onValueChange={(value) => field.onChange(parseInt(value))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn album" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Albums</SelectLabel>
                        {albums?.map((album) => (
                          <SelectItem
                            key={album.id}
                            value={album.id.toString()}
                          >
                            {album.title}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tiêu Đề</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Nhập tiêu đề ảnh (ví dụ: Núi đẹp)"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormItem>
              <FormLabel>Chọn File Ảnh</FormLabel>
              <FormControl>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                />
              </FormControl>
              <FormDescription>
                Chọn file JPG, PNG hoặc WebP (max 5MB)
              </FormDescription>
            </FormItem>

            {previewUrl && (
              <div className="border rounded p-2">
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="w-full h-40 object-cover rounded"
                />
              </div>
            )}

            <FormField
              control={form.control}
              name="url"
              render={({ field }) => (
                <Input placeholder="url" {...field} hidden />
              )}
            />

            <Button
              type="submit"
              disabled={mutation.isPending}
              className="w-full"
            >
              {mutation.isPending ? (
                <div className="flex items-center">
                  <Spinner className="mr-3" /> <span>Đang thêm...</span>
                </div>
              ) : (
                "Thêm Ảnh"
              )}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default GalleryModalCreate;
