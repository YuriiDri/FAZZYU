import svgPaths from "./svg-3ydperc1vn";
import imgLogo from "./b34d701fd1ceed4106f0f96c9254084af23d9951.png";

function NextArrow() {
  return (
    <div className="absolute left-[712px] size-[16px] top-[948px]" data-name="NEXT ARROW">
      <svg className="absolute block inset-0 size-full" fill="none" height="16" preserveAspectRatio="none" viewBox="0 0 16 16" width="16">
        <g id="NEXT ARROW">
          <path d={svgPaths.pa4fed80} fill="white" fillOpacity="0.88" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function NextArrow1() {
  return (
    <div className="absolute flex items-center justify-center left-[1066px] size-[16px] top-[948px]">
      <div className="flex-none rotate-180">
        <div className="relative size-[16px]" data-name="NEXT ARROW">
          <svg className="absolute block inset-0 size-full" fill="none" height="16" preserveAspectRatio="none" viewBox="0 0 16 16" width="16">
            <g id="NEXT ARROW">
              <path d={svgPaths.pa4fed80} fill="white" fillOpacity="0.88" id="Vector" />
            </g>
          </svg>
        </div>
      </div>
    </div>
  );
}

function ChapterPanel() {
  return (
    <div className="absolute contents left-[691px] top-[914px]" data-name="CHAPTER PANEL">
      <div className="absolute bg-[#141414] h-[83px] left-[691px] rounded-[15px] top-[914px] w-[408px]" data-name="NUMBER BAR" />
      <NextArrow />
      <NextArrow1 />
      <div className="absolute bg-[#ca498c] h-[57px] left-[760px] rounded-[10px] top-[927px] w-[42px]" data-name="ACTIVE NUMBER" />
      <p className="[word-break:break-word] absolute font-['Roboto:Medium',sans-serif] font-medium leading-[normal] left-[773px] text-[24px] text-white top-[942px] whitespace-nowrap" style={{ fontVariationSettings: '"wdth" 100' }}>
        1
      </p>
      <p className="[word-break:break-word] absolute font-['Roboto:Medium',sans-serif] font-medium leading-[normal] left-[847px] text-[24px] text-white top-[942px] whitespace-nowrap" style={{ fontVariationSettings: '"wdth" 100' }}>
        2
      </p>
      <p className="[word-break:break-word] absolute font-['Roboto:Medium',sans-serif] font-medium leading-[normal] left-[906px] text-[24px] text-white top-[942px] whitespace-nowrap" style={{ fontVariationSettings: '"wdth" 100' }}>
        3
      </p>
      <p className="[word-break:break-word] absolute font-['Roboto:Medium',sans-serif] font-medium leading-[normal] left-[965px] text-[24px] text-white top-[942px] whitespace-nowrap" style={{ fontVariationSettings: '"wdth" 100' }}>
        4
      </p>
      <p className="[word-break:break-word] absolute font-['Roboto:Bold',sans-serif] font-bold leading-[normal] left-[1024px] text-[24px] text-white top-[942px] whitespace-nowrap" style={{ fontVariationSettings: '"wdth" 100' }}>
        5
      </p>
    </div>
  );
}

function Status() {
  return (
    <div className="absolute contents left-[1090px] top-[352px]" data-name="STATUS">
      <div className="absolute bg-[rgba(144,238,144,0.2)] h-[29px] left-[1091px] rounded-[10px] top-[352px] w-[68px]" />
      <p className="-translate-x-1/2 [word-break:break-word] absolute font-['Roboto:Medium',sans-serif] font-medium h-[23px] leading-[normal] left-[1125px] text-[#b5b47e] text-[20px] text-center top-[355px] w-[70px]" style={{ fontVariationSettings: '"wdth" 100' }}>
        Paid
      </p>
    </div>
  );
}

function ExampleRowTableData() {
  return (
    <a className="absolute contents cursor-pointer left-[379px] top-[330px]" data-name="EXAMPLE ROW TABLE DATA">
      <div className="absolute bg-[#141414] border border-[rgba(255,255,255,0.25)] border-solid h-[72px] left-[379px] top-[330px] w-[1032px]" data-name="ROW TABLE EXAMPLE" />
      <p className="[word-break:break-word] absolute font-['Roboto:Medium',sans-serif] font-medium h-[23px] leading-[normal] left-[709px] opacity-75 text-[20px] text-white top-[357px] w-[92px]" style={{ fontVariationSettings: '"wdth" 100' }}>
        ₱650
      </p>
      <p className="[word-break:break-word] absolute font-['Roboto:Medium',sans-serif] font-medium h-[23px] leading-[normal] left-[892px] opacity-75 text-[18px] text-white top-[355px] w-[123px]" style={{ fontVariationSettings: '"wdth" 100' }}>
        22 May 2024
      </p>
      <p className="[word-break:break-word] absolute font-['Roboto:Medium',sans-serif] font-medium h-[23px] leading-[normal] left-[427px] opacity-75 text-[20px] text-white top-[354px] w-[184px]" style={{ fontVariationSettings: '"wdth" 100' }}>
        Sunflower Bouquet
      </p>
      <Status />
      <div className="absolute inset-[34.18%_8.26%_62.66%_89.44%]" data-name="EDIT ICON">
        <svg className="absolute block inset-0 size-full" fill="none" height="32.375" preserveAspectRatio="none" viewBox="0 0 33 32.375" width="33">
          <path d={svgPaths.p3e4e2000} fill="#9D9898" id="EDIT ICON" />
        </svg>
      </div>
    </a>
  );
}

function LogoutIcon() {
  return (
    <div className="absolute left-[54px] size-[46px] top-[919px]" data-name="LOGOUT ICON">
      <svg className="absolute block inset-0 size-full" fill="none" height="46" preserveAspectRatio="none" viewBox="0 0 46 46" width="46">
        <g id="LOGOUT ICON">
          <path clipRule="evenodd" d={svgPaths.pdaa6690} fill="#E6E6E6" fillRule="evenodd" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function LogoutButton() {
  return (
    <div className="absolute contents left-[16px] top-[906px]" data-name="LOGOUT BUTTON">
      <div className="absolute bg-[rgba(56,28,42,0)] h-[72px] left-[16px] rounded-[10px] top-[906px] w-[328px]" data-name="LOGOUT BUTTON" />
      <p className="[word-break:break-word] absolute font-['Roboto:Regular',sans-serif] font-normal leading-[normal] left-[121px] text-[24px] text-white top-[928px] whitespace-nowrap" style={{ fontVariationSettings: '"wdth" 100' }}>
        Logout
      </p>
      <LogoutIcon />
    </div>
  );
}

function OrderIcon() {
  return (
    <div className="absolute left-[51px] size-[45px] top-[409px]" data-name="ORDER ICON">
      <svg className="absolute block inset-0 size-full" fill="none" height="45" preserveAspectRatio="none" viewBox="0 0 45 45" width="45">
        <g id="ORDER ICON">
          <path d={svgPaths.p1aa77d70} fill="#E6E6E6" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function OrderListButton() {
  return (
    <a className="absolute contents cursor-pointer left-[16px] top-[396px]" data-name="ORDER LIST BUTTON">
      <div className="absolute bg-[rgba(56,28,42,0)] h-[72px] left-[16px] rounded-[10px] top-[396px] w-[328px]" data-name="ORDER BUTTON" />
      <p className="[word-break:break-word] absolute font-['Roboto:Regular',sans-serif] font-normal leading-[normal] left-[109px] text-[24px] text-white top-[418px] whitespace-nowrap" style={{ fontVariationSettings: '"wdth" 100' }}>
        Order List
      </p>
      <OrderIcon />
    </a>
  );
}

function InventoryIcon() {
  return (
    <div className="absolute aspect-[16/16] left-[3.75%] overflow-clip right-[93.47%] top-[340px]" data-name="INVENTORY ICON">
      <div className="absolute inset-[6.25%_6.98%_6.25%_6.99%]" data-name="Vector">
        <svg className="absolute block inset-0 size-full" fill="none" height="35" preserveAspectRatio="none" viewBox="0 0 34.4128 35" width="34.4128">
          <path d={svgPaths.p773ac00} fill="#E6E6E6" id="Vector" />
        </svg>
      </div>
    </div>
  );
}

function InventoryButton() {
  return (
    <div className="absolute contents left-[16px] top-[324px]" data-name="INVENTORY BUTTON">
      <div className="absolute bg-[rgba(56,28,42,0)] h-[72px] left-[16px] rounded-[10px] top-[324px] w-[328px]" data-name="INVENTORY BUTTON" />
      <p className="[word-break:break-word] absolute font-['Roboto:Regular',sans-serif] font-normal leading-[normal] left-[109px] text-[24px] text-white top-[350px] whitespace-nowrap" style={{ fontVariationSettings: '"wdth" 100' }}>
        Inventory
      </p>
      <InventoryIcon />
    </div>
  );
}

function EditIcon() {
  return (
    <div className="absolute left-[47px] size-[48px] top-[270px]" data-name="EDIT ICON">
      <svg className="absolute block inset-0 size-full" fill="none" height="48" preserveAspectRatio="none" viewBox="0 0 48 48" width="48">
        <g id="EDIT ICON">
          <path d={svgPaths.pa62a680} fill="#E6E6E6" id="Vector" />
          <path d={svgPaths.p2f072700} fill="#E6E6E6" id="Vector_2" />
        </g>
      </svg>
    </div>
  );
}

function AddEditButton() {
  return (
    <div className="absolute contents left-[16px] top-[258px]" data-name="ADD/EDIT BUTTON">
      <div className="absolute bg-[#381c2a] h-[72px] left-[16px] rounded-[10px] top-[258px] w-[328px]" data-name="ADD/EDIT BUTTON" />
      <p className="[word-break:break-word] absolute font-['Roboto:Regular',sans-serif] font-normal leading-[normal] left-[109px] text-[24px] text-white top-[280px] whitespace-nowrap" style={{ fontVariationSettings: '"wdth" 100' }}>
        Add/Edit Order
      </p>
      <EditIcon />
    </div>
  );
}

function HomePageButton1() {
  return (
    <div className="absolute left-[51px] size-[40px] top-[196px]" data-name="HOME PAGE BUTTON">
      <svg className="absolute block inset-0 size-full" fill="none" height="40" preserveAspectRatio="none" viewBox="0 0 40 40" width="40">
        <g id="HOME PAGE BUTTON">
          <path d={svgPaths.p30e180} fill="#E6E6E6" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function HomePageButton() {
  return (
    <div className="absolute contents left-[16px] top-[183px]" data-name="HOME PAGE BUTTON">
      <div className="absolute bg-[rgba(56,28,42,0)] h-[72px] left-[16px] rounded-[10px] top-[183px] w-[328px]" data-name="HOME BUTTON" />
      <p className="[word-break:break-word] absolute font-['Roboto:Medium',sans-serif] font-medium leading-[normal] left-[109px] text-[24px] text-white top-[202px] whitespace-nowrap" style={{ fontVariationSettings: '"wdth" 100' }}>
        Dashboard
      </p>
      <HomePageButton1 />
    </div>
  );
}

function AddNewOrderButton() {
  return (
    <div className="absolute contents left-[1160px] top-[177px]" data-name="ADD NEW ORDER BUTTON">
      <div className="absolute bg-[#ca498c] border border-[rgba(255,255,255,0.25)] border-solid h-[72px] left-[1160px] rounded-[15px] top-[177px] w-[251px]" data-name="ADD NEW ORDER BUTTON" />
      <p className="[word-break:break-word] absolute font-['Roboto:SemiBold',sans-serif] font-semibold h-[23px] leading-[normal] left-[1224px] text-[22px] text-[rgba(255,255,255,0.74)] top-[202px] w-[161px]" style={{ fontVariationSettings: '"wdth" 100' }}>
        Add New Order
      </p>
      <p className="[word-break:break-word] absolute font-['Roboto:SemiBold',sans-serif] font-semibold h-[23px] leading-[normal] left-[1200px] text-[25px] text-[rgba(255,255,255,0.74)] top-[202px] w-[29px]" style={{ fontVariationSettings: '"wdth" 100' }}>
        +
      </p>
    </div>
  );
}

function DropDownIcon() {
  return (
    <div className="absolute left-[1048px] size-[16px] top-[205px]" data-name="DROP DOWN ICON">
      <svg className="absolute block inset-0 size-full" fill="none" height="16" preserveAspectRatio="none" viewBox="0 0 16 16" width="16">
        <g id="DROP DOWN ICON">
          <path d={svgPaths.p2fb72b40} fill="white" fillOpacity="0.75" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function AllStatusDropDown() {
  return (
    <div className="absolute contents left-[889px] top-[177px]" data-name="ALL STATUS DROP DOWN">
      <div className="absolute bg-[#141414] border border-[rgba(255,255,255,0.25)] border-solid h-[72px] left-[889px] rounded-[15px] top-[177px] w-[221px]" data-name="STATUS | DROP DOWN" />
      <p className="[word-break:break-word] absolute font-['Roboto:Medium',sans-serif] font-medium h-[23px] leading-[normal] left-[936px] text-[20px] text-[rgba(255,255,255,0.74)] top-[201px] w-[92px]" style={{ fontVariationSettings: '"wdth" 100' }}>
        All Status
      </p>
      <DropDownIcon />
    </div>
  );
}

function SearchIcon() {
  return (
    <div className="absolute left-[415px] size-[28px] top-[199px]" data-name="SEARCH ICON">
      <svg className="absolute block inset-0 size-full" fill="none" height="28" preserveAspectRatio="none" viewBox="0 0 28 28" width="28">
        <g id="SEARCH ICON">
          <path clipRule="evenodd" d={svgPaths.p22071380} fill="white" fillOpacity="0.75" fillRule="evenodd" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function SearchBar() {
  return (
    <div className="absolute contents left-[394px] top-[177px]" data-name="SEARCH BAR">
      <div className="absolute bg-[#141414] border border-[rgba(255,255,255,0.25)] border-solid h-[72px] left-[394px] rounded-[15px] top-[177px] w-[460px]" data-name="SEARCH BAR" />
      <p className="[word-break:break-word] absolute font-['Roboto:Medium',sans-serif] font-medium h-[23px] leading-[normal] left-[457px] text-[20px] text-[rgba(255,255,255,0.74)] top-[203px] w-[228px]" style={{ fontVariationSettings: '"wdth" 100' }}>
        Search Order, Customer...
      </p>
      <SearchIcon />
    </div>
  );
}

export default function AddEditPage() {
  return (
    <div className="bg-[#0c0d0c] relative size-full" data-name="ADD / EDIT PAGE">
      <ChapterPanel />
      <div className="absolute bg-[#141414] border border-[rgba(255,255,255,0.25)] border-solid h-[629px] left-[379px] rounded-[15px] top-[270px] w-[1032px]" data-name="TABLE" />
      <div className="absolute bg-[#141414] border border-[rgba(255,255,255,0.25)] border-solid h-[72px] left-[379px] top-[402px] w-[1032px]" data-name="ROW TABLE" />
      <div className="absolute bg-[#141414] border border-[rgba(255,255,255,0.25)] border-solid h-[72px] left-[379px] top-[474px] w-[1032px]" data-name="ROW TABLE" />
      <div className="absolute bg-[#141414] border border-[rgba(255,255,255,0.25)] border-solid h-[72px] left-[379px] top-[546px] w-[1032px]" data-name="ROW TABLE" />
      <div className="absolute bg-[#141414] border border-[rgba(255,255,255,0.25)] border-solid h-[72px] left-[379px] top-[618px] w-[1032px]" data-name="ROW TABLE" />
      <div className="absolute bg-[#141414] border border-[rgba(255,255,255,0.25)] border-solid h-[72px] left-[379px] top-[690px] w-[1032px]" data-name="ROW TABLE" />
      <div className="absolute bg-[#141414] border border-[rgba(255,255,255,0.25)] border-solid h-[72px] left-[379px] top-[762px] w-[1032px]" data-name="ROW TABLE" />
      <p className="[word-break:break-word] absolute font-['Roboto:Medium',sans-serif] font-medium h-[23px] leading-[normal] left-[1281px] opacity-75 text-[20px] text-[rgba(255,255,255,0.74)] top-[296px] w-[92px]" style={{ fontVariationSettings: '"wdth" 100' }}>
        Action
      </p>
      <p className="[word-break:break-word] absolute font-['Roboto:Medium',sans-serif] font-medium h-[23px] leading-[normal] left-[1093px] opacity-75 text-[20px] text-[rgba(255,255,255,0.74)] top-[296px] w-[92px]" style={{ fontVariationSettings: '"wdth" 100' }}>
        Status
      </p>
      <p className="[word-break:break-word] absolute font-['Roboto:Medium',sans-serif] font-medium h-[23px] leading-[normal] left-[907px] opacity-75 text-[20px] text-[rgba(255,255,255,0.74)] top-[294px] w-[92px]" style={{ fontVariationSettings: '"wdth" 100' }}>
        Date
      </p>
      <p className="[word-break:break-word] absolute font-['Roboto:Medium',sans-serif] font-medium h-[23px] leading-[normal] left-[712px] opacity-75 text-[20px] text-[rgba(255,255,255,0.74)] top-[294px] w-[92px]" style={{ fontVariationSettings: '"wdth" 100' }}>
        Price
      </p>
      <p className="[word-break:break-word] absolute font-['Roboto:Medium',sans-serif] font-medium h-[23px] leading-[normal] left-[429px] opacity-75 text-[20px] text-[rgba(255,255,255,0.74)] top-[290px] w-[92px]" style={{ fontVariationSettings: '"wdth" 100' }}>
        Title
      </p>
      <ExampleRowTableData />
      <div className="absolute bg-[#110f10] h-[999px] left-[16px] rounded-[20px] top-[12px] w-[328px]" data-name="SIDE PANEL" />
      <LogoutButton />
      <OrderListButton />
      <InventoryButton />
      <AddEditButton />
      <HomePageButton />
      <AddNewOrderButton />
      <AllStatusDropDown />
      <SearchBar />
      <p className="[word-break:break-word] absolute font-['Roboto:Medium',sans-serif] font-medium leading-[normal] left-[390px] text-[24px] text-white top-[128px] whitespace-nowrap" style={{ fontVariationSettings: '"wdth" 100' }}>
        Manage and track all customer orders.
      </p>
      <p className="[word-break:break-word] absolute font-['Crimson_Text:SemiBold',sans-serif] leading-[normal] left-[390px] not-italic text-[64px] text-white top-[45px] whitespace-nowrap">Add / Edit Order</p>
      <div className="absolute h-[72px] left-[71px] top-[42px] w-[202px]" data-name="LOGO">
        <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgLogo} />
      </div>
    </div>
  );
}