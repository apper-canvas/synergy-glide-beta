import { cn } from "@/utils/cn";

const Loading = ({ message = "Loading...", className }) => {
  return (
    <div className={cn("flex flex-col items-center justify-center py-12", className)}>
      <div className="relative w-16 h-16">
        <div className="absolute inset-0 border-4 border-slate-200 rounded-full"></div>
        <div className="absolute inset-0 border-4 border-primary-600 rounded-full border-t-transparent animate-spin"></div>
      </div>
      <p className="mt-4 text-sm text-slate-600">{message}</p>
    </div>
  );
};

export default Loading;