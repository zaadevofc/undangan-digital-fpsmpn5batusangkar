"use client";

import { useState } from "react";
import { useAsync } from "react-async-hook";
import Share from "~/components/Share";
import Undangan from "~/components/Undangan";
import { fetchJson } from "~/consts";
import Loading from "./loading";
import FloatButton from "~/components/FloatButton";

const find = async () => await fetchJson(`/api/signal/list`);

const UndanganPage = () => {
  const { result, loading } = useAsync(find, []);
  if (loading) return <Loading />;

  return (
    <>
      <section
        className={`overflow-hidden max-w-lg mx-auto flex min-h-dvh w-full`}
      >
        <Undangan />
        <Share order={result.data[0]?.invitation_order + 1 || 1} />
      </section>
      <FloatButton />
    </>
  );
};

export default UndanganPage;
