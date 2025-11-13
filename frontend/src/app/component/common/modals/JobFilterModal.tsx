"use client";

import React from "react";

type JobsFiltersProps = {
  setShowFilterModal: (showFilterModal: boolean) => void;
  setSearchTerm: (searchTerm: string) => void;
  setProgress: (progress: number) => void;
  setStatus: (status: string) => void;
  filters: { searchTerm: string; progress: number; status: string };
};

const JobFilterModal: React.FC<JobsFiltersProps> = ({
  setShowFilterModal,
  setSearchTerm,
  setProgress,
  setStatus,
  filters,
}) => {
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleProgressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProgress(Number(e.target.value));
  };

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setStatus(e.target.value);
  };

  return (
    <div
      className="w-full h-screen z-40 fixed top-0 left-0 flex md:items-end md:justify-end px-4 md:px-0"
      onClick={() => setShowFilterModal(false)}
    >
      <div
        className="flex flex-col items-center justify-between w-[443px] h-full bg-[#FFFFFF] shadow-[#00000040] shadow-lg p-5"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-full">
          <div className="flex items-center justify-between w-full pt-5">
            <span className="text-[#1D1D1D] font-poppins font-semibold text-2xl">
              Filters
            </span>

            <button onClick={() => setShowFilterModal(false)}>
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M18 6L6 18M6 6L18 18"
                  stroke="black"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>

          <div>
            <div className="mt-7 w-full h-11 rounded-[10px] border border-[#CCCCCC] px-3 flex items-center gap-3">
              <button>
                <svg
                  width="22"
                  height="22"
                  viewBox="0 0 22 22"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M19.25 19.25L16.0418 16.0417M18.3333 10.5417C18.3333 14.8449 14.8449 18.3333 10.5417 18.3333C6.23845 18.3333 2.75 14.8449 2.75 10.5417C2.75 6.23845 6.23845 2.75 10.5417 2.75C14.8449 2.75 18.3333 6.23845 18.3333 10.5417Z"
                    stroke="#1D1D1D"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>

              <input
                type="text"
                value={filters.searchTerm}
                onChange={handleSearchChange}
                className="w-[90%] h-full bg-transparent outline-none placeholder:text-[#979797] text-sm"
                placeholder="Search Job ID or Client Name"
              />
            </div>

            <div className="w-full mt-5">
              <label className="block text-[#1D1D1D] mb-2">Progress</label>
              <input
                type="range"
                min="0"
                max="100"
                value={filters.progress}
                onChange={handleProgressChange}
                className="w-full appearance-none h-1 bg-[#F2F2F2] rounded-lg outline-none border-none focus:ring-2 focus:ring-[#09B0B5] accent-[#09B0B5]"
              />
              <div className="flex justify-between text-sm text-[#1D1D1D] mt-1 font-poppins">
                <span>0%</span>
                {filters.progress ? <span>{filters.progress}%</span> : ""}
                <span>100%</span>
              </div>
            </div>

            <div className="w-full mt-5">
              <label className="block text-[#1D1D1D] mb-2">Status</label>
              <select
                value={filters.status}
                onChange={handleStatusChange}
                className="w-full h-11 rounded-[10px] border border-[#CCCCCC] px-3"
              >
                <option value="">Select a status</option>
                <option value="InProgress">In progress</option>
                <option value="Open">Open</option>
                <option value="Completed">Completed</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end w-full mt-auto gap-4">
          <button
            className="w-[112px] h-11 rounded-[5px] bg-[#F2F2F2] uppercase text-[#3D3D3D] font-poppins"
            onClick={() => {
              setSearchTerm("");
              setProgress(0);
              setStatus("");
              setShowFilterModal(false);
            }}
          >
            Cancel
          </button>

          <button
            className="w-[96px] h-11 rounded-[5px] bg-[#1E1E1E] uppercase text-white font-poppins"
            onClick={() => setShowFilterModal(false)}
          >
            Apply
          </button>
        </div>
      </div>
    </div>
  );
};

export default JobFilterModal;
