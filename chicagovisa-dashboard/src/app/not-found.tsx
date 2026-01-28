// app/not-found.tsx
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center space-y-4 text-center">
      <h2 className="text-4xl font-bold text-deep-blue">
        404 - Page Not Found
      </h2>
      <p>The page you are looking for does not exist.</p>
      <Link href="/" className="text-white rounded size-fit">
        <Button>Return Home</Button>
      </Link>
    </div>
  );
}
