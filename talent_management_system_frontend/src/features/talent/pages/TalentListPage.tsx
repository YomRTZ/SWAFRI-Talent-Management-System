import { useState, useEffect } from "react";
import { talentService } from "../services/talentService";
import TalentCard from "../components/TalentCard";
import TalentDetailModal from "../components/TalentDetailModal";
import type { Talent } from "../types/talent.types";

export default function TalentListPage() {
  const [talents, setTalents] = useState<Talent[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [detailTalent, setDetailTalent] = useState<Talent | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const data = await talentService.getAll();
        setTalents(data);
        setError(null);
      } catch (e: unknown) {
        const error = e as Error;
        setError(error.message || "Failed to fetch");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading && talents.length === 0) {
    return (
      <div className="p-10 text-white bg-bg min-h-screen text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto"></div>
        <p className="mt-4">Loading talents...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-10 text-white bg-bg min-h-screen text-center">
        <p className="text-red-400">Error: {error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 bg-blue-500 px-4 py-2 rounded"
        >
          Retry
        </button>
      </div>
    );
  }

  if (!loading && talents.length === 0) {
    return (
      <div className="p-10 text-white bg-bg min-h-screen text-center mt-8">
        <p className="text-2xl font-semibold">
          No users have completed their profiles yet.
        </p>
      </div>
    );
  }

  return (
    <div className="p-10 text-white bg-bg min-h-screen mt-5">
      <div className="mb-8 max-w-4xl">
        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold tracking-tight leading-tight text-white text-center sm:text-left">
          Talent{" "}
          <span className="text-green-400 block sm:inline">Profiles</span>
        </h1>
        <p className="mt-3 text-slate-300 text-base md:text-lg leading-7 max-w-3xl">
          Browse all talent profiles in one place. Click a card to view
          detailed user information.
        </p>
      </div>

      {/* LIST */}
      <div className="grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-4 mt-6">
        {talents.map((t) => (
          <TalentCard
            key={t.id}
            data={t}
            onView={() => setDetailTalent(t)}
            isAdminView={true}
          />
        ))}
      </div>

      {/* DETAIL MODAL */}
      <TalentDetailModal
        talent={detailTalent}
        onClose={() => setDetailTalent(null)}
      />
    </div>
  );
}

