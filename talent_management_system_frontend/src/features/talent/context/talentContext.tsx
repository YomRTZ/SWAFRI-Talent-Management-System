import { createContext, useState, type ReactNode } from "react";
import type { Talent } from "../types/talent.types";
import type { TalentFormData } from "../utils/talentValidators";
import { talentService } from "../services/talentService";
import { handleError } from "../../../errors/utils/errorHandling.ts";

type TalentState = {
	talents: Talent[];
	loading: boolean;
	error: string | null;
};

type TalentContextType = TalentState & {
	addTalent: (data: TalentFormData) => Promise<void>;
	updateTalent: (id: string, data: Partial<TalentFormData>) => Promise<void>;
	deleteTalent: (id: string) => Promise<void>;
	fetchTalents: () => Promise<void>;
};

const TalentContext = createContext<TalentContextType | null>(null);

export { TalentContext };

export function TalentProvider({ children }: { children: ReactNode }) {
	const [state, setState] = useState<TalentState>({
		talents: [],
		loading: false,
		error: null,
	});

	const fetchTalents = async () => {
		setState(prev => ({ ...prev, loading: true, error: null }));
		try {
			const talents = await talentService.getAll();
			setState({ talents, loading: false, error: null });
		} catch (error: unknown) {
			handleError(error, {
				setError: (msg) => setState(prev => ({ ...prev, loading: false, error: msg })),
			});
		}
	};

	const addTalent = async (data: TalentFormData) => {
		setState(prev => ({ ...prev, loading: true, error: null }));
		try {
			const newTalent = await talentService.create(data);
			setState(prev => ({
				talents: [...prev.talents, newTalent],
				loading: false,
				error: null,
			}));
		} catch (error: unknown) {
			handleError(error, {
				setError: (msg) => setState(prev => ({ ...prev, loading: false, error: msg })),
			});
			throw error;
		}
	};

	const updateTalent = async (id: string, data: Partial<TalentFormData>) => {
		setState(prev => ({ ...prev, loading: true, error: null }));
		try {
			const updatedTalent = await talentService.update(id, data);
			setState(prev => ({
				talents: prev.talents.map(t => t.id === id ? updatedTalent : t),
				loading: false,
				error: null,
			}));
		} catch (error: unknown) {
			handleError(error, {
				setError: (msg) => setState(prev => ({ ...prev, loading: false, error: msg })),
			});
			throw error;
		}
	};

	const deleteTalent = async (id: string) => {
		setState(prev => ({ ...prev, loading: true, error: null }));
		try {
			await talentService.remove(id);
			setState(prev => ({
				talents: prev.talents.filter(t => t.id !== id),
				loading: false,
				error: null,
			}));
		} catch (error: unknown) {
			handleError(error, {
				setError: (msg) => setState(prev => ({ ...prev, loading: false, error: msg })),
			});
			throw error;
		}
	};

	return (
		<TalentContext.Provider
			value={{ ...state, addTalent, updateTalent, deleteTalent, fetchTalents }}
		>
			{children}
		</TalentContext.Provider>
	);
}