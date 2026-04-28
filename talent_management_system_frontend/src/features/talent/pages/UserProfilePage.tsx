import { useState, useEffect } from "react";
import { useAuthContext } from '../../auth/hooks/useAuth';
import { talentService } from "../services/talentService";
import TalentCard from "../components/TalentCard";
import TalentForm from "../components/TalentForm";
import Modal from "../components/Modal";
import ConfirmDialog from "../../../components/common/ConfirmDialog";
import type { Talent } from "../types/talent.types";
import type { TalentFormData } from "../utils/talentValidators";

export default function UserProfilePage() {
  const { user } = useAuthContext();
  const [profile, setProfile] = useState<Talent | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;
      setLoading(true);
      try {
        const data = await talentService.getProfile();
        setProfile(data);
        setError(null);
      } catch (e: unknown) {
        const error = e as Error;
        setError(error.message || 'Failed to fetch data');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user]);

  const handleSubmit = async (data: TalentFormData) => {
    try {
      await talentService.updateProfile(data);
      // Refresh profile
      const updatedProfile = await talentService.getProfile();
      setProfile(updatedProfile);
      setOpen(false);
    } catch (e: unknown) {
      const error = e as Error;
      setError(error.message || 'Failed to update profile');
    }
  };

  const handleDelete = async () => {
    if (!profile) return;
    try {
      const updatedProfile = await talentService.clearProfile();
      setProfile(updatedProfile);
      setOpen(false);
    } catch (e: unknown) {
      const error = e as Error;
      setError(error.message || 'Failed to delete profile');
    }
  };

  const openConfirmDelete = () => {
    setConfirmOpen(true);
  };

  const confirmDelete = async () => {
    setConfirmOpen(false);
    await handleDelete();
  };

  const cancelDelete = () => {
    setConfirmOpen(false);
  };

  if (loading) {
    return (
      <div className="p-10 text-white bg-bg min-h-screen text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto"></div>
        <p className="mt-4">Loading profile...</p>
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


  // Regular user view: Individual profile
  if (!profile) {
    return (
      <div className="p-10 text-white bg-bg min-h-screen text-center">
        <div className="mx-auto max-w-lg rounded-3xl border border-white/10 bg-surface p-8 shadow-xl shadow-black/20">
          <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-3xl bg-emerald-500/15 text-3xl font-bold text-emerald-300 shadow-inner shadow-emerald-500/10 mx-auto">
            +
          </div>
          <h1 className="text-3xl font-semibold text-white">No profile yet</h1>
          <p className="mt-4 text-slate-300 leading-7">
            Create your talent profile to share your skills, experience, and story with your organization.
          </p>
          <button
            onClick={() => setOpen(true)}
            className="mt-8 inline-flex items-center justify-center rounded-2xl bg-emerald-500 px-6 py-3 text-black font-semibold transition hover:bg-emerald-600"
          >
            Create Profile
          </button>
        </div>
        <Modal open={open} onClose={() => setOpen(false)}>
          <TalentForm
            onSubmit={handleSubmit}
            isEdit={false}
          />
        </Modal>
      </div>
    );
  }

  return (
    <div className="p-10 text-white bg-bg min-h-screen mt-5">
      <h1 className="text-3xl font-bold mb-1">My <span className="text-green-400 block sm:inline">
       Profile
      </span> </h1>
     <p className="text-slate-300 text-base md:text-lg leading-7 mb-6 max-w-2xl">
  Manage your personal information, skills, and experience. Keep your profile updated so others can discover your talent.
</p>
      <div className="max-w-2xl">
        <TalentCard
          data={profile}
          onEdit={() => setOpen(true)}
        />
      </div>

      {/* MODAL */}
      <Modal open={open} onClose={() => setOpen(false)}>
        <TalentForm
          onSubmit={handleSubmit}
          defaultValues={{
            fullName: profile.fullName,
            email: profile.email,
            primarySkill: profile.primarySkill,
            experience: profile.experience,
            description: profile.description,
          }}
          isEdit={true}
            onDelete={openConfirmDelete}
        />
      </Modal>

      <ConfirmDialog
        open={confirmOpen}
        title="Confirm Delete"
        message="Are you sure you want to delete your profile? This action cannot be undone."
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
        confirmLabel="Delete"
        cancelLabel="Cancel"
      />
    </div>
  );
}