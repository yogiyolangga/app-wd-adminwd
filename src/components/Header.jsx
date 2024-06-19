import Widget from "../assets/widgets.svg";

export default function Header() {
  return (
    <>
      <div className="w-full flex justify-between items-center">
        <h1 className="font-bold text-[21px]">Dashboard</h1>
        <div className="flex gap-3">
          <a href="/">home</a>
          <a href="/">support</a>
          <a href="/">my account</a>
          <a href="/">
            <img src={Widget} alt="Widgets" className="w-[24px] h-[24px]" />
          </a>
        </div>
      </div>
    </>
  );
}
