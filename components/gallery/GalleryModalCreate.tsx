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
import { PictureInPicture, Plus } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";
import { IPhoto, Photo } from "@/lib/validators";

type IProps = {
  albums: IAlbums[] | undefined;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: Omit<IPhoto, "id">) => Promise<void>;
  setPreviewUrl: (url: string | null) => void;
  previewUrl: string | null;
  isSubmitting: boolean;
  setIsSubmitting: (value: boolean) => void;
};

const GalleryModalCreate = ({
  albums,
  open,
  onOpenChange,
  onSubmit,
  setPreviewUrl,
  previewUrl,
  isSubmitting,
  setIsSubmitting,
}: IProps) => {
  const form = useForm<IPhoto>({
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

  const handleSubmitCreate = async (values: Omit<IPhoto, "id">) => {
    try {
      setIsSubmitting(true);
      await onSubmit(values);
      onOpenChange(false);
      setPreviewUrl(null);
      form.reset();
      toast.success("Thêm ảnh thành công!");
    } catch (error) {
      console.error("Error creating photo:", error);
      toast.error("Thêm ảnh thất bại!");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <button className="inline-flex items-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-semibold rounded-lg shadow-md hover:shadow-xl hover:scale-105 transition-all duration-300 active:scale-95 border border-white/30 dark:border-slate-700 group">
          <Plus className="w-5 h-5 transition-transform group-hover:rotate-90 duration-300" />
          <span className="hidden sm:inline">Thêm Ảnh Mới</span>
          <span className="sm:hidden">Thêm</span>
        </button>
      </DialogTrigger>
      <DialogContent
        className="sm:max-w-[425px] bg-white dark:bg-slate-900"
        aria-describedby={undefined}
      >
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <PictureInPicture /> Thêm Ảnh Mới
          </DialogTitle>
          <DialogDescription className="text-slate-600 dark:text-slate-400">
            Tải lên ảnh của bạn
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmitCreate)}
            className="space-y-6"
          >
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
                    <Input placeholder="Nhập tiêu đề ảnh " {...field} />
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
            </FormItem>

            {previewUrl && (
              <div className="relative group overflow-hidden rounded-lg border-2 border-slate-200 dark:border-slate-700">
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            )}

            <FormField
              control={form.control}
              name="url"
              render={({ field }) => (
                <Input placeholder="url" {...field} hidden />
              )}
            />

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full px-4 py-3 bg-linear-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-lg transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none disabled:hover:translate-y-0 active:scale-95"
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="flex gap-1">
                    <div
                      className="w-1.5 h-1.5 bg-white rounded-full animate-bounce"
                      style={{ animationDelay: "0s" }}
                    ></div>
                    <div
                      className="w-1.5 h-1.5 bg-white rounded-full animate-bounce"
                      style={{ animationDelay: "0.1s" }}
                    ></div>
                    <div
                      className="w-1.5 h-1.5 bg-white rounded-full animate-bounce"
                      style={{ animationDelay: "0.2s" }}
                    ></div>
                  </div>
                  <span>Đang tải lên...</span>
                </div>
              ) : (
                " Thêm Ảnh"
              )}
            </button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default GalleryModalCreate;
