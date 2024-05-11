"use client";

import { signal } from "@preact/signals-react";
import dayjs from "dayjs";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAsync } from "react-async-hook";
import { LuBellDot, LuUser2 } from "react-icons/lu";
import Loading from "~/app/loading";
import FloatButton from "~/components/FloatButton";
import { fetchJson, postJson } from "~/consts";

const lists = async () => await fetchJson(`/api/signal/access`);
const length = signal(0);

const AccessList = () => {
  const { data: user }: any = useSession();
  const router = useRouter();

  useEffect(() => {
    if (user?.role != "ADMIN") {
      router.replace("/");
    }
  });

  const { result, loading } = useAsync(lists, []);
  const [isSearch, setSearch] = useState("");
  let [isDelLoading, setDelLoading] = useState("");
  let [isUptLoading, setUptLoading] = useState("");

  const handleDelete = async (id: any, i: any) => {
    setDelLoading(id);
    const res = await postJson("/api/signal/access/delete", { id });
    delete result.data[i];
    length.value++;
    setDelLoading("");
  };

  const handleUpdate = async (id: any, role: any, i: any) => {
    setUptLoading(id);
    const res = await postJson("/api/signal/access/update", { id, role });
    result.data[i].role = role;
    setUptLoading("");
  };

  if (loading) return <Loading />;
  if (user?.role == "ADMIN")
    return (
      <>
        <section
          className={`overflow-hidden max-w-lg mx-auto flex min-h-dvh w-full`}
        >
          <div className={`flex flex-col max-w-lg w-full overflow-hidden`}>
            <div
              className={`p-5 flex flex-col gap-5 transition-all ease-in-out delay-100 duration-300`}
            >
              <h1 className="flex items-center gap-4 text-xl font-bold border-b border-gray-500 pb-5">
                <LuUser2 className="stroke-[2.5]" />
                Total User ({result.data.length - length.value})
              </h1>
              <div className="flex flex-col gap-3">
                <input
                  className="rounded-lg text-white px-3 py-1.5 bg-sky-100/20 backdrop-blur-md outline-none"
                  placeholder="Cari user..."
                  type="text"
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <div className="flex flex-col gap-3 divide-y divide-gray-800/30">
                {(isSearch
                  ? result.data.filter(
                      (x: any) =>
                        x.name.toLowerCase().match(isSearch.toLowerCase()) ||
                        x.username.toLowerCase().match(isSearch.toLowerCase())
                    )
                  : result.data
                ).map((x: any, i: any) => (
                  <div
                    className={`${
                      (isUptLoading || isDelLoading) == x.id && "opacity-40"
                    } flex gap-4 pt-3`}
                  >
                    <div className="flex flex-col gap-2 items-center">
                      <img
                        className="size-16 rounded-lg"
                        src={x.picture}
                        alt={x.name}
                      />
                      <h1
                        className={`${
                          x.role == "ADMIN" && "text-amber-500"
                        } text-xs font-bold`}
                      >
                        {x.role}
                      </h1>
                    </div>
                    <div className="flex flex-col">
                      <h1 className="font-bold">{x.name}</h1>
                      <h1 className="text-sm font-medium opacity-80">
                        @{x.username}
                      </h1>
                      <h1 className="text-sm opacity-40">{x.email}</h1>
                      <h1 className="text-sm opacity-80">
                        {dayjs(x.createdAt).format("HH:mm:ss DD/MM/YY")}
                      </h1>
                      <div
                        className={`
                        ${user?.role == "ADMIN" && "!flex"}
                        hidden items-center gap-3 mt-2 text-white`}
                      >
                        <select
                          disabled={user.email == x.email}
                          defaultValue={x.role}
                          onChange={(e) =>
                            user.email != x.email &&
                            handleUpdate(x.id, e.target.value, i)
                          }
                          className={`${
                            user.email == x.email && 'opacity-40'
                          } px-3 py-0.5 text-center !appearance-none outline-none font-semibold rounded-lg text-sm bg-amber-600`}
                        >
                          <option value="ADMIN">ADMIN</option>
                          <option value="PESERTA">PESERTA</option>
                        </select>
                        <button
                          disabled={
                            x.role == "ADMIN" || isDelLoading == x.invitation_id
                          }
                          onClick={() => handleDelete(x.id, i)}
                          className={`${
                            x.role == "ADMIN" && "!hidden"
                          } px-3 py-0.5 font-semibold rounded-lg text-sm bg-red-600`}
                        >
                          Hapus
                        </button>
                      </div>
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

export default AccessList;
