import React, { useState } from 'react';
import { Award, CheckCircle, XCircle, RefreshCcw, Loader2 } from 'lucide-react';
import api from '../../api/axios'; // Tumhara Axios instance yahan import karo

const QuizComponent = ({ quizData, lessonId }) => {
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // Backend se jo result ayega wo yahan store hoga
  const [result, setResult] = useState({
    score: 0,
    passed: false,
    message: "",
    total_marks: 0
  });

  // --- NEW LOGIC: SUBMIT TO BACKEND ---
  const handleSubmit = async () => {
    if (Object.keys(answers).length === 0) return alert("Please answer at least one question.");
    
    setLoading(true);
    try {
      // Answers Backend bhejo
      const response = await api.post(`courses/lesson/${lessonId}/quiz/`, { answers });
      
      // Backend se calculation hokar wapis aayi
      const data = response.data;
      
      setResult({
        score: data.score_percentage, // Backend percentage bhej raha hai
        passed: data.passed,
        message: data.message,
        total_marks: data.total_questions // ya marks
      });
      
      setSubmitted(true);
    } catch (error) {
      console.error("Submission Failed", error);
      alert("Error submitting quiz. Check internet.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-12 text-white h-full overflow-y-auto font-bold italic bg-gray-900 rounded-3xl">
      {!submitted ? (
        <div className="space-y-8 animate-in fade-in duration-500">
          <div className="space-y-2">
            <h2 className="text-4xl font-black uppercase tracking-tighter italic text-blue-500">
              Tactical Assessment
            </h2>
            <p className="text-blue-400 text-xs uppercase tracking-widest">
              Total Value: {quizData.total_marks} Marks
            </p>
          </div>

          {quizData.questions.map((q, index) => (
            <div key={q.id} className="space-y-6 bg-white/5 p-8 rounded-[2.5rem] border border-white/10 hover:border-blue-500/30 transition-all">
              <p className="text-xl leading-tight text-gray-200">
                <span className="text-blue-500 mr-2">0{index + 1}.</span> 
                {q.text}
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {['A', 'B', 'C', 'D'].map((opt) => (
                  <button 
                    key={opt}
                    onClick={() => setAnswers({...answers, [q.id]: opt})}
                    className={`p-5 rounded-2xl border-2 text-left transition-all duration-300 relative group ${
                      answers[q.id] === opt 
                      ? 'bg-blue-600 border-blue-600 shadow-[0_0_20px_rgba(37,99,235,0.4)]' 
                      : 'border-white/10 hover:border-white/40 bg-white/5'
                    }`}
                  >
                    <span className={`font-black mr-3 ${answers[q.id] === opt ? 'text-white' : 'text-blue-500'}`}>
                      [{opt}]
                    </span> 
                    {q[`option_${opt.toLowerCase()}`]}
                  </button>
                ))}
              </div>
            </div>
          ))}

          <button 
            onClick={handleSubmit}
            disabled={loading}
            className="mt-12 w-full md:w-auto bg-white text-gray-900 px-16 py-6 rounded-[2rem] font-black italic uppercase tracking-widest hover:bg-blue-600 hover:text-white transition-all shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading && <Loader2 className="animate-spin" />}
            {loading ? "Transmitting..." : "Submit Intel"}
          </button>
        </div>
      ) : (
        // --- RESULT SCREEN ---
        <div className="h-full flex flex-col items-center justify-center space-y-8 text-center animate-in zoom-in duration-700">
          {result.passed ? (
            <Award size={100} className="text-green-400 drop-shadow-[0_0_15px_rgba(74,222,128,0.5)] animate-bounce" />
          ) : (
            <XCircle size={100} className="text-red-400 drop-shadow-[0_0_15px_rgba(248,113,113,0.5)]" />
          )}
          
          <div className="space-y-2">
            <h2 className="text-6xl font-black italic uppercase tracking-tighter text-white">
              {result.passed ? "Mission Success" : "Mission Failed"}
            </h2>
            <p className="text-2xl font-bold tracking-tighter opacity-80 text-blue-200">
              Score: {result.score}%
            </p>
            <p className="text-sm text-gray-400">{result.message}</p>
          </div>

          <div className={`px-10 py-4 rounded-full font-black uppercase text-xs italic tracking-[0.3em] ${
            result.passed ? "bg-green-600 text-white shadow-lg shadow-green-900/50" : "bg-red-600 text-white shadow-lg shadow-red-900/50"
          }`}>
            {result.passed ? "Ready for Next Deployment" : "Re-Training Recommended"}
          </div>

          <button 
            onClick={() => { setSubmitted(false); setAnswers({}); setResult({}); }}
            className="flex items-center gap-2 text-white/50 hover:text-white transition-colors uppercase text-[10px] tracking-widest mt-8 border border-white/10 px-6 py-3 rounded-full hover:bg-white/10"
          >
            <RefreshCcw size={14} /> Retake Assessment
          </button>
        </div>
      )}
    </div>
  );
};

export default QuizComponent;