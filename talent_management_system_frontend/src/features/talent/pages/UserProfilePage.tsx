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

export default function UserProfilePage() {
  const { user } = useAuthContext();
  const isAdmin = user?.role === 'admin';

  const [profiles, setProfiles] = useState<Talent[]>([]);
  const [profile, setProfile] = useState<Talent | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [detailTalent, setDetailTalent] = useState<Talent | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;

      setLoading(true);
      try {
        if (isAdmin) {
          // Admin sees all registered users except their own
          // We need to get all users, not just those with talent profiles
          // For now, let's modify the talentService to get all users
          const allUsers = await talentService.getAll();
          const otherUsers = allUsers.filter(u => u.id !== user.id);
          setProfiles(otherUsers);
        } else {
          // Regular user sees their own profile
          const data = await talentService.getProfile();
          setProfile(data);
        }
        setError(null);
      } catch (e: unknown) {
        const error = e as Error;
        setError(error.message || 'Failed to fetch data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user, isAdmin]);

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
        <p className="mt-4">{isAdmin ? 'Loading complete user profiles...' : 'Loading profile...'}</p>
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

  if (isAdmin) {
    // Admin view: List of all user profiles
    if (profiles.length === 0) {
      return (
        <div className="p-10 text-white bg-bg min-h-screen text-center">
          <p className="text-2xl font-semibold">No complete user profiles found</p>
          <p className="mt-3 text-slate-300">Users haven't completed their profiles yet.</p>
        </div>
      );
    }

    return (
      <div className="p-10 text-white bg-bg min-h-screen">
        <div className="mb-8 max-w-4xl">
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white">User Profiles</h1>
          <p className="mt-3 text-slate-300 text-base md:text-lg leading-7 max-w-3xl">
            Browse talent profiles across the organization and click any profile for details.
          </p>
        </div>

        <div className="grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-4">
          {profiles.map((p) => (
            <TalentCard
              key={p.id}
              data={p}
              onView={() => {
                setDetailTalent(p);
              }}
              isAdminView={true}
            />
          ))}
        </div>

        {/* DETAIL MODAL */}
        <TalentDetailModal
          talent={detailTalent}
          onClose={() => {
            setDetailTalent(null);
          }}
        />
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
    <div className="p-10 text-white bg-bg min-h-screen">
      <h1 className="text-3xl font-bold mb-6">My Profile</h1>

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