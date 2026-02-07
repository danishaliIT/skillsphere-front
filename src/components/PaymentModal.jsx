import React, { useState } from 'react';
import { Loader2, X, CreditCard } from 'lucide-react';
import API from '../api/axios';

const PaymentModal = ({ enrollment, onClose, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [transactionId, setTransactionId] = useState(`TRX-${Math.floor(Math.random() * 1000000)}`);

  if (!enrollment) return null;

  const handleConfirm = async () => {
    setLoading(true);
    try {
      const res = await API.post(`enrollments/payment/${enrollment.id}/`, {
        transaction_id: transactionId,
        payment_method: 'Stripe/Card'
      });
      onSuccess && onSuccess(res.data);
      onClose && onClose();
    } catch (err) {
      alert(err.response?.data?.error || 'Payment failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-2xl max-w-3xl w-full p-6 relative">
        <button onClick={onClose} className="absolute top-4 right-4 p-2 text-gray-500 hover:text-gray-900">
          <X />
        </button>

        <div className="flex items-center gap-4">
          <div className="p-4 bg-blue-50 rounded-lg"><CreditCard className="text-blue-600" /></div>
          <div>
            <h3 className="text-lg font-black">Pay for {enrollment.course_details?.title}</h3>
            <p className="text-sm text-gray-500">Amount: ${enrollment.payment?.amount || enrollment.course_details?.price || '0.00'}</p>
          </div>
        </div>

        <div className="mt-6 space-y-3">
          <label className="block text-xs font-bold text-gray-500 uppercase">Transaction ID</label>
          <input value={transactionId} onChange={(e)=>setTransactionId(e.target.value)} className="w-full p-3 border rounded-lg" />
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 rounded-lg border">Cancel</button>
          <button onClick={handleConfirm} disabled={loading} className="px-6 py-2 bg-blue-600 text-white rounded-lg">
            {loading ? <Loader2 className="animate-spin" /> : 'Confirm Payment'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;
