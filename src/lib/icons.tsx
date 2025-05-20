// utils/getFileIcon.tsx
import React from "react";
import {
  File,
  FileText,
  FileType,
  FileSpreadsheet,
  FileImage,
  FileCode2,
  // FileBarChart2,
} from "lucide-react";

type IconProps = {
  className?: string;
};

export function getFileIcon(ext: string): JSX.Element {
  const iconProps: IconProps = { className: "h-5 w-5" };

  switch (ext.toLowerCase()) {
    case "txt":
      return <File {...iconProps} className="h-5 w-5 text-yellow-500" />;
    case "pdf":
      return <FileText {...iconProps} className="h-5 w-5 text-red-600" />;
    case "csv":
    case "xlsx":
      return <FileSpreadsheet {...iconProps} className="text-green-600" />;
    case "ipynb":
    case "py":
    case "x-shellscript":
    case "x-python":
    case "x-java":
      return <FileCode2 {...iconProps} className="text-purple-500" />;
    case "docx":
      return <FileText {...iconProps} className="text-blue-700" />;
    case "html":
    case "htm":
      return <FileCode2 {...iconProps} className="text-orange-500" />;
    case "png":
    case "jpg":
    case "jpeg":
      return <FileImage {...iconProps} className="text-pink-500" />;
    default:
      return <FileType {...iconProps} className="text-gray-400" />;
  }
}
