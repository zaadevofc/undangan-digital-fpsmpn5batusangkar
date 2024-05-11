"use client";

import { useAsync } from "react-async-hook";
import FloatButton from "~/components/FloatButton";
import Share from "~/components/Share";
import Undangan from "~/components/Undangan";
import Loading from "../loading";
import { fetchJson } from "~/consts";

const find = async (id: any) => await fetchJson(`/api/signal/find?id=${id}`);

const UndanganPage = ({ params }: any) => {
  const { result, loading } = useAsync(find, [params.un_id]);

  if (loading) return <Loading />;
  if (!result.data)
    return (
      <main className="flex items-center justify-center min-h-dvh">
        <h1 className="font-semibold text-center font-['Oooh_Baby'] text-4xl px-5">
          Undangan Tidak Ditemukan!
        </h1>
      </main>
    );

  return (
    <>
      <section
        className={`overflow-hidden max-w-lg mx-auto flex min-h-dvh w-full`}
      >
        <Undangan peserta={result.data.invitation_person} />
        <Share order={result.data.invitation_order + 1} />
      </section>
      <FloatButton />
    </>
  );
};

export default UndanganPage;
