"use client";
import React, { useState } from "react";

const AdvancedSearch = ({
  searchFunction,
}: {
  searchFunction: (filter: { [key: string]: string }) => Promise<void>;
}) => {
  const [openAdvanced, setOpenAdvanced] = React.useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [cardNumber, setcardNumber] = useState("");
  const [cardType, setcardType] = useState("");
  return (
    <>
      <button
        onClick={() => setOpenAdvanced((prev) => !prev)}
        className="my-2 text-blue-500 font-semibold mr-auto"
      >
        Advanced search
      </button>
      {openAdvanced && (
        <div className="flex flex-col gap-2">
          <div className="flex justify-between items-center gap-4">
            <label htmlFor="">Start date</label>
            <input
              onChange={(e) => setStartDate(e.target.value)}
              type="date"
              className="border-2 outline-none rounded-sm p-1"
            />
          </div>
          <div className="flex justify-between items-center gap-4">
            <label htmlFor="">End date</label>
            <input
              onChange={(e) => setEndDate(e.target.value)}
              type="date"
              className="border-2 outline-none rounded-sm p-1"
            />
          </div>
          <div className="flex justify-between items-center gap-4">
            <label htmlFor="">CC number</label>
            <input
              onChange={(e) => setcardNumber(e.target.value)}
              type="number"
              className="border-2 outline-none rounded-sm p-1"
            />
          </div>
          <div className="flex justify-between items-center gap-4">
            <label htmlFor="">CC type</label>
            <input
              onChange={(e) => setcardType(e.target.value)}
              className="border-2 outline-none rounded-sm p-1"
            />
          </div>
          <button
            onClick={() => {
              searchFunction({ startDate, endDate, cardNumber, cardType });
            }}
            className="p-1 rounded-sm bg-primary text-white"
          >
            Search
          </button>
        </div>
      )}
    </>
  );
};

export default AdvancedSearch;
