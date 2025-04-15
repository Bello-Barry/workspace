"use client";
import { useState, useRef, ChangeEvent } from "react";
import { supabase } from "@/lib/supabaseClient";
import { toast } from "react-toastify";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface ImageUploaderProps {
  onUpload: (urls: string[]) => void;
  bucket: string;
  maxFiles?: number;
}

export default function ImageUploader({ 
  onUpload, 
  bucket, 
  maxFiles = 5 
}: ImageUploaderProps) {
  const [previews, setPreviews] = useState<string[]>([]);
  const [files, setFiles] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;

    const newFiles = Array.from(e.target.files);
    const totalFiles = files.length + newFiles.length;

    if (totalFiles > maxFiles) {
      toast.error(`Maximum ${maxFiles} images autorisées`);
      return;
    }

    const newPreviews = newFiles.map(file => URL.createObjectURL(file));
    setPreviews(prev => [...prev, ...newPreviews]);
    setFiles(prev => [...prev, ...newFiles]);
  };

  const removeImage = (index: number) => {
    URL.revokeObjectURL(previews[index]);
    setPreviews(prev => prev.filter((_, i) => i !== index));
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const uploadImages = async () => {
    if (files.length === 0) {
      toast.error("Veuillez sélectionner au moins une image");
      return;
    }

    setIsUploading(true);
    try {
      const uploadedUrls: string[] = [];

      for (const file of files) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random().toString(36).substring(2, 9)}-${Date.now()}.${fileExt}`;
        const filePath = `${fileName}`;

        const { error } = await supabase.storage
          .from(bucket)
          .upload(filePath, file);

        if (error) throw error;

        const { data: { publicUrl } } = supabase.storage
          .from(bucket)
          .getPublicUrl(filePath);

        uploadedUrls.push(publicUrl);
      }

      onUpload(uploadedUrls);
      toast.success("Images téléchargées avec succès");
    } catch (error: any) {
      console.error("Erreur:", error);
      toast.error(error.message || "Erreur de téléchargement");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-4">
        {previews.map((preview, index) => (
          <div key={index} className="relative group h-32 w-32">
            <img
              src={preview}
              alt={`Preview ${index}`}
              className="h-full w-full object-cover rounded-md border"
            />
            <button
              type="button"
              onClick={() => removeImage(index)}
              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-4">
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileChange}
          className="hidden"
          ref={fileInputRef}
          disabled={isUploading || previews.length >= maxFiles}
        />
        <Button
          type="button"
          variant="outline"
          onClick={triggerFileInput}
          disabled={isUploading || previews.length >= maxFiles}
        >
          {previews.length > 0 ? "Ajouter plus" : "Sélectionner"} ({previews.length}/{maxFiles})
        </Button>

        {previews.length > 0 && (
          <Button
            type="button"
            onClick={uploadImages}
            disabled={isUploading}
          >
            {isUploading ? "Envoi en cours..." : "Valider les images"}
          </Button>
        )}
      </div>
    </div>
  );
}