import { Suspense } from "react";
import UsPassport from "./UsPassport";

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <UsPassport />
    </Suspense>
  );
}