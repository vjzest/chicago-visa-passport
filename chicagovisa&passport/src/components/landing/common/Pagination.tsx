export default function Pagination() {
  return (
    <nav className="flex justify-center mt-[40px]">
      <ul className="flex gap-[10px] items-center p-0 m-0 list-none">
        <li className="w-[40px] h-[40px] flex justify-center items-center text-[16px] font-medium rounded-[4px] cursor-pointer transition-all duration-200 bg-[#122241] text-white">
          1
        </li>

        <li className="pagination-item w-[40px] h-[40px] flex justify-center items-center text-[16px] font-medium rounded-[4px] cursor-pointer transition-all duration-200 hover:bg-[#f3f4f6]">
          2
        </li>

        <li className="pagination-item w-[40px] h-[40px] flex justify-center items-center text-[16px] font-medium rounded-[4px] cursor-pointer transition-all duration-200 hover:bg-[#f3f4f6]">
          3
        </li>

        <li className="w-[40px] h-[40px] flex justify-center items-center text-[16px] font-medium rounded-[4px] cursor-default text-[#888]">
          ...
        </li>

        <li className="pagination-item w-[40px] h-[40px] flex justify-center items-center text-[16px] font-medium rounded-[4px] cursor-pointer transition-all duration-200 hover:bg-[#f3f4f6]">
          7
        </li>
      </ul>
    </nav>
  );
}
