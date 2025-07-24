"use client";
import { useEffect, useState } from "react";

export default function EnterpriseAdmin() {
  const [enterprises, setEnterprises] = useState<any[]>([]);
  const [showDetail, setShowDetail] = useState<{ open: boolean; ent?: any }>({ open: false });

  // 查询所有企业
  const fetchEnterprises = async () => {
    const res = await fetch("/api/admin/enterprise");
    const data = await res.json();
    setEnterprises(Array.isArray(data) ? data : []);
  };

  // 删除企业
  const handleDelete = async (id: number) => {
    if (!window.confirm('确定要删除该企业及其测评记录吗？')) return;
    await fetch("/api/admin/enterprise", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    fetchEnterprises();
  };

  useEffect(() => {
    fetchEnterprises();
  }, []);

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">用户企业管理</h2>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr>
              <th>ID</th>
              <th>企业名称</th>
              <th>企业信息</th>
              <th>评估结果</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            {enterprises.map((ent: any) => (
              <tr key={ent.id} className="bg-[#222]">
                <td>{ent.id}</td>
                <td>{ent.name}</td>
                <td>
                  <button className="underline text-perficient-gold" onClick={() => setShowDetail({ open: true, ent })}>
                    查看
                  </button>
                </td>
                <td>
                  <button className="underline text-perficient-gold" onClick={() => setShowDetail({ open: true, ent })}>
                    查看
                  </button>
                </td>
                <td>
                  {/* 操作栏：删除、跳转查看可视化结果 */}
                  <button className="mr-2 px-2 py-1 bg-perficient-gold text-black rounded-none" onClick={() => handleDelete(ent.id)}>
                    删除
                  </button>
                  <a
                    href={`/survey/result?id=${ent.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-2 py-1 bg-perficient-red text-white rounded-none inline-block"
                  >
                    查看可视化结果
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* 详情弹窗 */}
      {showDetail.open && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50" onClick={() => setShowDetail({ open: false })}>
          <div className="bg-gray-900 p-6 rounded-lg w-full max-w-2xl max-h-[80vh] relative text-sm overflow-hidden" onClick={e => e.stopPropagation()}>
            <h3 className="text-lg font-bold mb-4">企业详情</h3>
            <div className="mb-4 overflow-y-auto max-h-[60vh] pr-2">
              <div className="font-bold text-perficient-gold mb-1">企业名称：{showDetail.ent.name}</div>
              <div className="mb-2">
                <span className="font-semibold">企业信息：</span>
                <pre className="bg-gray-800 p-2 rounded text-xs whitespace-pre-wrap break-all">{JSON.stringify(showDetail.ent.info, null, 2)}</pre>
              </div>
              <div>
                <span className="font-semibold">评估结果：</span>
                <pre className="bg-gray-800 p-2 rounded text-xs whitespace-pre-wrap break-all">{JSON.stringify(showDetail.ent.result, null, 2)}</pre>
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