import { CURRENT_USER, type CurrentUser } from './current-user';

const KEY = 'pt:profile:v1';

export function loadProfile(): CurrentUser {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return CURRENT_USER;
    return { ...CURRENT_USER, ...JSON.parse(raw) };
  } catch {
    return CURRENT_USER;
  }
}

export function saveProfile(user: CurrentUser): void {
  try {
    localStorage.setItem(KEY, JSON.stringify(user));
  } catch (e) {
    // dataURL avatars can blow past the localStorage quota
    console.warn('profile save failed', e);
  }
}
