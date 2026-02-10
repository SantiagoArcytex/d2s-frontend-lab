import { SectionLoader } from '@/components/feedback/SectionLoader';

/**
 * Route segment loading UI for marketplace subpages.
 * Loader stays in the main content area only; navbar stays visible.
 */
export default function MarketplaceLoading() {
  return <SectionLoader />;
}
