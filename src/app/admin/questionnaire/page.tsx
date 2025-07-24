"use client";
import { useEffect, useState } from "react";
import React from "react";

const initialForm = {
  dimension: "",
  question: "",
  weight: "1",
  option_L1: "",
  option_L2: "",
  option_L3: "",
  option_L4: "",
  option_L5: "",
};

export default function QuestionnaireAdmin() {
  const [questionnaires, setQuestionnaires] = useState<any[]>([]);
  const [form, setForm] = useState<any>({ ...initialForm });
  const [editId, setEditId] = useState<number | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [dimensions, setDimensions] = useState<any[]>([]);
  const [showDetail, setShowDetail] = useState<{open: boolean, q?: any, lv?: number}>({open: false});
  const [showAlert, setShowAlert] = useState(false);

  // 查询所有能力维度
  const fetchDimensions = async () => {
    const res = await fetch("/api/admin/dimension");
    const data = await res.json();
    setDimensions(data);
  };

  // 查询所有问卷
  const fetchQuestionnaires = async () => {
    const res = await fetch("/api/admin/questionnaire");
    const data = await res.json();
    setQuestionnaires(data);
  };

  useEffect(() => {
    fetchDimensions();
    fetchQuestionnaires();
  }, []);

  // 新增或编辑问卷
  const handleSubmit = async () => {
    if (!form.dimension) {
      setShowAlert(true);
      return;
    }
    if (editId) {
      await fetch("/api/admin/questionnaire", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: editId, ...form }),
      });
    } else {
      await fetch("/api/admin/questionnaire", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
    }
    setForm({ ...initialForm });
    setEditId(null);
    setShowModal(false);
    fetchQuestionnaires();
  };

  // 删除问卷
  const handleDelete = async (id: number) => {
    if (!window.confirm('确定要删除该问卷题目吗？')) return;
    await fetch("/api/admin/questionnaire", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    fetchQuestionnaires();
  };

  // 编辑问卷
  const handleEdit = (q: any) => {
    setEditId(q.id);
    setForm({
      dimension: q.dimension || "",
      question: q.question || "",
      weight: q.weight || "",
      option_L1: q.option_L1 || "",
      option_L2: q.option_L2 || "",
      option_L3: q.option_L3 || "",
      option_L4: q.option_L4 || "",
      option_L5: q.option_L5 || "",
    });
    setShowModal(true);
  };

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleCancel = () => {
    setEditId(null);
    setForm({ ...initialForm });
    setShowModal(false);
  };

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">问卷管理</h2>
        <button className="btn-skew" onClick={() => { setShowModal(true); setEditId(null); setForm({ ...initialForm }); }}>新增</button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr>
              <th>ID</th>
              <th>维度</th>
              <th>题目</th>
              <th>权重</th>
              <th style={{minWidth:'140px'}}>选项</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            {dimensions.map((d: any) => {
              const qs = questionnaires.filter((q: any) => q.dimension === d.dimension);
              if (qs.length === 0) return null;
              return (
                <React.Fragment key={d.dimension}>
                  <tr key={d.dimension + '-title'}>
                    <td colSpan={6} className="bg-gray-800 font-bold text-perficient-gold text-lg py-2">{d.dimension}</td>
                  </tr>
                  {qs.map((q: any) => (
                    <tr key={q.id} className="bg-[#222]">
                      <td>{q.id}</td>
                      <td>{q.dimension}</td>
                      <td>{q.question}</td>
                      <td>{q.weight}</td>
                      <td>
                        <button className="underline text-perficient-gold" style={{minWidth:'120px'}} onClick={() => setShowDetail({open:true, q})}>
                          点击查看所有选项
                        </button>
                      </td>
                      <td>
                        <button className="mr-2 px-2 py-1 bg-orange-400 hover:bg-orange-500 text-black rounded-none" onClick={() => handleEdit(q)}>
                          编辑
                        </button>
                        <button className="px-2 py-1 bg-perficient-gold text-black rounded-none" onClick={() => handleDelete(q.id)}>
                          删除
                        </button>
                      </td>
                    </tr>
                  ))}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>
      {/* 弹窗表单 */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
          <div className="bg-gray-900 p-4 rounded-lg w-full max-w-xl relative text-sm">
            <h3 className="text-lg font-bold mb-3">{editId ? "编辑问卷" : "新增问卷"}</h3>
            <div className="space-y-2 mb-3">
              <div>
                <select
                  className="px-2 py-1 rounded text-black w-full text-sm"
                  name="dimension"
                  value={form.dimension}
                  onChange={handleChange}
                  required
                >
                  <option value="">请选择能力维度</option>
                  {dimensions.map((d: any) => (
                    <option key={d.id} value={d.dimension}>{d.dimension}</option>
                  ))}
                </select>
              </div>
              <div>
                <input className="px-2 py-1 rounded text-black w-full text-sm" name="question" placeholder="题目" value={form.question} onChange={handleChange} />
              </div>
              <div>
                <input className="px-2 py-1 rounded text-black w-full text-sm" name="weight" placeholder="权重" value={form.weight} onChange={handleChange} />
              </div>
              {[1,2,3,4,5].map(lv => (
                <div className="mb-1" key={lv}>
                  <input
                    className="px-2 py-1 rounded text-black w-full text-sm"
                    name={`option_L${lv}`}
                    placeholder={`L${lv}选项`}
                    value={form[`option_L${lv}`]}
                    onChange={handleChange}
                  />
                </div>
              ))}
            </div>
            <div className="flex justify-end space-x-2 mt-2">
              <button className="px-3 py-1 bg-gray-600 rounded-none text-sm" onClick={handleCancel}>取消</button>
              <button className="px-3 py-1 bg-perficient-red rounded-none text-sm" onClick={handleSubmit}>{editId ? "保存修改" : "新增"}</button>
            </div>
            <button className="absolute top-1.5 right-2 text-white text-xl rounded-none" onClick={handleCancel}>&times;</button>
          </div>
        </div>
      )}
      {/* L1-L5选项详情弹窗 */}
      {showDetail.open && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50" onClick={()=>setShowDetail({open:false})}>
          <div className="bg-gray-900 p-6 rounded-lg w-full max-w-lg max-h-[80vh] relative text-sm overflow-hidden" onClick={e=>e.stopPropagation()}>
            <h3 className="text-lg font-bold mb-4">L1-L5选项详情</h3>
            <div className="space-y-2 overflow-y-auto max-h-[60vh] pr-2">
              {[1,2,3,4,5].map(lv => (
                <div key={lv} className="border-b border-gray-700 pb-2 mb-2">
                  <div className="font-bold text-perficient-gold mb-1">L{lv}</div>
                  <div><span className="font-semibold">简短：</span>{showDetail.q[`option_L${lv}`]}</div>
                  <div><span className="font-semibold">详细描述：</span>{showDetail.q[`option_L${lv}`]}</div>
                </div>
              ))}
            </div>
            <div className="flex justify-end mt-4">
              <button className="px-4 py-2 bg-gray-600 rounded-none text-sm" onClick={()=>setShowDetail({open:false})}>关闭</button>
            </div>
            <button className="absolute top-2 right-2 text-white text-xl" onClick={()=>setShowDetail({open:false})}>&times;</button>
          </div>
        </div>
      )}
      {/* 维度未选择提示弹窗 */}
      {showAlert && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
          <div className="bg-gray-900 p-6 rounded-lg w-full max-w-xs text-center">
            <div className="text-lg text-perficient-red font-bold mb-4">请选择能力维度</div>
            <button className="px-4 py-2 bg-perficient-red rounded-none text-white" onClick={()=>setShowAlert(false)}>确定</button>
          </div>
        </div>
      )}
    </div>
  );
} 