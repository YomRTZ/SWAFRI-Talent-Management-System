
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { talentSchema } from "../utils/talentValidators";
import type { TalentFormData } from "../utils/talentValidators";

type Props = {
  onSubmit: (data: TalentFormData) => void;
  defaultValues?: Partial<TalentFormData>;
  isEdit?: boolean;
  onDelete?: () => void;
};

export default function TalentForm({ onSubmit, defaultValues, isEdit, onDelete }: Props) {
 const {
  register,
  handleSubmit,
  reset,
  formState: { errors },
} = useForm<TalentFormData>({
  resolver: zodResolver(talentSchema),
    defaultValues,
});


  // reset when editing
  useEffect(() => {
    if (defaultValues) {
      reset(defaultValues);
    }
  }, [defaultValues, reset]);

  const handleFormSubmit = (data: TalentFormData) => {
    onSubmit(data);
    reset();
  };

  return (
    <div className="w-full text-white">

      {/* HEADER */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold">
          <span className="text-[#4ade7f]">SWAFRI</span> Talent Profile
        </h1>
        <p className="text-slate-400 text-sm">
          Fill in your professional details
        </p>
      </div>

      {/* FORM */}
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-5">

        {/* Full Name */}
        <div>
          <input
            {...register("fullName")}
            placeholder="Full Name"
            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl"
          />
          {errors.fullName && (
            <p className="text-red-400 text-sm mt-1">
              {errors.fullName.message}
            </p>
          )}
        </div>

        {/* Email */}
        <div>
          <input
            {...register("email")}
            placeholder="Email"
            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl"
          />
          {errors.email && (
            <p className="text-red-400 text-sm mt-1">
              {errors.email.message}
            </p>
          )}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

          {/* Skill */}
          <div>
            <textarea
              {...register("primarySkill")}
              placeholder="Primary Skill"
              rows={4}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-2xl min-h-28 resize-y"
            />
            {errors.primarySkill && (
              <p className="text-red-400 text-sm mt-1">
                {errors.primarySkill.message}
              </p>
            )}
          </div>

          {/* Experience */}
          <div>
            <input
              type="number"
              {...register("experience", { valueAsNumber: true })}
              placeholder="Years of Experience"
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl"
            />
            {errors.experience && (
              <p className="text-red-400 text-sm mt-1">
                {errors.experience.message}
              </p>
            )}
          </div>

        </div>

        {/* Description */}
        <div>
          <textarea
            {...register("description")}
            rows={6}
            placeholder="Description"
            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-2xl min-h-44 md:min-h-56 resize-y"
          />
          {errors.description && (
            <p className="text-red-400 text-sm mt-1">
              {errors.description.message}
            </p>
          )}
        </div>

        {/* Submit */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <button
            type="submit"
            className="w-full sm:w-auto px-6 py-3 bg-green-500 text-black rounded-2xl shadow-lg shadow-emerald-500/20 hover:bg-emerald-600 transition-colors duration-200 font-semibold"
          >
            {isEdit ? 'Update Profile' : 'Save Profile'}
          </button>
          {isEdit && onDelete && (
            <button
              type="button"
              onClick={onDelete}
              className="w-full sm:w-auto px-6 py-3 border border-red-500 text-red-500 rounded-2xl bg-white/5 hover:bg-red-500/10 transition-colors duration-200 font-semibold"
            >
              Delete Profile
            </button>
          )}
        </div>

      </form>
    </div>
  );
}