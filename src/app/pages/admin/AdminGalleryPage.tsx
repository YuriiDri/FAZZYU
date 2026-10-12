import { useRef, useState } from "react";
import { Trash2, Plus, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { motion } from "motion/react";
import { useAppData } from "@/app/context/AppDataContext";
import { supabase } from "@/lib/supabase"; // Update this path to where your Supabase client is initialized

export default function AdminGalleryPage() {
  const { galleryImages, addGalleryImage, deleteGalleryImage } = useAppData();
  const fileRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);

  async function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return;
    setIsUploading(true);

    try {
      // Process all files concurrently
      await Promise.all(
        Array.from(files).map(async (file) => {
          // 1. Generate a unique file name
          const fileExt = file.name.split('.').pop();
          const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
          const filePath = `gallery/${fileName}`;

          // 2. Upload the actual file to Supabase Storage (Bucket name: 'images')
          const { error: uploadError } = await supabase.storage
            .from('images')
            .upload(filePath, file, { cacheControl: '3600', upsert: false });

          if (uploadError) throw uploadError;

          // 3. Retrieve the public URL for the newly uploaded image
          const { data: { publicUrl } } = supabase.storage
            .from('images')
            .getPublicUrl(filePath);

          // 4. Save the global URL to your database/context
          await addGalleryImage({
            id: `gal-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
            src: publicUrl,
          });
        })
      );
      toast.success("Photos uploaded to cloud gallery globally.");
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Failed to upload photos to the cloud.");
    } finally {
      setIsUploading(false);
      if (fileRef.current) fileRef.current.value = ""; // Reset input
    }
  }

  async function handleDelete(id: string) {
    // Note: To fully clean up, you should also delete the file from Supabase Storage here.
    await deleteGalleryImage(id);
    toast.success("Photo removed from cloud gallery.");
  }

  return (
    <div className="text-white">
      <div className="flex items-start justify-between mb-6 flex-wrap gap-4">
        <div>
          <h1 className="font-['Crimson_Text',serif] text-[56px] text-white leading-tight">
            Gallery
          </h1>
          <p className="font-['Roboto',sans-serif] text-[18px] text-white/70">
            Manage photos for your store gallery. Syncs globally.
          </p>
        </div>
        <button
          onClick={() => fileRef.current?.click()}
          disabled={isUploading}
          className="flex items-center gap-2 h-[56px] px-6 bg-[#ca498c] rounded-[15px] font-['Roboto',sans-serif] font-medium text-[18px] text-white hover:bg-[#b83d7a] transition-colors cursor-pointer disabled:opacity-50"
        >
          {isUploading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Plus className="w-5 h-5" />}
          {isUploading ? "Uploading..." : "Add Photos"}
        </button>
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />
      </div>

      <div className="border-b border-white/20 mb-6" />

      {galleryImages.length === 0 ? (
        <div className="text-center py-20 text-white/40 font-['Roboto',sans-serif] text-[18px]">
          No photos yet. Click "+ Add Photos" to upload.
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {galleryImages.map((img) => (
            <motion.div
              key={img.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.25 }}
              className="relative group rounded-[20px] overflow-hidden aspect-[4/5] bg-black/40 border border-white/10"
            >
              <img src={img.src} alt="" className="w-full h-full object-cover" />

              {/* Overlay controls - Trash button */}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-start justify-end p-3">
                <button
                  onClick={() => handleDelete(img.id)}
                  className="w-8 h-8 rounded-full bg-black/60 flex items-center justify-center hover:bg-[#ca498c]/70 transition-colors cursor-pointer"
                >
                  <Trash2 className="w-4 h-4 text-[#ca498c]" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}