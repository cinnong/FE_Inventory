// src/components/Organisms/Table.jsx
import React from "react";
import { Link } from "react-router-dom";

const Table = ({ data, onDelete }) => {
  const renderMobileCard = (item) => (
    <div key={item._id} className="bg-white p-4 rounded-lg shadow-md mb-4">
      <div className="grid grid-cols-1 gap-2">
        <div className="flex flex-col">
          <span className="text-xs font-medium text-gray-500">Nama</span>
          <span className="text-sm font-medium">{item.nama}</span>
        </div>
        <div className="flex flex-col">
          <span className="text-xs font-medium text-gray-500">Kategori</span>
          <span className="text-sm">{item.kategori_id}</span>
        </div>
        <div className="flex flex-col">
          <span className="text-xs font-medium text-gray-500">Deskripsi</span>
          <span className="text-sm">{item.deskripsi}</span>
        </div>
        <div className="flex flex-col">
          <span className="text-xs font-medium text-gray-500">Tanggal</span>
          <span className="text-sm">{item.tanggal_buat}</span>
        </div>
        <div className="flex flex-col">
          <span className="text-xs font-medium text-gray-500">Status</span>
          <span className="text-sm">{item.status}</span>
        </div>
        <div className="flex flex-wrap gap-2 pt-2">
          <Link to={`/barang/${item._id}`}>
            <button className="px-4 py-2 text-sm bg-green-500 hover:bg-green-600 text-white rounded-md transition-colors">
              Detail
            </button>
          </Link>
          <Link to={`/barang/edit/${item._id}`}>
            <button className="px-4 py-2 text-sm border border-blue-500 text-blue-500 hover:bg-blue-50 rounded-md transition-colors">
              Edit
            </button>
          </Link>
          <button
            onClick={() => onDelete(item._id)}
            className="px-4 py-2 text-sm border border-red-500 text-red-500 hover:bg-red-50 rounded-md transition-colors"
          >
            Hapus
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile view */}
      <div className="md:hidden space-y-4">
        {data.map(renderMobileCard)}
      </div>

      {/* Desktop & scrollable view */}
      <div className="bg-white rounded-lg shadow-lg relative" style={{height: '24rem'}}>
        <div className="overflow-x-auto overflow-y-auto absolute inset-0 p-4" style={{height: '100%'}}>
          <table className="min-w-full table-auto">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kategori</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Deskripsi</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tanggal Dibuat</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {data.map((item) => (
              <tr key={item._id} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3 text-sm">{item._id}</td>
                <td className="px-4 py-3 text-sm font-medium">{item.nama}</td>
                <td className="px-4 py-3 text-sm">{item.kategori_id}</td>
                <td className="px-4 py-3 text-sm">{item.deskripsi}</td>
                <td className="px-4 py-3 text-sm">{item.tanggal_buat}</td>
                <td className="px-4 py-3 text-sm">{item.status}</td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap gap-2">
                    <Link to={`/barang/${item._id}`}>
                      <button className="px-3 py-1.5 text-sm bg-green-500 hover:bg-green-600 text-white rounded-md transition-colors">
                        Detail
                      </button>
                    </Link>
                    <Link to={`/barang/edit/${item._id}`}>
                      <button className="px-3 py-1.5 text-sm border border-blue-500 text-blue-500 hover:bg-blue-50 rounded-md transition-colors">
                        Edit
                      </button>
                    </Link>
                    <button
                      onClick={() => onDelete(item._id)}
                      className="px-3 py-1.5 text-sm border border-red-500 text-red-500 hover:bg-red-50 rounded-md transition-colors"
                    >
                      Hapus
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

export default Table;
