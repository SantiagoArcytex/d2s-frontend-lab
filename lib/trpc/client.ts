import { createTRPCReact } from '@trpc/react-query';

/**
 * tRPC React Client
 * 
 * This creates a type-safe React hook for calling tRPC procedures.
 * The AppRouter type will be inferred from the backend router.
 * 
 * Usage:
 *   const { data } = trpc.tenant.get.useQuery();
 *   const mutation = trpc.app.create.useMutation();
 */

// For now, we use 'any' as the router type since backend is JavaScript
// In production, you'd generate this type from the backend or convert backend to TypeScript
export const trpc = createTRPCReact<any>();
