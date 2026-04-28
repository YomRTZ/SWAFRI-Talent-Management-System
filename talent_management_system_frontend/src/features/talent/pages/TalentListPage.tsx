import { useState, useEffect } from "react";
import { useAuthContext } from '../../auth/hooks/useAuth';
import { talentService } from "../services/talentService";
import TalentCard from "../components/TalentCard";
import TalentForm from "../components/TalentForm";
import Modal from "../components/Modal";
import TalentDetailModal from "../components/TalentDetailModal";
import ConfirmDialog from "../../../components/common/ConfirmDialog";
import type { Talent } from "../types/talent.types";
import type { TalentFormData } from "../utils/talentValidators";

export default function TalentListPage() {
  const { user } = useAuthContext();
  const isAdmin = user?.role === 'admin';

  const [talents, setTalents] = useState<Talent[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [edit, setEdit] = useState<Talent | null>(null);
  const [detailTalent, setDetailTalent] = useState<Talent | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        if (isAdmin) {
          const data = await talentService.getAll();
          setTalents(data);
        } else {
          const data = await talentService.getProfile();
          setTalents([data]);
        }
        setError(null);
      } catch (e: unknown) {
        const error = e as Error;
        setError(error.message || 'Failed to fetch');
      } finally {
        setLoading(false);
      }
    };
    if (user) fetchData();
  }, [user, isAdmin]);

  const handleSubmit = async (data: TalentFormData) => {
    try {
      if (isAdmin) {
        if (edit) {
          await talentService.update(edit.id, data);
        } else {
          await talentService.create(data);
        }
      } else {
        await talentService.updateProfile(data);
      }
      setOpen(false);
      setEdit(null);
      // Refresh data
      if (isAdmin) {
        const data = await talentService.getAll();
        setTalents(data);
      } else {
        const data = await talentService.getProfile();
        setTalents([data]);
      }
    } catch (error: unknown) {
      const err = error as Error;
      console.error('Failed to save talent:', err);
      setError(err.message || 'Failed to save');
    }
  };

  const deleteTalentById = async (id: string) => {
    try {
      if (isAdmin) {
        await talentService.remove(id);
        const data = await talentService.getAll();
        setTalents(data);
      } else {
        const updatedProfile = await talentService.clearProfile();
        setTalents([updatedProfile]);
      }
      setDetailTalent(null);
      setEdit((current) => (current?.id === id ? null : current));
    } catch (error: unknown) {
      const err = error as Error;
      console.error('Failed to delete talent:', err);
      setError(err.message || 'Failed to delete');
    }
  };

  const openConfirmDelete = (id: string) => {
    setPendingDeleteId(id);
    setConfirmOpen(true);
  };

  const confirmDelete = async () => {
    if (!pendingDeleteId) return;
    setConfirmOpen(false);
    await deleteTalentById(pendingDeleteId);
    setPendingDeleteId(null);
  };

  const cancelDelete = () => {
    setConfirmOpen(false);
    setPendingDeleteId(null);
  };

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
    if (isAdmin) {
      return (
        <div className="p-10 text-white bg-bg min-h-screen text-center">
          <p className="text-2xl font-semibold">No users have completed their profiles yet.</p>
        </div>
      );
    }
    return (
      <div className="p-10 text-white bg-bg min-h-screen text-center">
        <p className="text-2xl font-semibold">No profile found yet</p>
        <p className="mt-3 text-slate-300">Create your profile to start adding your talent details.</p>
        <button
          onClick={() => {
            setEdit(null);
            setOpen(true);
          }}
          className="mt-6 bg-green-500 px-5 py-3 rounded-lg text-white hover:bg-green-600 transition"
        >
          Create your profile
        </button>
      </div>
    );
  }
  return (
    <div className="p-10 text-white bg-bg min-h-screen mt-8">
      <div className="mb-8 max-w-4xl">
<h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl 
               font-bold tracking-tight leading-tight 
               text-white text-center sm:text-left">
  {isAdmin ? (
    <>
      Talent{' '}
      <span className="text-green-400 block sm:inline">
        Profiles
      </span>
    </>
  ) : (
    'My Talent Profile'
  )}
</h1>
        <p className="mt-3 text-slate-300 text-base md:text-lg leading-7 max-w-3xl">
          {isAdmin
            ? 'Browse all talent profiles in one place click a card to view detailed user information.'
            : 'Keep your profile up to date with your latest skills, experience, and summary.'}
        </p>
      </div>
      {/* LIST */}
      <div className="grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-4 mt-6">
        {talents.map((t) => (
          <TalentCard
            key={t.id}
            data={t}
            onEdit={!isAdmin ? () => {
              setEdit(t);
              setOpen(true);
            } : undefined}
            onDelete={!isAdmin ? () => openConfirmDelete(t.id) : undefined}
            onView={isAdmin ? () => {
              setDetailTalent(t);
            } : undefined}
            isAdminView={isAdmin}
          />
        ))}
      </div>

      {/* MODAL */}
      <Modal open={open} onClose={() => setOpen(false)}>
        <TalentForm
          onSubmit={handleSubmit}
          defaultValues={edit ? {
            fullName: edit.fullName,
            primarySkill: edit.primarySkill,
            experience: edit.experience,
            description: edit.description,
          } : undefined}
          isEdit={Boolean(edit)}
          onDelete={edit ? () => openConfirmDelete(edit.id) : undefined}
        />
      </Modal>

      {/* DETAIL MODAL */}
      <TalentDetailModal
        talent={detailTalent}
        onClose={() => {
          setDetailTalent(null);
        }}
        onDelete={!isAdmin && detailTalent ? () => openConfirmDelete(detailTalent.id) : undefined}
      />

      <ConfirmDialog
        open={confirmOpen}
        title="Confirm Delete"
        message="Are you sure you want to delete this profile? This action cannot be undone."
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
        confirmLabel="Delete"
        cancelLabel="Cancel"
      />
    </div>
  );
}