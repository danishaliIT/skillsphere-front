import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../../api/axios';
import { CreditCard, ShieldCheck, Loader2, ArrowRight } from 'lucide-react';
import PaymentModal from '../../components/PaymentModal';

const PaymentPage = () => {
  const { enrollmentId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [enrollments, setEnrollments] = useState([]);
  const [paymentData, setPaymentData] = useState({
    transaction_id: `TRX-${Math.floor(Math.random() * 1000000)}`,
    payment_method: 'Stripe/Card'
  });
  const [selectedEnrollment, setSelectedEnrollment] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const handlePayment = async () => {
    setLoading(true);
    try {
      // Backend call: ProcessPaymentView
      const id = enrollmentId || selectedEnrollment?.id;
      if (!id) return alert('No enrollment selected for payment');
      const res = await API.post(`enrollments/payment/${id}/`, paymentData);

      alert(res.data.message);

      // Refresh enrollments after payment
      await fetchEnrollments();
      navigate('/dashboard/payments');
    } catch (err) {
      alert(err.response?.data?.error || "Payment verification failed.");
    } finally {
      setLoading(false);
    }
  };

  const fetchEnrollments = async () => {
    try {
      const res = await API.get('enrollments/my-courses/');
      setEnrollments(res.data || []);
      if (enrollmentId) {
        const found = (res.data || []).find(e => String(e.id) === String(enrollmentId));
        setSelectedEnrollment(found || null);
      }
    } catch (err) {
      console.error('Failed to load enrollments', err);
    }
  };

  React.useEffect(() => {
    fetchEnrollments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enrollmentId]);

  return (
    <div className="max-w-4xl mx-auto p-12 space-y-12 animate-in fade-in duration-700">
      <header className="space-y-3">
        <p className="text-[10px] font-black text-blue-600 uppercase tracking-[0.4em] italic">Secure Checkout</p>
        <h1 className="text-6xl font-black text-gray-900 italic uppercase tracking-tighter">Finalize Investment</h1>
        <p className="text-gray-400 font-bold text-xs italic">Complete your transaction to unlock DragonTech Intelligence.</p>
      </header>

      <div className="grid grid-cols-1 gap-8">
        {/* When no enrollmentId: show list of enrollments with pending payments */}
        {!enrollmentId && (
          <div className="bg-white p-6 rounded-3xl shadow">
            <h3 className="text-xl font-black mb-4">Your Payments</h3>
            {enrollments.length === 0 && <p className="text-sm text-gray-400">No enrollments found.</p>}
            <div className="space-y-4">
              {enrollments.map(e => (
                <div key={e.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <div className="text-sm font-black">{e.course_details?.title}</div>
                    <div className="text-xs text-gray-400">Status: {e.status} {e.payment?.status ? `· Payment: ${e.payment.status}` : ''}</div>
                  </div>
                  <div className="flex items-center gap-3">
                    {e.status === 'pending' && (
                      <button onClick={() => { setSelectedEnrollment(e); setModalOpen(true); }} className="py-2 px-4 bg-blue-600 text-white rounded-lg">Pay ${e.payment?.amount || e.course_details?.price || '0'}</button>
                    )}
                    {e.status === 'active' && <span className="text-green-600 font-bold">Enrolled</span>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* When enrollmentId present or selectedEnrollment exists: show checkout block */}
        {(enrollmentId && selectedEnrollment) && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 bg-white p-12 rounded-[3.5rem] shadow-2xl border border-gray-50">
            <div className="space-y-8 border-r border-gray-100 pr-12">
              <div className="space-y-2">
                <p className="text-[10px] font-black text-gray-400 uppercase italic">Selected Asset</p>
                <h3 className="text-2xl font-black text-gray-900 italic uppercase">{selectedEnrollment.course_details?.title}</h3>
              </div>

              <div className="pt-8 border-t border-gray-100">
                <div className="flex justify-between items-center">
                  <p className="text-sm font-bold text-gray-400 italic">Course Fee</p>
                  <p className="text-3xl font-black text-gray-900 italic">${selectedEnrollment.payment?.amount || selectedEnrollment.course_details?.price || '0.00'}</p>
                </div>
              </div>
            </div>

            <div className="space-y-8">
              <div className="space-y-4">
                <div className="p-6 bg-gray-50 rounded-3xl flex items-center gap-4">
                  <CreditCard className="text-blue-600" />
                  <div className="flex-1">
                    <p className="text-[10px] font-black text-gray-400 uppercase italic">Method</p>
                    <p className="text-xs font-bold italic text-gray-900">{selectedEnrollment.payment?.payment_method || 'Encrypted Digital Gateway'}</p>
                  </div>
                </div>
              </div>

              <button 
                onClick={handlePayment}
                disabled={loading}
                className="w-full bg-gray-900 text-white py-6 rounded-[1.8rem] font-black italic uppercase text-xs tracking-widest flex items-center justify-center gap-3 hover:bg-blue-600 transition-all shadow-xl shadow-gray-200"
              >
                {loading ? <Loader2 className="animate-spin" size={20} /> : <>Confirm Payment <ArrowRight size={18}/></>}
              </button>
              
              <p className="text-[9px] text-center text-gray-400 font-bold italic flex items-center justify-center gap-2">
                <ShieldCheck size={12} className="text-green-500" /> AES-256 Military Grade Encryption Active
              </p>
            </div>
          </div>
        )}
      </div>

      {modalOpen && (
        <PaymentModal
          enrollment={selectedEnrollment}
          onClose={() => setModalOpen(false)}
          onSuccess={async () => { await fetchEnrollments(); }}
        />
      )}
    </div>
  );
};

export default PaymentPage;