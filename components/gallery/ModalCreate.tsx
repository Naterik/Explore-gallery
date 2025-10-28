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
import { v4 as uuidv4 } from "uuid";
import { useState } from "react";
import axios from "axios";
import { useQueryClient, useMutation } from "@tanstack/react-query";

const formSchema = z.object({
  id: z.string().uuid(),
  title: z.string().min(2, {
    message: "Title must be at least 2 characters.",
  }),
  url: z.string().optional(),
  file: z.instanceof(File).optional(),
});

const ModalCreate = () => {
  const [open, setOpen] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      url: "",
      id: uuidv4(),
    },
  });

  // ✅ Xử lý khi chọn file
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // ✅ Tạo preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const mutation = useMutation({
    mutationFn: async (newPhoto: any) => {
      if (newPhoto.file) {
        const formData = new FormData();
        formData.append("file", newPhoto.file);
        formData.append("title", newPhoto.title);
        formData.append("id", newPhoto.id);
        formData.append("albumId", newPhoto.albumId);

        return axios.post("/api/photos", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }

      // Nếu có URL, gửi thường
      return axios.post("/api/photos", newPhoto);
    },
    onSuccess: () => {
      console.log("✅ Thêm ảnh thành công!");
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      setOpen(false);
      setPreviewUrl(null);
      form.reset({ id: uuidv4(), title: "", url: "" });
      alert("✅ Thêm ảnh thành công!");
    },
    onError: (error: any) => {
      console.error("❌ Lỗi khi thêm ảnh:", error);
      alert(
        "❌ Lỗi: " + (error?.response?.data?.message || "Không thể thêm ảnh")
      );
    },
  });

  // ✅ Hàm onSubmit gọi mutation.mutate()
  function onSubmit(values: z.infer<typeof formSchema>) {
    // Kiểm tra bắt buộc có URL hoặc file
    const fileInput = document.querySelector(
      'input[type="file"]'
    ) as HTMLInputElement;
    const file = fileInput?.files?.[0];

    if (!values.url && !file) {
      alert("❌ Vui lòng nhập URL hoặc chọn file ảnh!");
      return;
    }

    mutation.mutate({
      id: values.id,
      title: values.title,
      url: values.url || "",
      file: file || null,
      thumbnailUrl: previewUrl || values.url || "",
      albumId: 1,
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">➕ Thêm Ảnh Mới</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Thêm Ảnh Mới</DialogTitle>
          <DialogDescription>
            Nhập tiêu đề và chọn file hoặc nhập URL ảnh
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* ID (ẩn) */}
            <FormField
              name="id"
              render={({ field }) => (
                <Input placeholder="id" {...field} hidden />
              )}
            />

            {/* Tiêu đề */}
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

            {/* Chọn file ảnh */}
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

            {/* Preview ảnh */}
            {previewUrl && (
              <div className="border rounded p-2">
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="w-full h-40 object-cover rounded"
                />
              </div>
            )}

            {/* Hoặc nhập URL */}
            <div className="text-center text-gray-500 text-sm">— HOẶC —</div>

            <FormField
              control={form.control}
              name="url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>URL Ảnh</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="https://example.com/image.jpg"
                      type="url"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Dán URL từ Unsplash, Pexels, ...
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Nút submit */}
            <Button
              type="submit"
              disabled={mutation.isPending}
              className="w-full"
            >
              {mutation.isPending ? "⏳ Đang thêm..." : "✅ Thêm Ảnh"}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default ModalCreate;
