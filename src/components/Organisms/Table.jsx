// src/components/Organisms/Table.jsx
import React from "react";
import { Link } from "react-router-dom";

const Table = ({ data, onDelete }) => {
  return (
    <div className="overflow-x-auto bg-white rounded-lg shadow-lg">
      <table className="min-w-full table-auto">
        <thead>
          <tr>
            <th className="px-4 py-2 text-left">ID</th>
            <th className="px-4 py-2 text-left">Nama</th>
            <th className="px-4 py-2 text-left">Kategori</th>
            <th className="px-4 py-2 text-left">Deskripsi</th>
            <th className="px-4 py-2 text-left">Tanggal Dibuat</th>
            <th className="px-4 py-2 text-left">Status</th>
            <th className="px-4 py-2 text-left">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr key={item._id}>
              <td className="px-4 py-2">{item._id}</td>
              <td className="px-4 py-2">{item.nama}</td>
              <td className="px-4 py-2">{item.kategori_id}</td>
              <td className="px-4 py-2">{item.deskripsi}</td>
              <td className="px-4 py-2">{item.tanggal_buat}</td>
              <td className="px-4 py-2">{item.status}</td>
              <td className="px-4 py-2 space-x-2">
                <Link to={`/barang/${item._id}`}>
                  <button className="px-3 py-1 bg-green-500 text-white rounded">Detail</button>
                </Link>
                <Link to={`/barang/edit/${item._id}`}>
                  <button className="px-3 py-1 border border-blue-500 text-blue-500 rounded">Edit</button>
                </Link>
                <button
                  onClick={() => onDelete(item._id)}
                  className="px-3 py-1 border border-red-500 text-red-500 rounded"
                >
                  Hapus
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
