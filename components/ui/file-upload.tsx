"use client";

import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { FileText, UploadCloud, X } from "lucide-react";
import { toast } from "sonner";

interface FileUploadProps {
  file: File | null;
  onFileChange: (file: File | null) => void;
  accept?: string;
  maxSize?: number; // in MB
  label?: string;
  description?: string;
  className?: string;
}

export function FileUpload({  file,
  onFileChange,
  accept = "application/pdf",
  maxSize = 10,
  label: _label = "Upload file",
  description,
  className,
}: FileUploadProps) {
  void _label;
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const validateFile = (file: File): boolean => {
    if (accept && !file.type.match(accept.replace("*", ".*"))) {
      toast.error(
        `Please upload a ${accept.split("/")[1].toUpperCase()} file.`,
      );
      return false;
    }
    if (file.size > maxSize * 1024 * 1024) {
      toast.error(`File size must be less than ${maxSize}MB.`);
      return false;
    }
    return true;
  };

  const handleFileSelect = (selectedFile: File | null) => {
    if (selectedFile && !validateFile(selectedFile)) {
      return;
    }
    onFileChange(selectedFile);
  };

  return (
    <div className={className}>
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0] || null;
          handleFileSelect(f);
        }}
      />
      <div
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            fileInputRef.current?.click();
          }
        }}
        onClick={() => fileInputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragging(false);
          const dropped = e.dataTransfer.files?.[0];
          if (!dropped) return;
          handleFileSelect(dropped);
        }}
        className={[
          "bg-muted/50 hover:bg-muted/70 border-2 border-dashed rounded-lg p-6 transition-colors outline-none",
          "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
          isDragging ? "border-ring" : "border-input",
        ].join(" ")}
      >
        {!file ? (
          <div className="flex flex-col items-center justify-center gap-3 text-center">
            <UploadCloud className="h-8 w-8 text-muted-foreground" />
            <div className="text-sm">Drag & drop your file here</div>
            <div className="text-xs text-muted-foreground">or</div>
            <Button
              type="button"
              variant="outline"
              onClick={(e) => {
                e.stopPropagation();
                fileInputRef.current?.click();
              }}
            >
              Choose file
            </Button>
            <div className="text-xs text-muted-foreground">
              {accept.split("/")[1].toUpperCase()} only. Max {maxSize}MB.
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-between gap-4">
            <div className="flex min-w-0 items-center gap-3">
              <FileText className="h-6 w-6 text-muted-foreground" />
              <div className="min-w-0">
                <div className="truncate text-sm font-medium">{file.name}</div>
                <div className="text-xs text-muted-foreground">
                  {(file.size / 1024 / 1024).toFixed(2)} MB
                </div>
              </div>
            </div>
            <div className="flex shrink-0 items-center gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  fileInputRef.current?.click();
                }}
              >
                Replace
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onFileChange(null);
                  if (fileInputRef.current) fileInputRef.current.value = "";
                }}
                aria-label="Remove file"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </div>
      {description && (
        <p className="mt-2 text-xs text-muted-foreground">{description}</p>
      )}
    </div>
  );
}
