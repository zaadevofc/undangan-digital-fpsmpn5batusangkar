"use client";

import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react";
import { useSession } from "next-auth/react";
import Loading from "./loading";

export const Providers = ({ children }: { children: React.ReactNode }) => {
  const { status } = useSession();

  if (status == 'loading') return <Loading />
  return (
    <>
      <Analytics />
      <SpeedInsights />
      <main>{children}</main>
    </>
  );
};
