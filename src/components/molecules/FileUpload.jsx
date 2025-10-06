import { useState, useRef } from "react";
import { toast } from "react-toastify";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";
import { formatFileSize } from "@/utils/formatters";

const FileUpload = ({ 
  onUpload, 
  maxSize = 10485760, 
  acceptedTypes = "*",
  multiple = false,
  className 
}) => {
  const [dragOver, setDragOver] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const fileInputRef = useRef(null);
  
  const validateFile = (file) => {
    if (file.size > maxSize) {
      toast.error(`File size exceeds ${formatFileSize(maxSize)} limit`);
      return false;
    }
    return true;
  };
  
  const handleFiles = async (files) => {
    const fileArray = Array.from(files);
    const validFiles = fileArray.filter(validateFile);
    
    if (validFiles.length === 0) return;
    
    setUploading(true);
    setProgress(0);
    
    try {
      const progressInterval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 100);
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      clearInterval(progressInterval);
      setProgress(100);
      
      if (onUpload) {
        await onUpload(validFiles);
      }
      
      toast.success(`Successfully uploaded ${validFiles.length} file(s)`);
    } catch (error) {
      toast.error("Upload failed. Please try again.");
    } finally {
      setUploading(false);
      setProgress(0);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };
  
  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    handleFiles(e.dataTransfer.files);
  };
  
  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };
  
  const handleDragLeave = () => {
    setDragOver(false);
  };
  
  const handleClick = () => {
    fileInputRef.current?.click();
  };
  
  const handleChange = (e) => {
    if (e.target.files?.length) {
      handleFiles(e.target.files);
    }
  };
  
  return (
    <div className={cn("space-y-3", className)}>
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={handleClick}
        className={cn(
          "relative border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors duration-200",
          dragOver ? "border-primary-600 bg-primary-50" : "border-slate-300 hover:border-primary-400",
          uploading && "pointer-events-none opacity-50"
        )}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple={multiple}
          accept={acceptedTypes}
          onChange={handleChange}
          className="hidden"
        />
        
        <div className="flex flex-col items-center gap-3">
          <div className="w-16 h-16 rounded-full bg-primary-100 flex items-center justify-center">
            <ApperIcon name="Upload" size={32} className="text-primary-600" />
          </div>
          
          <div>
            <p className="text-sm font-medium text-slate-700">
              Drop files here or click to upload
            </p>
            <p className="text-xs text-slate-500 mt-1">
              Maximum file size: {formatFileSize(maxSize)}
            </p>
          </div>
        </div>
      </div>
      
      {uploading && (
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-600">Uploading...</span>
            <span className="text-slate-900 font-medium">{progress}%</span>
          </div>
          <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-primary-500 to-primary-600 transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default FileUpload;