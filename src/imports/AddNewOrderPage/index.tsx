import svgPaths from "./svg-bb4gtb2x3l";
import imgExampleImage from "./445d63cade49b491f1e27440d8ab3761cb04e4cd.png";
import imgLogo from "./b34d701fd1ceed4106f0f96c9254084af23d9951.png";

function DeleteButton() {
  return (
    <div className="absolute left-[776px] size-[16px] top-[872px]" data-name="DELETE BUTTON">
      <svg className="absolute block inset-0 size-full" fill="none" height="16" preserveAspectRatio="none" viewBox="0 0 16 16" width="16">
        <g id="DELETE BUTTON">
          <path d={svgPaths.p3d3fe090} fill="#E6E6E6" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function ExampleImage() {
  return (
    <div className="absolute contents left-[637px] top-[861px]" data-name="EXAMPLE IMAGE">
      <div className="absolute h-[177px] left-[637px] pointer-events-none rounded-[12px] top-[861px] w-[166px]" data-name="EXAMPLE IMAGE">
        <img alt="" className="absolute inset-0 max-w-none object-cover rounded-[12px] size-full" src={imgExampleImage} />
        <div aria-hidden className="absolute border border-[rgba(255,255,255,0.25)] border-solid inset-0 rounded-[12px]" />
      </div>
      <DeleteButton />
    </div>
  );
}

function Group() {
  return (
    <div className="absolute inset-[12.44%_8.35%_12.5%_8.37%]" data-name="Group">
      <div className="absolute inset-[-2.34%_-2.11%]">
        <svg className="block size-full" fill="none" height="44.7864" preserveAspectRatio="none" viewBox="0 0 49.4715 44.7864" width="49.4715">
          <g id="Group">
            <path d={svgPaths.p10b31b00} id="Vector" stroke="#E6E6E6" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
            <path d={svgPaths.p1dc32d00} id="Vector_2" stroke="#E6E6E6" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
            <path d={svgPaths.pdcb3e00} id="Vector_3" stroke="#E6E6E6" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          </g>
        </svg>
      </div>
    </div>
  );
}

function UploadIcon() {
  return (
    <div className="absolute left-[484px] overflow-clip size-[57px] top-[906px]" data-name="UPLOAD ICON">
      <Group />
    </div>
  );
}

function UploadButton() {
  return (
    <div className="absolute contents left-[415px] top-[861px]" data-name="UPLOAD BUTTON">
      <div className="absolute bg-[#141414] border border-[rgba(255,255,255,0.25)] border-dashed h-[177px] left-[415px] rounded-[12px] top-[861px] w-[195px]" data-name="UPLOAD BUTTON" />
      <p className="[word-break:break-word] absolute font-['Roboto:Regular',sans-serif] font-normal h-[23px] leading-[normal] left-[446px] opacity-75 text-[14px] text-white top-[963px] w-[153px]" style={{ fontVariationSettings: '"wdth" 100' }}>
        Click to upload image
      </p>
      <UploadIcon />
    </div>
  );
}

function AttachImageCardPanel() {
  return (
    <div className="absolute contents left-[378px] top-[749px]" data-name="ATTACH IMAGE CARD PANEL">
      <div className="absolute bg-[#141414] border border-[rgba(255,255,255,0.25)] border-solid h-[314px] left-[378px] rounded-[15px] top-[749px] w-[1032px]" data-name="ATTACH IMAGE CARD PANEL" />
      <ExampleImage />
      <UploadButton />
      <p className="[word-break:break-word] absolute font-['Roboto:Regular',sans-serif] font-normal h-[23px] leading-[normal] left-[416px] opacity-75 text-[20px] text-white top-[821px] w-[714px]" style={{ fontVariationSettings: '"wdth" 100' }}>
        This image will be visible to the customer in their order details.
      </p>
      <p className="[word-break:break-word] absolute font-['Roboto:Bold',sans-serif] font-bold h-[23px] leading-[normal] left-[416px] opacity-75 text-[23px] text-white top-[784px] w-[329px]" style={{ fontVariationSettings: '"wdth" 100' }}>
        Attach Product Image
      </p>
    </div>
  );
}

function DescriptionTextfield() {
  return (
    <div className="absolute contents left-[415px] top-[525px]" data-name="DESCRIPTION TEXTFIELD">
      <div className="absolute bg-[#141414] border border-[rgba(255,255,255,0.25)] border-solid h-[119px] left-[415px] rounded-[10px] top-[573px] w-[959px]" data-name="DESCRIPTION TEXTFIELD" />
      <p className="[word-break:break-word] absolute font-['Roboto:Medium',sans-serif] font-medium h-[23px] leading-[normal] left-[416px] opacity-75 text-[22px] text-white top-[525px] w-[184px]" style={{ fontVariationSettings: '"wdth" 100' }}>
        Description
      </p>
    </div>
  );
}

function DropdownIcon() {
  return (
    <div className="absolute left-[1335px] size-[16px] top-[458px]" data-name="DROPDOWN ICON">
      <svg className="absolute block inset-0 size-full" fill="none" height="16" preserveAspectRatio="none" viewBox="0 0 16 16" width="16">
        <g id="DROPDOWN ICON">
          <path d={svgPaths.p2fb72b40} fill="white" fillOpacity="0.75" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function CategoryDropdown() {
  return (
    <div className="absolute contents left-[920px] top-[401px]" data-name="CATEGORY DROPDOWN">
      <div className="absolute bg-[#141414] border border-[rgba(255,255,255,0.25)] border-solid h-[48px] left-[920px] rounded-[10px] top-[442px] w-[453px]" data-name="CATEGORY DROPDOWN" />
      <p className="[word-break:break-word] absolute font-['Roboto:Medium',sans-serif] font-medium h-[23px] leading-[normal] left-[920px] opacity-75 text-[22px] text-white top-[401px] w-[184px]" style={{ fontVariationSettings: '"wdth" 100' }}>
        Category
      </p>
      <DropdownIcon />
    </div>
  );
}

function DropdownIcon1() {
  return (
    <div className="absolute left-[833px] size-[16px] top-[459px]" data-name="DROPDOWN ICON">
      <svg className="absolute block inset-0 size-full" fill="none" height="16" preserveAspectRatio="none" viewBox="0 0 16 16" width="16">
        <g id="DROPDOWN ICON">
          <path d={svgPaths.p2fb72b40} fill="white" fillOpacity="0.75" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function StatusDropdown() {
  return (
    <div className="absolute contents left-[416px] top-[401px]" data-name="STATUS DROPDOWN">
      <div className="absolute bg-[#141414] border border-[rgba(255,255,255,0.25)] border-solid h-[48px] left-[416px] rounded-[10px] top-[442px] w-[461px]" data-name="STATUS DROPDOWN" />
      <p className="[word-break:break-word] absolute font-['Roboto:Medium',sans-serif] font-medium h-[23px] leading-[normal] left-[416px] opacity-75 text-[22px] text-white top-[401px] w-[184px]" style={{ fontVariationSettings: '"wdth" 100' }}>
        Status
      </p>
      <DropdownIcon1 />
    </div>
  );
}

function PriceTextfield() {
  return (
    <div className="absolute contents left-[920px] top-[276px]" data-name="PRICE TEXTFIELD">
      <div className="absolute bg-[#141414] border border-[rgba(255,255,255,0.25)] border-solid h-[48px] left-[920px] rounded-[10px] top-[313px] w-[454px]" data-name="PRICE TEXTFIELD" />
      <p className="[word-break:break-word] absolute font-['Roboto:Medium',sans-serif] font-medium h-[23px] leading-[normal] left-[920px] opacity-75 text-[22px] text-white top-[276px] w-[184px]" style={{ fontVariationSettings: '"wdth" 100' }}>
        Price (P)
      </p>
    </div>
  );
}

function OrderTitleTextfield() {
  return (
    <div className="absolute contents left-[416px] top-[276px]" data-name="ORDER TITLE TEXTFIELD">
      <div className="absolute bg-[#141414] border border-[rgba(255,255,255,0.25)] border-solid h-[48px] left-[416px] rounded-[10px] top-[313px] w-[490px]" data-name="ORDER TITLE TEXTFIELD" />
      <p className="[word-break:break-word] absolute font-['Roboto:Medium',sans-serif] font-medium h-[23px] leading-[normal] left-[416px] opacity-75 text-[22px] text-white top-[276px] w-[184px]" style={{ fontVariationSettings: '"wdth" 100' }}>
        Order Title
      </p>
    </div>
  );
}

function HomePageButton() {
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

function HomeButton() {
  return (
    <div className="absolute contents left-[16px] top-[184px]" data-name="HOME BUTTON">
      <p className="[word-break:break-word] absolute font-['Roboto:Medium',sans-serif] font-medium leading-[normal] left-[109px] text-[24px] text-white top-[202px] whitespace-nowrap" style={{ fontVariationSettings: '"wdth" 100' }}>
        Dashboard
      </p>
      <HomePageButton />
      <div className="absolute bg-[rgba(56,28,42,0)] h-[72px] left-[16px] rounded-[10px] top-[184px] w-[328px]" data-name="INVENTORY BUTTON" />
    </div>
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

function OrderButton() {
  return (
    <div className="absolute contents left-[16px] top-[396px]" data-name="ORDER BUTTON">
      <div className="absolute bg-[rgba(56,28,42,0)] h-[72px] left-[16px] rounded-[10px] top-[396px] w-[328px]" data-name="ORDER BUTTON" />
      <p className="[word-break:break-word] absolute font-['Roboto:Regular',sans-serif] font-normal leading-[normal] left-[109px] text-[24px] text-white top-[418px] whitespace-nowrap" style={{ fontVariationSettings: '"wdth" 100' }}>
        Order List
      </p>
      <OrderIcon />
    </div>
  );
}

function LogoutIcon() {
  return (
    <div className="absolute left-[57px] size-[46px] top-[977px]" data-name="LOGOUT ICON">
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
    <div className="absolute contents left-[16px] top-[966px]" data-name="LOGOUT BUTTON">
      <p className="[word-break:break-word] absolute font-['Roboto:Regular',sans-serif] font-normal leading-[normal] left-[124px] text-[24px] text-white top-[986px] whitespace-nowrap" style={{ fontVariationSettings: '"wdth" 100' }}>
        Logout
      </p>
      <div className="absolute bg-[rgba(56,28,42,0)] h-[72px] left-[16px] rounded-[10px] top-[966px] w-[328px]" data-name="LOGOUT BUTTON" />
      <LogoutIcon />
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

function AddNewOrderButton() {
  return (
    <div className="absolute contents left-[1160px] top-[70px]" data-name="ADD NEW ORDER BUTTON">
      <div className="absolute bg-[#ca498c] border border-[rgba(255,255,255,0.25)] border-solid h-[72px] left-[1160px] rounded-[15px] top-[70px] w-[251px]" data-name="ADD NEW ORDER BUTTON" />
      <p className="[word-break:break-word] absolute font-['Roboto:SemiBold',sans-serif] font-semibold h-[23px] leading-[normal] left-[1224px] text-[22px] text-[rgba(255,255,255,0.74)] top-[95px] w-[161px]" style={{ fontVariationSettings: '"wdth" 100' }}>
        Add New Order
      </p>
      <p className="[word-break:break-word] absolute font-['Roboto:SemiBold',sans-serif] font-semibold h-[23px] leading-[normal] left-[1200px] text-[25px] text-[rgba(255,255,255,0.74)] top-[95px] w-[29px]" style={{ fontVariationSettings: '"wdth" 100' }}>
        +
      </p>
    </div>
  );
}

function CancelButton() {
  return (
    <div className="absolute contents left-[976px] top-[70px]" data-name="CANCEL BUTTON">
      <div className="absolute bg-[#141414] border border-[rgba(255,255,255,0.25)] border-solid h-[72px] left-[976px] rounded-[15px] top-[70px] w-[163px]" data-name="CANCEL BUTTON" />
      <p className="[word-break:break-word] absolute font-['Roboto:Medium',sans-serif] font-medium h-[23px] leading-[normal] left-[1023px] text-[20px] text-[rgba(255,255,255,0.74)] top-[94px] w-[92px]" style={{ fontVariationSettings: '"wdth" 100' }}>
        Cancel
      </p>
    </div>
  );
}

export default function AddNewOrderPage() {
  return (
    <div className="bg-[#0c0d0c] relative size-full" data-name="ADD NEW ORDER PAGE">
      <AttachImageCardPanel />
      <div className="absolute bg-[#141414] border border-[rgba(255,255,255,0.25)] border-solid h-[551px] left-[379px] rounded-[15px] top-[184px] w-[1032px]" data-name="ORDER INFORMATION CARD PANEL" />
      <DescriptionTextfield />
      <CategoryDropdown />
      <StatusDropdown />
      <PriceTextfield />
      <OrderTitleTextfield />
      <p className="[word-break:break-word] absolute font-['Roboto:Bold',sans-serif] font-bold h-[23px] leading-[normal] left-[416px] opacity-75 text-[23px] text-white top-[218px] w-[225px]" style={{ fontVariationSettings: '"wdth" 100' }}>
        Order Information
      </p>
      <div className="absolute bg-[#110f10] h-[1051px] left-[16px] rounded-[20px] top-[12px] w-[328px]" data-name="SIDE PANEL" />
      <HomeButton />
      <InventoryButton />
      <OrderButton />
      <LogoutButton />
      <AddEditButton />
      <AddNewOrderButton />
      <CancelButton />
      <p className="[word-break:break-word] absolute font-['Roboto:Medium',sans-serif] font-medium leading-[normal] left-[390px] text-[24px] text-white top-[128px] whitespace-pre" style={{ fontVariationSettings: '"wdth" 100' }}>{`Create a  new order for your customer.`}</p>
      <p className="[word-break:break-word] absolute font-['Crimson_Text:SemiBold',sans-serif] leading-[normal] left-[390px] not-italic text-[64px] text-white top-[45px] whitespace-nowrap">Add New Order</p>
      <div className="absolute h-[72px] left-[71px] top-[42px] w-[202px]" data-name="LOGO">
        <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgLogo} />
      </div>
    </div>
  );
}