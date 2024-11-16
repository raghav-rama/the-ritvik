import { writable } from 'svelte/store';

export const isLoginModalOpen = writable(false);
export const isSignupModalOpen = writable(false);
export const isForgotPasswordModalOpen = writable(false);
