// import React from "react";

// const LoadingPage = () => {
//   return (
//     <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-indigo-950">
//       <div className="relative">
//         <div className="h-32 w-32 rounded-full border-t-8 border-b-8 border-blue-500 animate-spin"></div>
//         <div
//           className="absolute top-0 left-0 h-32 w-32 rounded-full border-t-8 border-b-8 border-indigo-500 animate-spin "
//           style={{ animationDuration: "3s", animationDirection: "reverse" }}
//         ></div>
//         <div
//           className="absolute top-0 left-0 h-32 w-32 rounded-full border-l-8 border-r-8 border-teal-500 animate-spin "
//           style={{ animationDuration: "1.5s" }}
//         ></div>
//         <div className="absolute inset-0 flex items-center justify-center">
//           <div className="h-16 w-16 bg-white dark:bg-gray-800 rounded-full shadow-lg flex items-center justify-center">
//             {/* <svg
//               className="h-8 w-8 text-blue-500"
//               fill="none"
//               strokeLinecap="round"
//               strokeLinejoin="round"
//               strokeWidth="2"
//               viewBox="0 0 24 24"
//               stroke="currentColor"
//             >
//               <path d="M5 13l4 4L19 7"></path>
//             </svg> */}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default LoadingPage;

import React from "react";

const LoadingPage = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-white dark:bg-gray-900">
      <div className="size-16 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
    </div>
  );
};

export default LoadingPage;
