import Label from "@/components/atoms/Label";
import Input from "@/components/atoms/Input";
import Textarea from "@/components/atoms/Textarea";
import Select from "@/components/atoms/Select";
import { cn } from "@/utils/cn";

const FormField = ({ 
  label, 
  type = "text", 
  error, 
  required, 
  className,
  children,
  ...props 
}) => {
  const renderInput = () => {
    if (children) return children;
    
    switch (type) {
      case "textarea":
        return <Textarea error={error} {...props} />;
      case "select":
        return <Select error={error} {...props} />;
      default:
        return <Input type={type} error={error} {...props} />;
    }
  };
  
  return (
    <div className={cn("space-y-1", className)}>
      {label && <Label required={required} htmlFor={props.id}>{label}</Label>}
      {renderInput()}
      {error && (
        <p className="text-sm text-red-600 mt-1">{error}</p>
      )}
    </div>
  );
};

export default FormField;