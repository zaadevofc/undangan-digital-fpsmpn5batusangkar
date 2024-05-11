"use client";

import { signal } from "@preact/signals-react";
import dayjs from "dayjs";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useState } from "react";
import { useAsync } from "react-async-hook";
import { LuBellDot } from "react-icons/lu";
import Loading from "~/app/loading";
import FloatButton from "~/components/FloatButton";
import { fetchJson, postJson } from "~/consts";

const lists = async () => await fetchJson(`/api/signal/list`);
const length = signal(0);

const InvitList = () => {
  let { result, loading } = useAsync(lists, []);
  let [isSearch, setSearch] = useState("");
  let [isDelLoading, setDelLoading] = useState("");
  let { data: user }: any = useSession();

  const handleDelete = async (id: any, i: any) => {
    setDelLoading(id);
    const res = await postJson("/api/signal/delete", { id });
    delete result.data[i];
    length.value++;
    setDelLoading("");
  };

  if (loading) return <Loading />;
  return (
    <>
      <section
        className={`overflow-hidden max-w-lg mx-auto flex min-h-dvh w-full pb-20`}
      >
        <div className={`flex flex-col max-w-lg w-full overflow-hidden`}>
          <div
            className={`p-5 flex flex-col gap-5 transition-all ease-in-out delay-100 duration-300`}
          >
            <h1 className="flex items-center gap-4 text-xl font-bold border-b border-gray-500 pb-5">
              <LuBellDot className="stroke-[2.5]" />
              Total Undangan ({result.data.length - length.value})
            </h1>
            <div className="flex flex-col gap-3">
              <input
                className="rounded-lg text-white px-3 py-1.5 bg-sky-100/20 backdrop-blur-md outline-none"
                placeholder="Cari undangan..."
                type="text"
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-3 divide-y divide-gray-800/30">
              {(isSearch
                ? result.data.filter(
                    (x: any) =>
                      x.invitation_person
                        .toLowerCase()
                        .match(isSearch.toLowerCase()) ||
                      x.invitation_id
                        .toLowerCase()
                        .match(isSearch.toLowerCase())
                  )
                : result.data
              )?.map((x: any, i: any) => (
                <div
                  className={`${
                    isDelLoading == x.invitation_id && "opacity-40"
                  } flex flex-col pt-3`}
                >
                  <Link
                    href={`/${x.invitation_id}`}
                    target="_blank"
                    className="font-bold hover:underline"
                  >
                    {x.invitation_person}
                  </Link>
                  <h1 className="text-sm font-medium opacity-80">
                    {x.invitation_agenda}
                  </h1>
                  <h1 className="text-sm opacity-40">
                    FWSMP5BTSK/XVIII/{x.invitation_order}/24
                  </h1>
                  <h1 className="text-sm opacity-80">
                    {dayjs(x.invitation_create).format("HH:mm:ss DD/MM/YY")}
                  </h1>
                  <div
                    className={`${
                      user?.role == "ADMIN" && "!flex"
                    } hidden items-center gap-3 mt-2 text-white`}
                  >
                    <Link
                      href={`/${x.invitation_id}/edit`}
                      className="px-3 py-0.5 font-semibold rounded-lg text-sm bg-amber-600"
                    >
                      Edit
                    </Link>
                    <button
                      disabled={isDelLoading == x.invitation_id}
                      onClick={() => handleDelete(x.invitation_id, i)}
                      className={` px-3 py-0.5 font-semibold rounded-lg text-sm bg-red-600`}
                    >
                      Hapus
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
      <FloatButton />
    </>
  );
};

export default InvitList;
