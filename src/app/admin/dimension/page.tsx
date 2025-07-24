"use client";
import { useEffect, useState } from "react";

const initialForm = {
  dimension: "",
  core_capability: "",
  weight: "1",
  definition_L1: "",
  strategy_and_plan_L1: "",
  definition_L2: "",
  strategy_and_plan_L2: "",
  definition_L3: "",
  strategy_and_plan_L3: "",
  definition_L4: "",
  strategy_and_plan_L4: "",
  definition_L5: "",
  strategy_and_plan_L5: "",
};

export default function DimensionAdmin() {
  const [dimensions, setDimensions] = useState<any[]>([]);
  const [form, setForm] = useState<any>({ ...initialForm });
  const [editId, setEditId] = useState<number | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [showDetail, setShowDetail] = useState<{open: boolean, dim?: any}>({open: false});

  // 查询所有维度
  const fetchDimensions = async () => {
    const res = await fetch("/api/admin/dimension");
    const data = await res.json();
    setDimensions(data);
  };

  useEffect(() => {
    fetchDimensions();
  }, []);

  // 新增或编辑维度
  const handleSubmit = async () => {
    if (editId) {
      await fetch("/api/admin/dimension", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: editId, ...form }),
      });
    } else {
      await fetch("/api/admin/dimension", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
    }
    setForm({ ...initialForm });
    setEditId(null);
    setShowModal(false);
    fetchDimensions();
  };

  // 删除维度
  const handleDelete = async (id: number) => {
    if (!window.confirm('确定要删除该能力维度及其相关问卷吗？')) return;
    await fetch("/api/admin/dimension", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    fetchDimensions();
  };

  // 编辑维度
  const handleEdit = (dim: any) => {
    setEditId(dim.id);
    setForm({
      dimension: dim.dimension || "",
      core_capability: dim.core_capability || "",
      weight: dim.weight || "",
      definition_L1: dim.definition_L1 || "",
      strategy_and_plan_L1: dim.strategy_and_plan_L1 || "",
      definition_L2: dim.definition_L2 || "",
      strategy_and_plan_L2: dim.strategy_and_plan_L2 || "",
      definition_L3: dim.definition_L3 || "",
      strategy_and_plan_L3: dim.strategy_and_plan_L3 || "",
      definition_L4: dim.definition_L4 || "",
      strategy_and_plan_L4: dim.strategy_and_plan_L4 || "",
      definition_L5: dim.definition_L5 || "",
      strategy_and_plan_L5: dim.strategy_and_plan_L5 || "",
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
        <h2 className="text-2xl font-bold">能力维度管理</h2>
        <button className="btn-skew" onClick={() => { setShowModal(true); setEditId(null); setForm({ ...initialForm }); }}>新增</button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr>
              <th>ID</th>
              <th>能力维度</th>
              <th>核心能力</th>
              <th>权重</th>
              <th>L1-L5定义和策略</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            {dimensions.map((dim: any) => (
              <tr key={dim.id} className="bg-[#222]">
                <td>{dim.id}</td>
                <td>{dim.dimension}</td>
                <td>{dim.core_capability}</td>
                <td>{dim.weight}</td>
                <td>
                  <button className="underline text-perficient-gold" onClick={() => setShowDetail({open:true, dim})}>
                    查看详情
                  </button>
                </td>
                <td>
                  <button className="mr-2 px-2 py-1 bg-orange-400 hover:bg-orange-500 text-black rounded-none" onClick={() => handleEdit(dim)}>
                    编辑
                  </button>
                  <button className="px-2 py-1 bg-perficient-gold text-black rounded-none" onClick={() => handleDelete(dim.id)}>
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
            <h3 className="text-lg font-bold mb-3">{editId ? "编辑能力维度" : "新增能力维度"}</h3>
            <div className="space-y-2 mb-3">
              <div>
                <input className="px-2 py-1 rounded text-black w-full text-sm" name="dimension" placeholder="能力维度（唯一）" value={form.dimension} onChange={handleChange} />
              </div>
              <div>
                <input className="px-2 py-1 rounded text-black w-full text-sm" name="core_capability" placeholder="核心能力" value={form.core_capability} onChange={handleChange} />
              </div>
              <div>
                <input className="px-2 py-1 rounded text-black w-full text-sm" name="weight" placeholder="权重" value={form.weight} onChange={handleChange} />
              </div>
              {[1,2,3,4,5].map(lv => (
                <div className="grid grid-cols-2 gap-2 items-start" key={lv}>
                  <input
                    className="px-2 py-1 rounded text-black w-full text-sm"
                    name={`definition_L${lv}`}
                    placeholder={`L${lv}定义`}
                    value={form[`definition_L${lv}`]}
                    onChange={handleChange}
                  />
                  <textarea
                    className="px-2 py-1 rounded text-black w-full min-h-[36px] text-sm"
                    name={`strategy_and_plan_L${lv}`}
                    placeholder={`L${lv}策略与计划（长文本）`}
                    value={form[`strategy_and_plan_L${lv}`]}
                    onChange={handleChange}
                  />
                </div>
              ))}
            </div>
            <div className="flex justify-end space-x-2 mt-2">
              <button className="px-3 py-1 bg-gray-600 rounded text-sm" onClick={handleCancel}>取消</button>
              <button className="px-3 py-1 bg-perficient-red rounded text-sm" onClick={handleSubmit}>{editId ? "保存修改" : "新增"}</button>
            </div>
            <button className="absolute top-1.5 right-2 text-white text-xl rounded-none" onClick={handleCancel}>&times;</button>
          </div>
        </div>
      )}
      {/* L1-L5详情弹窗 */}
      {showDetail.open && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50" onClick={()=>setShowDetail({open:false})}>
          <div className="bg-gray-900 p-6 rounded-lg w-full max-w-2xl max-h-[80vh] relative text-sm overflow-hidden" onClick={e=>e.stopPropagation()}>
            <h3 className="text-lg font-bold mb-4">L1-L5定义和策略详情</h3>
            <div className="space-y-2 overflow-y-auto max-h-[60vh] pr-2">
              {[1,2,3,4,5].map(lv => (
                <div key={lv} className="border-b border-gray-700 pb-2 mb-2">
                  <div className="font-bold text-perficient-gold mb-1">L{lv}</div>
                  <div><span className="font-semibold">定义：</span>{showDetail.dim[`definition_L${lv}`]}</div>
                  <div><span className="font-semibold">策略与计划：</span>{showDetail.dim[`strategy_and_plan_L${lv}`]}</div>
                </div>
              ))}
            </div>
            <div className="flex justify-end mt-4">
              <button className="px-4 py-2 bg-gray-600 rounded-none text-sm" onClick={()=>setShowDetail({open:false})}>关闭</button>
            </div>
            <button className="absolute top-2 right-2 text-white text-xl rounded-none" onClick={()=>setShowDetail({open:false})}>&times;</button>
          </div>
        </div>
      )}
    </div>
  );
} 