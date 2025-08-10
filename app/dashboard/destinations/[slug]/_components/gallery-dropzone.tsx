"use client";

import { useDropzone } from "react-dropzone";
import { Upload, X } from "lucide-react";

export type PreviewFile = File & {
  preview: string;
};

interface GalleryDropzoneProps {
  files: PreviewFile[];
  setFiles: React.Dispatch<React.SetStateAction<PreviewFile[]>>;
}

export function GalleryDropzone({ files, setFiles }: GalleryDropzoneProps) {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { "image/*": [] },
    onDrop: (acceptedFiles) => {
      const newFiles = acceptedFiles.map((file) =>
        Object.assign(file, {
          preview: URL.createObjectURL(file),
        })
      );
      setFiles((prevFiles) => [...prevFiles, ...newFiles]);
    },
  });

  const removeFile = (fileToRemove: PreviewFile) => {
    setFiles((prevFiles) => prevFiles.filter((file) => file !== fileToRemove));
    URL.revokeObjectURL(fileToRemove.preview);
  };

  return (
    <div>
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-md p-8 text-center transition-all duration-200 cursor-pointer ${isDragActive ? "border-primary bg-primary/10" : "border-muted-foreground/20"}`}
      >
        <input {...getInputProps()} />
        <div className="p-4 bg-muted-foreground/5 rounded-full w-fit mx-auto mb-4">
          <Upload className="h-4 w-4 text-muted-foreground" />
        </div>
        {isDragActive ? (
          <p className="text-primary font-semibold">Drop the files here ...</p>
        ) : (
          <>
            <p className="text-muted-foreground text-sm font-medium mb-1">Drag & drop some files here, or click to select files</p>
            <p className="text-xs text-muted-foreground">PNG, JPG up to 10MB</p>
          </>
        )}
      </div>

      {files.length > 0 && (
        <div className="mt-4 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4">
          {files.map((file, index) => (
            <div key={index} className="relative group aspect-square">
              <img
                src={file.preview}
                alt={`preview ${index}`}
                className="w-full h-full object-cover rounded-md"
                onLoad={() => {
                  URL.revokeObjectURL(file.preview);
                }}
              />
              <button
                type="button"
                onClick={() => removeFile(file)}
                className="absolute top-1 right-1 bg-destructive text-destructive-foreground rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
