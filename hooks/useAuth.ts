/**
 * USE AUTH HOOK
 * Re-exports useAuthContext for convenience. Use AuthProvider in layout.
 */

export { useAuthContext as useAuth, type AuthUser, type AuthRole } from '@/context/AuthContext';
