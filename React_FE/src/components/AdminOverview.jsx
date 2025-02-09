import React from "react";
import { FaBook, FaUsers } from 'react-icons/fa';

export default function AdminOverview() {
  return (
    <section className="container mx-auto px-6 py-8">
      <h3 className="text-3xl font-medium text-gray-700">Dashboard</h3>
      <div className="mt-8 flex flex-wrap -mx-6">
        <div className="w-full px-6 sm:w-1/2 xl:w-1/3">
          <div className="flex items-center px-5 py-6 bg-white rounded-md shadow-sm">
            <div className="p-3 rounded-full bg-tertiary bg-opacity-75">
              <FaBook className="h-8 w-8 text-white" />
            </div>
            <div className="mx-5">
              <h4 className="text-2xl font-semibold text-gray-700">8,282</h4>
              <div className="text-gray-500">Khóa học</div>
            </div>
          </div>
        </div>
        <div className="w-full px-6 sm:w-1/2 xl:w-1/3 mt-4 sm:mt-0">
          <div className="flex items-center px-5 py-6 bg-white rounded-md shadow-sm">
            <div className="p-3 rounded-full bg-accent1 bg-opacity-75">
              <FaUsers className="h-8 w-8 text-white" />
            </div>
            <div className="mx-5">
              <h4 className="text-2xl font-semibold text-gray-700">200,521</h4>
              <div className="text-gray-500">Học viên</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
