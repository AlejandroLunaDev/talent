import { create } from 'zustand';

export interface OnboardingState {
  // Step 1 fields
  firstName: string;
  lastName: string;
  country: string;
  city: string;
  phone: string;
  languagePreference: string;
  selectedCountryCode: string | null;

  // Step 2 fields
  role: string;
  seniority: string;
  skills: string[];
  tools: string[];
  goals: string[];

  isLoading: boolean;
  error: string | null;

  // Step 1 setters
  setFirstName: (name: string) => void;
  setLastName: (name: string) => void;
  setCountry: (country: string) => void;
  setCity: (city: string) => void;
  setPhone: (phone: string) => void;
  setLanguagePreference: (language: string) => void;
  setSelectedCountryCode: (code: string | null) => void;

  // Step 2 setters
  setRole: (role: string) => void;
  setSeniority: (seniority: string) => void;
  setSkills: (skills: string[]) => void;
  setTools: (tools: string[]) => void;
  setGoals: (goals: string[]) => void;
  addSkill: (skill: string) => void;
  removeSkill: (skill: string) => void;
  addTool: (tool: string) => void;
  removeTool: (tool: string) => void;
  toggleGoal: (goal: string) => void;

  setIsLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

export const useOnboardingStore = create<OnboardingState>((set, get) => ({
  // Step 1 initial state
  firstName: '',
  lastName: '',
  country: '',
  city: '',
  phone: '',
  languagePreference: '',
  selectedCountryCode: null,

  // Step 2 initial state
  role: '',
  seniority: '',
  skills: [],
  tools: [],
  goals: [],

  isLoading: false,
  error: null,

  // Step 1 setters
  setFirstName: name => set({ firstName: name }),
  setLastName: name => set({ lastName: name }),
  setCountry: country => set({ country: country }),
  setCity: city => set({ city: city }),
  setPhone: phone => set({ phone: phone }),
  setLanguagePreference: language => set({ languagePreference: language }),
  setSelectedCountryCode: code => set({ selectedCountryCode: code }),

  // Step 2 setters
  setRole: role => set({ role }),
  setSeniority: seniority => set({ seniority }),
  setSkills: skills => set({ skills }),
  setTools: tools => set({ tools }),
  setGoals: goals => set({ goals }),
  addSkill: skill => set(state => ({ skills: [...state.skills, skill] })),
  removeSkill: skill =>
    set(state => ({ skills: state.skills.filter(s => s !== skill) })),
  addTool: tool => set(state => ({ tools: [...state.tools, tool] })),
  removeTool: tool =>
    set(state => ({ tools: state.tools.filter(t => t !== tool) })),
  toggleGoal: goal =>
    set(state => ({
      goals: state.goals.includes(goal)
        ? state.goals.filter(g => g !== goal)
        : [...state.goals, goal]
    })),

  setIsLoading: loading => set({ isLoading: loading }),
  setError: error => set({ error: error }),
  reset: () =>
    set({
      firstName: '',
      lastName: '',
      country: '',
      city: '',
      phone: '',
      languagePreference: '',
      role: '',
      seniority: '',
      skills: [],
      tools: [],
      goals: [],
      isLoading: false,
      error: null,
      selectedCountryCode: null
    })
}));
