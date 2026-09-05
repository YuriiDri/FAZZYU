import { useRef } from "react";
import { Trash2, Plus } from "lucide-react";
import { toast } from "sonner";
import { motion } from "motion/react";
import { useAppData } from "@/app/context/AppDataContext";

export default function AdminGalleryPage() {
  const { galleryImages, addGalleryImage, deleteGalleryImage } = useAppData();
  const fileRef = useRef<HTMLInputElement>(null);

  function handleFiles(files: FileList | null) {
    if (!files) return;
    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          addGalleryImage({
            id: `gal-${Date.now()}-${Math.random()}`,
            src: e.target.result as string,
          });
        }
      };
      reader.readAsDataURL(file);
    });
    toast.success("Photos added.");
  }

  function handleDelete(id: string) {
    deleteGalleryImage(id);
    toast.success("Photo removed.");
  }

  return (
    <div className="text-white">
      <div className="flex items-start justify-between mb-6 flex-wrap gap-4">
        <div>
          <h1 className="font-['Crimson_Text',serif] text-[56px] text-white leading-tight">
            Gallery
          </h1>
          <p className="font-['Roboto',sans-serif] text-[18px] text-white/70">
            Manage photos for your store gallery.
          </p>
        </div>
        <button
          onClick={() => fileRef.current?.click()}
          className="flex items-center gap-2 h-[56px] px-6 bg-[#ca498c] rounded-[15px] font-['Roboto',sans-serif] font-medium text-[18px] text-white hover:bg-[#b83d7a] transition-colors cursor-pointer"
        >
          <Plus className="w-5 h-5" />
          Add Photos
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
              className="relative group rounded-[20px] overflow-hidden aspect-[4/5]"
            >
              <img src={img.src} alt="" className="w-full h-full object-cover" />

              {/* Overlay controls - Trash button only */}
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