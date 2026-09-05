function PendingButton() {
  return (
    <div className="absolute contents left-[23px] top-[176px]" data-name="PENDING BUTTON">
      <div className="absolute bg-[rgba(20,20,20,0)] h-[48px] left-[23px] rounded-[10px] top-[176px] w-[462px]" data-name="PENDING BUTTON" />
      <p className="[word-break:break-word] absolute font-['Roboto:Medium',sans-serif] font-medium h-[23px] leading-[normal] left-[205px] opacity-75 text-[22px] text-white top-[188px] w-[81px]" style={{ fontVariationSettings: '"wdth" 100' }}>
        Pending
      </p>
    </div>
  );
}

function PaidButton() {
  return (
    <div className="absolute contents left-[23px] top-[130px]" data-name="PAID BUTTON">
      <div className="absolute bg-[rgba(20,20,20,0)] border border-[rgba(255,255,255,0.25)] border-solid h-[48px] left-[23px] rounded-[10px] top-[130px] w-[462px]" data-name="PAID BUTTON" />
      <p className="[word-break:break-word] absolute font-['Roboto:Medium',sans-serif] font-medium h-[23px] leading-[normal] left-[217px] opacity-75 text-[22px] text-white top-[142px] w-[46px]" style={{ fontVariationSettings: '"wdth" 100' }}>
        Paid
      </p>
    </div>
  );
}

function OutOfStockButton() {
  return (
    <div className="absolute contents left-[23px] top-[83px]" data-name="OUT OF STOCK BUTTON">
      <div className="absolute bg-[rgba(20,20,20,0)] border border-[rgba(255,255,255,0.25)] border-solid h-[48px] left-[23px] rounded-[10px] top-[83px] w-[462px]" data-name="OUT OF STOCK BUTTON" />
      <p className="[word-break:break-word] absolute font-['Roboto:Medium',sans-serif] font-medium h-[23px] leading-[normal] left-[183px] opacity-75 text-[22px] text-white top-[95px] w-[125px]" style={{ fontVariationSettings: '"wdth" 100' }}>
        Out of Stock
      </p>
    </div>
  );
}

function AvailableButton() {
  return (
    <div className="absolute contents left-[23px] top-[36px]" data-name="AVAILABLE BUTTON">
      <div className="absolute bg-[rgba(20,20,20,0)] border border-[rgba(255,255,255,0.25)] border-solid h-[48px] left-[23px] rounded-bl-[10px] rounded-br-[10px] top-[36px] w-[462px]" data-name="AVAILABLE BUTTON" />
      <p className="[word-break:break-word] absolute font-['Roboto:Medium',sans-serif] font-medium h-[23px] leading-[normal] left-[193px] opacity-75 text-[22px] text-white top-[48px] w-[105px]" style={{ fontVariationSettings: '"wdth" 100' }}>
        Available
      </p>
    </div>
  );
}

export default function StatusDropdown() {
  return (
    <div className="relative size-full" data-name="STATUS | DROPDOWN">
      <div className="absolute bg-[#1a1a1a] border border-[#878787] border-solid h-[188px] left-[23px] rounded-bl-[10px] rounded-br-[10px] top-[36px] w-[462px]" data-name="PANEL" />
      <PendingButton />
      <PaidButton />
      <OutOfStockButton />
      <AvailableButton />
    </div>
  );
}