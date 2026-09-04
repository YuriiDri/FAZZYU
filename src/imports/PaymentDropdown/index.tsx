function CashButton() {
  return (
    <div className="absolute contents left-[23px] top-[83px]" data-name="CASH BUTTON">
      <div className="absolute bg-[rgba(20,20,20,0)] border border-[rgba(255,255,255,0.25)] border-solid h-[48px] left-[23px] rounded-[10px] top-[83px] w-[462px]" data-name="CASH BUTTON" />
      <p className="[word-break:break-word] absolute font-['Roboto:Medium',sans-serif] font-medium h-[23px] leading-[normal] left-[199px] opacity-75 text-[22px] text-white top-[95px] w-[88px]" style={{ fontVariationSettings: '"wdth" 100' }}>
        CASH
      </p>
    </div>
  );
}

function GcashButton() {
  return (
    <div className="absolute contents left-[23px] top-[36px]" data-name="GCASH BUTTON">
      <div className="absolute bg-[rgba(20,20,20,0)] border border-[rgba(255,255,255,0.25)] border-solid h-[48px] left-[23px] rounded-bl-[10px] rounded-br-[10px] top-[36px] w-[462px]" data-name="GCASH BUTTON" />
      <p className="[word-break:break-word] absolute font-['Roboto:Medium',sans-serif] font-medium h-[23px] leading-[normal] left-[199px] opacity-75 text-[22px] text-white top-[48px] w-[87px]" style={{ fontVariationSettings: '"wdth" 100' }}>
        GCASH
      </p>
    </div>
  );
}

export default function PaymentDropdown() {
  return (
    <div className="relative size-full" data-name="PAYMENT | DROPDOWN">
      <div className="absolute bg-[#1a1a1a] border border-[#878787] border-solid h-[95px] left-[23px] rounded-bl-[10px] rounded-br-[10px] top-[36px] w-[462px]" data-name="PANEL" />
      <CashButton />
      <GcashButton />
    </div>
  );
}