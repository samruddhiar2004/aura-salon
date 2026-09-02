import { Suspense } from 'react';
import { BookingFlow } from '@/components/public/BookingFlow';

export default function BookPage() {
  return (
    <div className="py-8">
      <Suspense fallback={<div className="text-center py-12 text-xs text-stone-500">Loading booking interface...</div>}>
        <BookingFlow />
      </Suspense>
    </div>
  );
}
