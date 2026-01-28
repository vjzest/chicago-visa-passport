const visaFullImg = "/landing/assets/visa-full-image.png";

export default function BgFull() {
  return (
    <>
      <div 
        className="visa-single-bg-full max-w-[1440px] mx-auto h-[427px] bg-cover max-[767px]:h-[150px]"
        style={{ backgroundImage: `url(${visaFullImg})` }}
      ></div>
    </>
  );
}
