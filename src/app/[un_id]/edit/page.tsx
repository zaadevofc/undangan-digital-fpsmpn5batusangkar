"use client";

import { effect } from "@preact/signals-react";
import { useSession } from "next-auth/react";
import { redirect, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { useAsync } from "react-async-hook";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { BsWhatsapp } from "react-icons/bs";
import { LuCopy, LuForward, LuPenSquare, LuSave } from "react-icons/lu";
import { WhatsappShareButton } from "react-share";
import Loading from "~/app/loading";
import FloatButton from "~/components/FloatButton";
import { METADATA, fetchJson, postJson } from "~/consts";

const find = async (id: any) => await fetchJson(`/api/signal/find?id=${id}`);

const EditUndangan = ({ params }: any) => {
  const [isNewPerson, setNewPerson] = useState("");
  const [isLink, setLink] = useState<any>(null);
  const [isLoading, setLoading] = useState(false);
  const tab = useSearchParams().get("tab");
  const { data: user }: any = useSession();
  const router = useRouter();

  effect(() => {
    if (user?.role != "ADMIN") {
      router.replace("/");
    }
  });

  const { result, loading, status } = useAsync(find, [params.un_id]);
  const handleUpdate = async () => {
    setLink(null);
    setLoading(true);
    const res = await postJson("/api/signal/update", {
      id: params.un_id,
      peserta: isNewPerson,
    });
    setLink(res.data.uri);
    setNewPerson("");
    setLoading(false);
  };

  effect(() => {
    document.title = (`${
      result?.data ? `"${isNewPerson || result?.data?.invitation_person}"` : ''
    } ` + METADATA.title) as any;
  });

  if (loading) return <Loading />;
  if (!result.data)
    return (
      <main className="flex items-center justify-center min-h-dvh">
        <h1 className="font-semibold text-center font-['Oooh_Baby'] text-4xl px-5">
          Undangan Tidak Ditemukan!
        </h1>
      </main>
    );
  if (user?.role == "ADMIN")
    return (
      <>
        <div
          className={`flex flex-col max-w-lg w-full overflow-hidden mx-auto`}
        >
          <div
            className={`p-5 flex flex-col gap-8 transition-all ease-in-out delay-100 duration-300`}
          >
            <h1
              className={`flex items-center gap-4 text-xl font-bold border-b border-gray-500 pb-5`}
            >
              <LuPenSquare className="stroke-[2.5]" />
              Edit Undangan
            </h1>
            <div className="flex flex-col gap-3">
              <label className="font-medium" htmlFor="nomor_undangan">
                Nomor Undangan:{" "}
              </label>
              <input
                className="rounded-lg text-white px-3 py-1.5 bg-sky-100/20 backdrop-blur-md outline-none"
                readOnly
                value={`FWSMP5BTSK/XVIII/${result.data.invitation_order}/24`}
                type="text"
                id="nomor_undangan"
              />
            </div>
            <div className="flex flex-col gap-3">
              <label className="font-medium" htmlFor="agenda">
                Agenda:{" "}
              </label>
              <input
                className="rounded-lg text-white px-3 py-1.5 bg-sky-100/20 backdrop-blur-md outline-none"
                readOnly
                value={result.data.invitation_agenda}
                type="text"
                id="agenda"
              />
            </div>
            <div className="flex flex-col gap-3">
              <label className="font-medium" htmlFor="nama_peserta">
                Nama Peserta:{" "}
              </label>
              <input
                className={`rounded-lg text-white px-3 py-1.5 ${
                  isLink ? "bg-green-300/20" : "bg-sky-100/20"
                } backdrop-blur-md outline-none`}
                autoFocus
                onChange={(e) => setNewPerson(e.target.value)}
                placeholder="Ahmad Basuri S.Kom"
                defaultValue={result.data.invitation_person}
                type="text"
                id="nama_peserta"
              />
              <small className="text-gray-500">Minimal 5 karakter.</small>
            </div>
            <div className="flex flex-col gap-3">
              <label className="font-medium" htmlFor="link_undangan">
                Link Undangan:{" "}
              </label>
              <input
                className="rounded-lg text-white px-3 py-1.5 bg-sky-100/20 backdrop-blur-md outline-none"
                readOnly
                value={
                  "https://fpsmpn5batusangkar.vercel.app/" +
                  result.data.invitation_id
                }
                type="text"
                id="link_undangan"
              />
            </div>
            <div className="flex flex-col gap-4 mt-3 text-white">
              <button
                onClick={handleUpdate}
                disabled={isNewPerson.trim().length < 5}
                className={`${isNewPerson.trim().length < 5 && "opacity-40"} ${
                  isLoading && "opacity-40"
                } flex items-center gap-3 justify-center mx-auto font-bold bg-blue-500 rounded-lg px-3 py-1.5 w-full`}
              >
                <LuSave className="stroke-[2.5]" />
                {isLoading ? "Loading..." : "Simpan Undangan"}
              </button>
              <div className={`flex items-center gap-3`}>
                <CopyToClipboard
                  text={
                    "https://fpsmpn5batusangkar.vercel.app/" +
                    result.data.invitation_id
                  }
                >
                  <button className="flex items-center gap-3 justify-center mx-auto font-bold bg-amber-600 rounded-lg px-3 py-1.5 w-full">
                    <LuCopy className="stroke-[2.5]" />
                    Salin Link
                  </button>
                </CopyToClipboard>
                <WhatsappShareButton
                  title="Hai, Aku mengirim undangan digital untuk acara perpisahan sekolah kita! *SMPN 5 Batusangkar*"
                  url={
                    "https://fpsmpn5batusangkar.vercel.app/" +
                    result.data.invitation_id
                  }
                  className="w-full"
                >
                  <button className="flex items-center gap-3 justify-center w-full mx-auto font-bold bg-green-600 rounded-lg px-3 py-1.5">
                    <BsWhatsapp className="stroke-[.7]" />
                    WhatsApp
                  </button>
                </WhatsappShareButton>
              </div>
            </div>
          </div>
        </div>
        <FloatButton />
      </>
    );
};

export default EditUndangan;
