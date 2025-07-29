import React from 'react';

interface OfferFormProps {
  onSubmit: (data: { amount: string; message: string }) => void;
  processing: boolean;
  errors: Record<string, string>;
}

export const OfferForm = ({ onSubmit, processing, errors }: OfferFormProps) => {
  const [offerPrice, setOfferPrice] = React.useState('');
  const [message, setMessage] = React.useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ amount: offerPrice, message });
  };

  return (
    <form onSubmit={handleSubmit} className="mt-4">
      <label className="block mb-2">
        Offer Price ($)
        <input
          type="number"
          min="1"
          value={offerPrice}
          onChange={(e) => setOfferPrice(e.target.value)}
          className="w-full p-2 border rounded-md"
          required
        />
      </label>
      {errors.amount && <p className="text-red-500">{errors.amount}</p>}

      <label className="block mt-2">
        Message to Seller
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="w-full p-2 border rounded-md"
          required
        />
      </label>
      {errors.message && <p className="text-red-500">{errors.message}</p>}

      <button
        type="submit"
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md"
        disabled={processing}
      >
        {processing ? 'Sending...' : 'Submit Offer'}
      </button>
    </form>
  );
};
