import React from 'react';
import type { Offer } from '@/types';

export const OfferFeedback = ({ userOffer }: { userOffer: Offer | null }) =>
  userOffer ? (
    <div className="p-4 border border-gray-300 rounded-md bg-gray-50">
      {userOffer.status === 'accepted' && (
        <p className="text-green-600 font-semibold">Your offer has been accepted.</p>
      )}
      {userOffer.status === 'rejected' && (
        <p className="text-red-500 font-semibold">Your offer has been rejected.</p>
      )}
      {userOffer.status === 'pending' && (
        <p className="text-yellow-600 font-semibold">Your offer is still pending.</p>
      )}
    </div>
  ) : (
    <p className="text-gray-600">This listing is pending and you're not participating.</p>
  );
