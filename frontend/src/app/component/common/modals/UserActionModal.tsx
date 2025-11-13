"use client";

import React from "react";

interface UserActionModalProps {
  setShowModal: (value: boolean) => void;
  handleDelete: () => void;
  isPending: boolean;
}

const UserActionModal: React.FC<UserActionModalProps> = ({
  setShowModal,
  handleDelete,
  isPending,
}) => {
  return (
    <div
      onClick={() => setShowModal(false)}
      className="w-full h-screen fixed top-0 left-0 z-40 bg-black bg-opacity-80 flex items-center justify-center"
    >
      <div
        className="bg-white rounded-lg shadow-lg w-96 p-6 text-center"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-center mb-4">
          <div className="w-[86px] h-[86px] bg-[#FFEDED] rounded-full flex items-center justify-center">
            <svg
              width="45"
              height="45"
              viewBox="0 0 45 45"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M30 11.25V9.75C30 7.6498 30 6.5997 29.5913 5.79754C29.2317 5.09193 28.6581 4.51825 27.9525 4.15873C27.1503 3.75 26.1002 3.75 24 3.75H21C18.8998 3.75 17.8497 3.75 17.0475 4.15873C16.3419 4.51825 15.7683 5.09193 15.4087 5.79754C15 6.5997 15 7.6498 15 9.75V11.25M18.75 21.5625V30.9375M26.25 21.5625V30.9375M5.625 11.25H39.375M35.625 11.25V32.25C35.625 35.4003 35.625 36.9754 35.0119 38.1787C34.4726 39.2371 33.6121 40.0976 32.5537 40.6369C31.3504 41.25 29.7753 41.25 26.625 41.25H18.375C15.2247 41.25 13.6496 41.25 12.4463 40.6369C11.3879 40.0976 10.5274 39.2371 9.98809 38.1787C9.375 36.9754 9.375 35.4003 9.375 32.25V11.25"
                stroke="#FF3030"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>
        <h2 className="text-lg font-semibold mb-6">
          Are you sure you want to <br /> delete this User?
        </h2>
        <div className="flex justify-between space-x-4">
          <button
            onClick={() => setShowModal(false)}
            className="w-full bg-[#F4F4F4] hover:bg-gray-300 text-[#3D3D3D] font-semibold py-2 rounded"
          >
            Cancel
          </button>
          <button
            onClick={handleDelete}
            className="w-full bg-[#FFDFDF] hover:bg-red-200 text-[#FF3030] font-semibold py-2 rounded"
            disabled={isPending}
          >
            {isPending ? "Deleting..." : "Yes, Sure"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserActionModal;

// 7u
//   const mainSearch =
//     job?.jId?.toString().toLowerCase().includes(searchTerm) ||
//     job?.description?.toLowerCase().includes(searchTerm) ||
//     job?.status?.toLowerCase().includes(searchTerm) ||
//     job?.clientName?.toLowerCase().includes(searchTerm);
//   const matchesSearch =
//     job.jId.includes(filters.searchTerm) ||
//     job.clientName.toLowerCase().includes(filters.searchTerm.toLowerCase());
//   const matchesProgress = job?.progress >= filters.progress;
//   const matchesStatus = filters.status ? job.status === filters.status : true;

//   return mainSearch && matchesSearch && matchesStatus && matchesProgress;
// });
