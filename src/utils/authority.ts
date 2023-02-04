import cacheMng from '@/managers/cacheMng';
import { reloadAuthorized } from './Authorized';

// use localStorage to store the authority info, which might be sent from server in actual project.
export function getAuthority(str?: string): string | string[] {
  const authority = typeof str === 'undefined' ? cacheMng.getItem('authority') : str;
  // authorityString could be admin, "admin", ["admin"]
  if (typeof authority === 'string') {
    return [authority];
  }
  if (!authority) {
    return ['user'];
  }
  return authority;
}

export function setAuthority(authority: string | string[]): void {
  const auth = typeof authority === 'string' ? [authority] : authority;
  cacheMng.setItem('authority', auth);
  // auto reload
  reloadAuthorized();
}

export function removeAuthority(): void {
  cacheMng.removeItem('authority');
  // auto reload
  reloadAuthorized();
}
