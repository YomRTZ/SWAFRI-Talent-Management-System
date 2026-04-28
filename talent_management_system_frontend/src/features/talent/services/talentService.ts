import api from '../../../api/axios';
import { USER_ENDPOINTS } from '../../../api/endpoints';
import type { Talent } from '../types/talent.types';
import type { TalentFormData } from '../utils/talentValidators';

type TalentServiceData = Omit<Talent, "id">;

type UpdateTalentPayload = {
  full_name?: string;
  email?: string;
  primary_skill?: string;
  years_of_experience?: number;
  description?: string;
};

type BackendUser = {
  id: string;
  full_name: string;
  email: string;
  primary_skill: string;
  years_of_experience: number;
  description: string;
  createdAt: string;
};

export const talentService = {
  async create(data: TalentServiceData) {
    const payload = {
      full_name: data.fullName,
      email: data.email,
      primary_skill: data.primarySkill,
      years_of_experience: data.experience,
      description: data.description,
    };
    const response = await api.post(USER_ENDPOINTS.GET_USERS, payload);
    const user = response.data.data;
    return {
      id: user.id,
      fullName: user.full_name,
      email: user.email,
      primarySkill: user.primary_skill,
      experience: user.years_of_experience,
      description: user.description,
      createdAt: user.createdAt,
    } as Talent;
  },

  async update(id: string, data: Partial<TalentFormData>) {
    const payload: UpdateTalentPayload = {};
    if (data.fullName) payload.full_name = data.fullName;
    if (data.email) payload.email = data.email;
    if (data.primarySkill) payload.primary_skill = data.primarySkill;
    if (data.experience !== undefined) payload.years_of_experience = data.experience;
    if (data.description) payload.description = data.description;

    const response = await api.put(USER_ENDPOINTS.UPDATE_USER(id), payload);
    const user = response.data.data;
    return {
      id: user.id,
      fullName: user.full_name,
      email: user.email,
      primarySkill: user.primary_skill,
      experience: user.years_of_experience,
      description: user.description,
      createdAt: user.createdAt,
    } as Talent;
  },

  async remove(id: string) {
    await api.delete(USER_ENDPOINTS.DELETE_USER(id));
  },

  async getAll() {
    const response = await api.get(USER_ENDPOINTS.GET_USERS);
    const users = response.data.data;
    return users.map((user: BackendUser) => ({
      id: user.id,
      fullName: user.full_name,
      email: user.email,
      primarySkill: user.primary_skill,
      experience: user.years_of_experience,
      description: user.description,
      createdAt: user.createdAt,
    })) as Talent[];
  },

  async getById(id: string) {
    const response = await api.get(USER_ENDPOINTS.GET_USER(id));
    const user = response.data.data;
    return {
      id: user.id,
      fullName: user.full_name,
      email: user.email,
      primarySkill: user.primary_skill,
      experience: user.years_of_experience,
      description: user.description,
      createdAt: user.createdAt,
    } as Talent;
  },

  async getProfile() {
    const response = await api.get(USER_ENDPOINTS.PROFILE);
    const user = response.data.data;
    return {
      id: user.id,
      fullName: user.full_name,
      email: user.email,
      primarySkill: user.primary_skill,
      experience: user.years_of_experience,
      description: user.description,
      createdAt: user.createdAt,
    } as Talent;
  },

  async updateProfile(data: Partial<TalentFormData>) {
    const payload: UpdateTalentPayload = {};
    if (data.fullName) payload.full_name = data.fullName;
    if (data.email) payload.email = data.email;
    if (data.primarySkill) payload.primary_skill = data.primarySkill;
    if (data.experience !== undefined) payload.years_of_experience = data.experience;
    if (data.description) payload.description = data.description;

    const response = await api.put(USER_ENDPOINTS.PROFILE, payload);
    const user = response.data.data;
    return {
      id: user.id,
      fullName: user.full_name,
      email: user.email,
      primarySkill: user.primary_skill,
      experience: user.years_of_experience,
      description: user.description,
      createdAt: user.createdAt,
    } as Talent;
  },

  async clearProfile() {
    const payload = {
      primary_skill: '',
      years_of_experience: null,
      description: '',
    };
    const response = await api.put(USER_ENDPOINTS.PROFILE, payload);
    const user = response.data.data;
    return {
      id: user.id,
      fullName: user.full_name,
      email: user.email,
      primarySkill: user.primary_skill,
      experience: user.years_of_experience,
      description: user.description,
      createdAt: user.createdAt,
    } as Talent;
  },
};