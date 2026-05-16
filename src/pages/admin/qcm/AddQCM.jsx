import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Plus, Trash2, ChevronLeft, Loader2, Save,
  HelpCircle, CheckCircle2, Circle
} from 'lucide-react';
import API from '../../../services/api';
import SidebarAdmin from '../../../components/layout/SidebarAdmin';

const AddQCM = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [quizInfo, setQuizInfo] = useState({
    title: '',
    category: 'Développement Web',
    language_id: '',
    time_limit: 15
  });

  const [questions, setQuestions] = useState([
    { question_text: '', options: ['', '', '', ''], correct_answer_index: 0 }
  ]);

  const languages = [
    { id: 1, name: 'HTML' },
    { id: 2, name: 'CSS' },
    { id: 3, name: 'JavaScript' },
    { id: 4, name: 'Bootstrap' },
  ];

  const addQuestion = () => {
    setQuestions([...questions, { question_text: '', options: ['', '', '', ''], correct_answer_index: 0 }]);
  };

  const removeQuestion = (index) => {
    if (questions.length > 1) setQuestions(questions.filter((_, i) => i !== index));
  };

  const handleQuestionChange = (index, text) => {
    const updated = [...questions];
    updated[index].question_text = text;
    setQuestions(updated);
  };

  const handleOptionChange = (qIndex, oIndex, text) => {
    const updated = [...questions];
    updated[qIndex].options[oIndex] = text;
    setQuestions(updated);
  };

  const handleSelectCorrect = (qIndex, oIndex) => {
    const updated = [...questions];
    updated[qIndex].correct_answer_index = oIndex;
    setQuestions(updated);
  };

  const handleSubmit = async () => {
    if (!quizInfo.title) return alert("Veuillez donner un titre au Quiz.");
    if (!quizInfo.language_id) return alert("Veuillez sélectionner une langue.");
    setLoading(true);
    try {
      const response = await API.post('/admin/qcm/store', { ...quizInfo, questions });
      if (response.status === 200 || response.status === 201) {
        alert("QCM publié avec succès !");
        navigate('/admin/qcm');
      }
    } catch (error) {
      alert(error.response?.data?.message || "Erreur lors de l'enregistrement");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-[#f0f4ff] font-sans">
      <SidebarAdmin />

      <main className="flex-1 ml-60 px-12 py-10">

        {/* Header */}
        <div className="flex justify-between items-center mb-10">
          <div>
            <button
              onClick={() => navigate("/admin/qcm")}
              className="text-sm font-medium text-slate-400 mb-3 flex items-center gap-1.5 hover:text-[#1754be] transition-colors"
            >
              <ChevronLeft size={15} /> Retour
            </button>
            <div className="text-[10px] font-medium text-[#e5522d] uppercase tracking-widest mb-2">
              Administration
            </div>
            <h1 className="text-3xl font-medium text-[#0d1b3e] tracking-tight">
              Création de QCM
            </h1>
          </div>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="bg-[#e5522d] text-white px-6 py-3 rounded-xl text-sm font-medium flex items-center gap-2 hover:bg-[#cc4522] transition-all disabled:opacity-50"
          >
            {loading ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
            {loading ? "Publication..." : "Publier"}
          </button>
        </div>

        {/* Quiz info */}
        <div className="bg-white p-7 rounded-2xl border border-slate-100 shadow-sm mb-6">
          <div className="text-[10px] font-medium text-slate-400 uppercase tracking-widest mb-5">
            Informations générales
          </div>
          <div className="grid grid-cols-3 gap-5">

            <div className="space-y-2">
              <label className="text-[10px] font-medium text-slate-400 uppercase tracking-widest">
                Titre du quiz
              </label>
              <input
                type="text"
                placeholder="Ex : Quiz HTML5 Débutant"
                value={quizInfo.title}
                onChange={(e) => setQuizInfo({ ...quizInfo, title: e.target.value })}
                className="w-full p-3.5 bg-[#f8faff] border border-slate-100 rounded-xl text-sm placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-[#1754be]/10 focus:border-[#1754be]/30 transition-all"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-medium text-slate-400 uppercase tracking-widest">
                Catégorie
              </label>
              <select
                value={quizInfo.category}
                onChange={(e) => setQuizInfo({ ...quizInfo, category: e.target.value })}
                className="w-full p-3.5 bg-[#f8faff] border border-slate-100 rounded-xl text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#1754be]/10 focus:border-[#1754be]/30 transition-all"
              >
                <option>Développement Web</option>
                <option>Cloud Computing</option>
                <option>Data Science</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-medium text-slate-400 uppercase tracking-widest">
                Langue <span className="text-[#e5522d]">*</span>
              </label>
              <select
                value={quizInfo.language_id}
                onChange={(e) => setQuizInfo({ ...quizInfo, language_id: e.target.value })}
                className="w-full p-3.5 bg-[#f8faff] border border-slate-100 rounded-xl text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#1754be]/10 focus:border-[#1754be]/30 transition-all"
              >
                <option value="">Choisir une langue</option>
                {languages.map((lang) => (
                  <option key={lang.id} value={lang.id}>{lang.name}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Questions */}
        <div className="space-y-5 mb-5">
          {questions.map((q, qIndex) => (
            <div key={qIndex} className="bg-white p-7 rounded-2xl border border-slate-100 shadow-sm">

              {/* Question header */}
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-[#eef3fc] rounded-xl flex items-center justify-center">
                    <HelpCircle size={15} className="text-[#1754be]" />
                  </div>
                  <span className="text-sm font-medium text-[#0d1b3e]">
                    Question {qIndex + 1}
                  </span>
                </div>
                <button
                  onClick={() => removeQuestion(qIndex)}
                  className="flex items-center gap-1.5 text-[11px] text-slate-400 hover:text-red-500 transition-colors"
                >
                  <Trash2 size={14} /> Supprimer
                </button>
              </div>

              {/* Question text */}
              <textarea
                placeholder="Saisissez votre question ici..."
                value={q.question_text}
                onChange={(e) => handleQuestionChange(qIndex, e.target.value)}
                className="w-full p-3.5 bg-[#f8faff] border border-slate-100 rounded-xl text-sm placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-[#1754be]/10 focus:border-[#1754be]/30 transition-all resize-none mb-5"
                rows="2"
              />

              {/* Options */}
              <div className="grid grid-cols-2 gap-3">
                {q.options.map((opt, oIndex) => {
                  const isCorrect = q.correct_answer_index === oIndex;
                  return (
                    <div
                      key={oIndex}
                      onClick={() => handleSelectCorrect(qIndex, oIndex)}
                      className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                        isCorrect
                          ? 'bg-green-50 border-green-200'
                          : 'bg-[#f8faff] border-slate-100 hover:border-[#1754be]/30'
                      }`}
                    >
                      {isCorrect
                        ? <CheckCircle2 size={17} className="text-green-500 shrink-0" />
                        : <Circle size={17} className="text-slate-300 shrink-0" />
                      }
                      <input
                        type="text"
                        value={opt}
                        onClick={(e) => e.stopPropagation()}
                        onChange={(e) => handleOptionChange(qIndex, oIndex, e.target.value)}
                        placeholder={`Option ${oIndex + 1}`}
                        className="flex-1 bg-transparent text-sm text-slate-700 placeholder:text-slate-300 focus:outline-none"
                      />
                    </div>
                  );
                })}
              </div>

              <p className="text-[10px] text-slate-400 mt-3">
                Cliquez sur une option pour la marquer comme correcte
              </p>
            </div>
          ))}
        </div>

        {/* Add question */}
        <button
          onClick={addQuestion}
          className="w-full py-3.5 bg-white border border-dashed border-[#1754be]/30 rounded-2xl text-sm font-medium text-[#1754be] flex items-center justify-center gap-2 hover:bg-[#eef3fc] transition-all"
        >
          <Plus size={17} />
          Ajouter une question
        </button>

      </main>
    </div>
  );
};

export default AddQCM;