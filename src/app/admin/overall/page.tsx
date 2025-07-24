"use client";
import { useEffect, useState } from "react";

const initialForm = {
  grade: "",
  coreStrategy: [""],
  keyActions: [""],
};

export default function OverallAdmin() {
  const [overalls, setOveralls] = useState<any[]>([]);
  const [form, setForm] = useState<any>({ ...initialForm });
  const [editId, setEditId] = useState<number | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [showDetail, setShowDetail] = useState<{ open: boolean; overall?: any }>({ open: false });

  // 查询所有总结
  const fetchOveralls = async () => {
    const res = await fetch("/api/admin/overall");
    const data = await res.json();
    setOveralls(
      Array.isArray(data)
        ? data.map((o: any) => ({
            ...o,
            coreStrategy: o.coreStrategy ? JSON.parse(o.coreStrategy) : [],
            keyActions: o.keyActions ? JSON.parse(o.keyActions) : [],
          }))
        : []
    );
  };

  useEffect(() => {
    fetchOveralls();
  }, []);

  // 新增或编辑总结
  const handleSubmit = async () => {
    const payload = {
      ...form,
      coreStrategy: form.coreStrategy.filter((s: string) => s.trim()),
      keyActions: form.keyActions.filter((s: string) => s.trim()),
    };
    if (editId) {
      await fetch("/api/admin/overall", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: editId, ...payload }),
      });
    } else {
      await fetch("/api/admin/overall", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    }
    setForm({ ...initialForm });
    setEditId(null);
    setShowModal(false);
    fetchOveralls();
  };

  // 删除总结
  const handleDelete = async (id: number) => {
    if (!window.confirm('确定要删除该总结记录吗？')) return;
    await fetch("/api/admin/overall", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    fetchOveralls();
  };

  // 编辑总结
  const handleEdit = (overall: any) => {
    setEditId(overall.id);
    setForm({
      grade: overall.grade || "",
      coreStrategy: overall.coreStrategy || [""],
      keyActions: overall.keyActions || [""],
    });
    setShowModal(true);
  };

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // 动态数组输入
  const handleArrayChange = (field: "coreStrategy" | "keyActions", idx: number, value: string) => {
    const arr = [...form[field]];
    arr[idx] = value;
    setForm({ ...form, [field]: arr });
  };
  const handleAddArrayItem = (field: "coreStrategy" | "keyActions") => {
    setForm({ ...form, [field]: [...form[field], ""] });
  };
  const handleRemoveArrayItem = (field: "coreStrategy" | "keyActions", idx: number) => {
    const arr = [...form[field]];
    arr.splice(idx, 1);
    setForm({ ...form, [field]: arr });
  };

  const handleCancel = () => {
    setEditId(null);
    setForm({ ...initialForm });
    setShowModal(false);
  };

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">总结管理</h2>
        <button className="btn-skew" onClick={() => { setShowModal(true); setEditId(null); setForm({ ...initialForm }); }}>新增</button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr>
              <th>ID</th>
              <th>成熟度等级</th>
              <th>核心策略</th>
              <th>关键行动</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            {overalls.map((o: any) => (
              <tr key={o.id} className="bg-[#222]">
                <td>{o.id}</td>
                <td>{o.grade}</td>
                <td>
                  <button className="underline text-perficient-gold" onClick={() => setShowDetail({ open: true, overall: o })}>
                    查看
                  </button>
                </td>
                <td>
                  <button className="underline text-perficient-gold" onClick={() => setShowDetail({ open: true, overall: o })}>
                    查看
                  </button>
                </td>
                <td>
                  <button className="mr-2 px-2 py-1 bg-orange-400 hover:bg-orange-500 text-black rounded-none" onClick={() => handleEdit(o)}>
                    编辑
                  </button>
                  <button className="px-2 py-1 bg-perficient-gold text-black rounded-none" onClick={() => handleDelete(o.id)}>
                    删除
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* 弹窗表单 */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
          <div className="bg-gray-900 p-4 rounded-lg w-full max-w-xl relative text-sm">
            <h3 className="text-lg font-bold mb-3">{editId ? "编辑总结" : "新增总结"}</h3>
            <div className="space-y-2 mb-3">
              <div>
                <input className="px-2 py-1 rounded text-black w-full text-sm" name="grade" placeholder="成熟度等级（如L1-L5）" value={form.grade} onChange={handleChange} />
              </div>
              <div>
                <label className="block font-semibold mb-1">核心策略</label>
                {form.coreStrategy.map((item: string, idx: number) => (
                  <div key={idx} className="flex items-center mb-1">
                    <input className="px-2 py-1 rounded text-black w-full text-sm" value={item} onChange={e => handleArrayChange("coreStrategy", idx, e.target.value)} placeholder={`核心策略${idx + 1}`} />
                    <button className="ml-2 px-2 py-1 bg-gray-600 text-white rounded-none" onClick={() => handleRemoveArrayItem("coreStrategy", idx)} disabled={form.coreStrategy.length === 1}>-</button>
                  </div>
                ))}
                <button className="mt-1 px-2 py-1 bg-gray-700 text-white rounded-none" onClick={() => handleAddArrayItem("coreStrategy")}>添加</button>
              </div>
              <div>
                <label className="block font-semibold mb-1">关键行动</label>
                {form.keyActions.map((item: string, idx: number) => (
                  <div key={idx} className="flex items-center mb-1">
                    <input className="px-2 py-1 rounded text-black w-full text-sm" value={item} onChange={e => handleArrayChange("keyActions", idx, e.target.value)} placeholder={`关键行动${idx + 1}`} />
                    <button className="ml-2 px-2 py-1 bg-gray-600 text-white rounded-none" onClick={() => handleRemoveArrayItem("keyActions", idx)} disabled={form.keyActions.length === 1}>-</button>
                  </div>
                ))}
                <button className="mt-1 px-2 py-1 bg-gray-700 text-white rounded-none" onClick={() => handleAddArrayItem("keyActions")}>添加</button>
              </div>
            </div>
            <div className="flex justify-end space-x-2 mt-2">
              <button className="px-3 py-1 bg-gray-600 rounded text-sm" onClick={handleCancel}>取消</button>
              <button className="px-3 py-1 bg-perficient-red rounded text-sm" onClick={handleSubmit}>{editId ? "保存修改" : "新增"}</button>
            </div>
            <button className="absolute top-1.5 right-2 text-white text-xl rounded-none" onClick={handleCancel}>&times;</button>
          </div>
        </div>
      )}
      {/* 详情弹窗 */}
      {showDetail.open && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50" onClick={() => setShowDetail({ open: false })}>
          <div className="bg-gray-900 p-6 rounded-lg w-full max-w-2xl max-h-[80vh] relative text-sm overflow-hidden" onClick={e => e.stopPropagation()}>
            <h3 className="text-lg font-bold mb-4">总结详情</h3>
            <div className="mb-4 overflow-y-auto max-h-[60vh] pr-2">
              <div className="font-bold text-perficient-gold mb-1">成熟度等级：{showDetail.overall.grade}</div>
              <div className="mb-2">
                <span className="font-semibold">核心策略：</span>
                <ul className="list-disc ml-6">
                  {showDetail.overall.coreStrategy.map((s: string, idx: number) => <li key={idx}>{s}</li>)}
                </ul>
              </div>
              <div>
                <span className="font-semibold">关键行动：</span>
                <ul className="list-disc ml-6">
                  {showDetail.overall.keyActions.map((s: string, idx: number) => <li key={idx}>{s}</li>)}
                </ul>
              </div>
            </div>
            <div className="flex justify-end mt-4">
              <button className="px-4 py-2 bg-gray-600 rounded-none text-sm" onClick={() => setShowDetail({ open: false })}>关闭</button>
            </div>
            <button className="absolute top-2 right-2 text-white text-xl rounded-none" onClick={() => setShowDetail({ open: false })}>&times;</button>
          </div>
        </div>
      )}
    </div>
  );
} 