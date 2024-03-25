import { Loader, Loader2 } from "lucide-react";

export default function Loading() {
  // You can add any UI inside Loading, including a Skeleton.
  return (
    <div className="w-full flex items-center justify-center mt-8">
      <Loader2 className="animate-spin text-lg " />
    </div>
  );
}
