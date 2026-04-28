import { useContext } from 'react';
import { TalentContext } from '../context/talentContext';

export const useTalentContext = () => {
	const ctx = useContext(TalentContext);
	if (!ctx) throw new Error("useTalentContext must be used inside TalentProvider");
	return ctx;
};