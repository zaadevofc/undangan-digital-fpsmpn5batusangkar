"use client";

import { effect } from "@preact/signals-react";
import { useSession } from "next-auth/react";
import { redirect, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { BsWhatsapp } from "react-icons/bs";
import { LuCopy, LuForward, LuPenSquare } from "react-icons/lu";
import { WhatsappShareButton } from "react-share";
import { postJson } from "~/consts";

const Share = ({
  order,
  agenda = "Acara Perpisahan - SMPN 5 Batusangkar",
}: any) => {
  const [isNewPerson, setNewPerson] = useState("");
  const [isLink, setLink] = useState<any>(null);
  const [isLoading, setLoading] = useState(false);
  const tab = useSearchParams().get("tab");
  const { data: user }: any = useSession();
  const router = useRouter()

  effect(() => {
    if (user?.role != "ADMIN" && tab) {
      router.replace("/");
    }
  });

  const handleCreate = async () => {
    setLoading(true);
    const res = await postJson("/api/signal/create", { peserta: isNewPerson });
    setLink(res.data.uri);
    setNewPerson("");
    setLoading(false);
  };

  if (user?.role == "ADMIN")
    return (
      <>
        <div
          className={`fixed flex flex-col max-w-lg w-full overflow-x-hidden`}
        >
          <div
            className={`${
              tab == "share" ? "translate-x-[0px]" : "translate-x-[-600px]"
            } p-5 flex flex-col gap-5 transition-all ease-in-out delay-100 duration-300`}
          >
            <h1
              className={`flex items-center gap-4 text-xl font-bold border-b border-gray-500 pb-5`}
            >
              <LuForward className="stroke-[2.5]" />
              Bagikan Undangan
            </h1>
            <div className="flex flex-col gap-3">
              <label className="font-medium" htmlFor="nomor_undangan">
                Nomor Undangan:{" "}
              </label>
              <input
                className="rounded-lg text-white px-3 py-1.5 bg-sky-100/20 backdrop-blur-md outline-none"
                readOnly
                value={`FWSMP5BTSK/XVIII/${order}/24`}
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
                value={agenda}
                type="text"
                id="agenda"
              />
            </div>
            <div className="flex flex-col gap-3">
              <label className="font-medium" htmlFor="nama_peserta">
                Nama Peserta:{" "}
              </label>
              <input
                className="rounded-lg text-white px-3 py-1.5 bg-sky-100/20 backdrop-blur-md outline-none"
                autoFocus
                onChange={(e) => setNewPerson(e.target.value)}
                placeholder="Ahmad Basuri S.Kom"
                value={isNewPerson}
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
                className={`rounded-lg text-white px-3 py-1.5 ${
                  isLink ? "bg-green-300/20" : "bg-sky-100/20"
                } backdrop-blur-md outline-none`}
                readOnly
                value={isLink ?? "...."}
                type="text"
                id="link_undangan"
              />
            </div>
            <div className="flex flex-col gap-4 mt-3 text-white">
              <button
                onClick={handleCreate}
                disabled={isLoading || isNewPerson.trim().length < 5}
                className={`${isNewPerson.trim().length < 5 && "opacity-40"} ${
                  isLoading && "opacity-40"
                } flex items-center gap-3 justify-center mx-auto font-bold bg-blue-500 rounded-lg px-3 py-1.5 w-full`}
              >
                <LuPenSquare className="stroke-[2.5]" />
                {isLoading ? "Loading..." : "Buat Undangan"}
              </button>
              <div
                className={`flex items-center gap-3 ${!isLink && "opacity-40"}`}
              >
                <CopyToClipboard text={isLink}>
                  <button
                    disabled={!isLink}
                    className="flex items-center gap-3 justify-center mx-auto font-bold bg-amber-600 rounded-lg px-3 py-1.5 w-full"
                  >
                    <LuCopy className="stroke-[2.5]" />
                    Salin Link
                  </button>
                </CopyToClipboard>
                <WhatsappShareButton
                  disabled={!isLink}
                  title="Hai, Aku mengirim undangan digital untuk acara perpisahan sekolah kita! *SMPN 5 Batusangkar*"
                  url={isLink}
                  className="w-full"
                >
                  <button
                    disabled={!isLink}
                    className="flex items-center gap-3 justify-center w-full mx-auto font-bold bg-green-600 rounded-lg px-3 py-1.5"
                  >
                    <BsWhatsapp className="stroke-[.7]" />
                    WhatsApp
                  </button>
                </WhatsappShareButton>
              </div>
            </div>
          </div>
        </div>
      </>
    );
};

export default Share;
