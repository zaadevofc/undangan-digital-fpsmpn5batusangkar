"use client";

import Image from "next/image";
import { useSearchParams } from "next/navigation";

const Undangan = ({ peserta }: any) => {
  const tab = useSearchParams().get("tab") || "";

  return (
    <>
      <div
        className={`${
          tab == "" && "!translate-x-[0px]"
        } -translate-x-[600px] flex flex-col items-center my-auto transition-all ease-in-out delay-100 duration-300`}
      >
        <Image
          width={500}
          height={500}
          className="rounded-lg drop-shadow-2xls"
          src={"/p/fpsmpn5batusangkar-clean-layouts-top.png"}
          alt="fpsmpn5batusangkar"
        />
        <h1 className="font-semibold max-w-sm font-['Oooh_Baby'] text-4xl text-center mx-auto mt-8 mb-10 opacity-90">
          {peserta || "Peserta Yang Diundang"}
        </h1>
        <Image
          width={550}
          height={550}
          className="rounded-lg drop-shadow-2xls"
          src={"/p/fpsmpn5batusangkar-clean-layouts-bottom.png"}
          alt="fpsmpn5batusangkar"
        />
      </div>
    </>
  );
};

export default Undangan;
