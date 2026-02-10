import { SectionLoader } from '@/components/feedback/SectionLoader';

/**
 * Route segment loading UI for dashboard subpages.
 * Loader stays in the main content area only; drawer and navbar stay visible.
 */
export default function DashboardLoading() {
  return <SectionLoader />;
}
