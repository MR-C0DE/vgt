import { useRole } from '@/contexts/RoleContext';
import { PERMISSIONS } from '@/constants/roles';

export const usePermissions = () => {
  const { hasRole } = useRole();

  const can = (permission) => {
    const allowedRoles = PERMISSIONS[permission];
    if (!allowedRoles) return false;
    return hasRole(allowedRoles);
  };

  return {
    can,
    canManageUsers: () => can('USERS'),
    canEditCalendar: () => can('CALENDAR_EDIT'),
    canDeleteMessages: () => can('MESSAGES_DELETE'),
    canManageAnnouncements: () => can('ANNOUNCEMENTS_EDIT')
  };
};