import { useState } from 'react';
import AdminLayout from '../components/AdminLayout';

const Users = () => {
  return (
    <AdminLayout>
      <div className="text-white">
        <h1 className="text-3xl font-bold mb-4">Foydalanuvchilar</h1>
        <p className="text-indigo-200/70">Bu yerda foydalanuvchilar ro'yxati bo'ladi...</p>
      </div>
    </AdminLayout>
  );
};

export default Users;
