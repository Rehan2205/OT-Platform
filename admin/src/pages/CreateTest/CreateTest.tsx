import React, { useState, useEffect } from "react";
import axios from "../../api/axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import TestInfoForm from "./components/TestInfoForm";
import QuestionForm from "./components/QuestionForm";
import QuestionList from "./components/QuestionList";
import TestPreviewModal from "./components/TestPreviewModal";

import { Question } from "./types";
import { validateFullTest } from "./utils";
import "./CreateTest.css";

const DRAFT_KEY = "testDraft";

export default function CreateTest() {
  const [title,setTitle] = useState("");
  const [duration,setDuration] = useState(60);
  const [totalMarks,setTotalMarks] = useState(0);
  const [questions,setQuestions] = useState<Question[]>([]);
  const [editingIndex,setEditingIndex] = useState<number | null>(null);
  const [qType,setQType] = useState<"mcq"|"coding"|"descriptive">("mcq");
  const [showPreview,setShowPreview] = useState(false);
  const [saving,setSaving] = useState(false);
  const [errors,setErrors] = useState<Record<string,string>>({});

  // Load draft
  useEffect(()=>{
    const raw = localStorage.getItem(DRAFT_KEY);
    if(!raw) return;
    try{
      const draft = JSON.parse(raw);
      setTitle(draft.title||"");
      setDuration(draft.duration||60);
      setTotalMarks(draft.totalMarks||0);
      setQuestions(draft.questions||[]);
    }catch{}
  },[]);

  // Auto-save draft
  useEffect(()=>{
    localStorage.setItem(DRAFT_KEY, JSON.stringify({title,duration,totalMarks,questions}));
  },[title,duration,totalMarks,questions]);

  const handleSaveQuestion = (q: Question) => {
    if(editingIndex!==null){
      const next = [...questions];
      next[editingIndex] = q;
      setQuestions(next);
      setEditingIndex(null);
    } else setQuestions(s=>[...s,q]);
  };

  const handleEditQuestion = (i:number)=>setEditingIndex(i);
  const handleDeleteQuestion = (i:number)=>{
    if(!window.confirm("Delete this question?")) return;
    setQuestions(questions.filter((_,idx)=>idx!==i));
  };

  const handleCreateTest = async ()=>{
    const e = validateFullTest(title,duration,totalMarks,questions);
    if(Object.keys(e).length>0){
      Object.values(e).forEach(msg=>toast.error(msg));
      return;
    }

    const payload = {
      title:title.trim(),
      durationMinutes:duration,
      totalMarks: totalMarks||questions.reduce((s,q)=>s+q.marks,0),
      questions
    };

    setSaving(true);
    try{
      const token = localStorage.getItem("adminToken");
      await axios.post("/tests", payload, { headers: token ? { Authorization:`Bearer ${token}`} : undefined});
      localStorage.removeItem(DRAFT_KEY);
      toast.success("Test created successfully!");
      window.location.reload();
    }catch(err:any){
      toast.error(err?.response?.data?.error || "Failed to create test");
    }finally{
      setSaving(false);
    }
  };

  return (
    <div className="create-test-container">
      <h1 className="page-title">Create Test</h1>

      <div className="form-card">
        <TestInfoForm
          title={title} setTitle={setTitle}
          duration={duration} setDuration={setDuration}
          totalMarks={totalMarks} setTotalMarks={setTotalMarks}
          errors={errors}
        />

        <QuestionForm qType={qType} setQType={setQType} editingQuestion={editingIndex!==null?questions[editingIndex]:null} onSave={handleSaveQuestion}/>

        <button type="button" className="preview-btn" onClick={()=>setShowPreview(true)}>Preview Test</button>

        <QuestionList questions={questions} setQuestions={setQuestions} onEdit={handleEditQuestion} onDelete={handleDeleteQuestion}/>

        <div style={{marginTop:18, display:"flex", gap:12}}>
          <button className="create-btn" onClick={handleCreateTest} disabled={saving}>
            {saving?"Saving...":"Create Test"}
          </button>

          <button className="delete-btn" onClick={()=>{
            if(window.confirm("Clear draft and reset?")){
              localStorage.removeItem(DRAFT_KEY);
              window.location.reload();
            }
          }}>Reset Builder</button>
        </div>
      </div>

      {showPreview && (
        <TestPreviewModal
          title={title}
          duration={duration}
          totalMarks={totalMarks||questions.reduce((s,q)=>s+q.marks,0)}
          questions={questions}
          onClose={()=>setShowPreview(false)}
          onCreate={()=>{
            setShowPreview(false);
            handleCreateTest();
          }}
        />
      )}

      <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover theme="colored"/>
    </div>
  );
}
