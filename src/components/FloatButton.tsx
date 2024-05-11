"use client";

import { signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { FcGoogle } from "react-icons/fc";

const listTab = [
  { t: "share", p: true },
  { t: "undangan", h: "/invite/list", p: false },
  { t: "access", h: "/invite/access", p: true },
];

const FloatButton = () => {
  const { status, data: user }: any = useSession();
  const tab = useSearchParams().get("tab");
  const path = usePathname();

  return (
    <>
      <div
        className={`${
          status == "authenticated" && "!flex"
        } hidden fixed justify-center gap-3 inset-x-0 mx-auto bottom-0 z-50`}
      >
        {listTab.map((x) => {
          const Tbn = () => (
            <Link
              href={
                x.h
                  ? x.h == path
                    ? "/"
                    : x.h
                  : tab == x.t
                  ? "/"
                  : `/?tab=${x.t}`
              }
              className={`bg-[#98436E]/60 hover:bg-[#98436E] transition-all cursor-pointer rounded-t-lg drop-shadow-lg`}
            >
              <h1 className={`px-2 font-semibold`}>{x.t}</h1>
            </Link>
          );

          if (user?.role == "ADMIN") return <Tbn />;
          if (user?.role == "PESERTA") return !x.p && <Tbn />;
        })}
        <div
          onClick={() => signOut()}
          className="bg-[#98436E]/60 hover:bg-[#98436E] transition-all cursor-pointer rounded-t-lg drop-shadow-lg"
        >
          <h1 className={`px-2 font-semibold`}>logout</h1>
        </div>
      </div>
      <div
        className={`${
          status == "unauthenticated" && "!flex"
        } hidden fixed justify-center gap-3 inset-x-0 mx-auto bottom-0 z-50`}
      >
        <div
          onClick={() => signIn("google")}
          className="bg-[#98436E]/60 hover:bg-[#98436E] transition-all cursor-pointer rounded-t-lg drop-shadow-lg"
        >
          <h1 className={`flex items-center gap-2 px-2 font-semibold`}>
            <FcGoogle />
            Login
          </h1>
        </div>
      </div>
    </>
  );
};

export default FloatButton;
