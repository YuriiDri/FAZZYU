function CraftButton() {
  return (
    <div className="absolute contents left-[23px] top-[176px]" data-name="CRAFT BUTTON">
      <div className="absolute bg-[rgba(20,20,20,0)] h-[48px] left-[23px] rounded-[10px] top-[176px] w-[462px]" data-name="CRAFT BUTTON" />
      <p className="[word-break:break-word] absolute font-['Roboto:Medium',sans-serif] font-medium h-[23px] leading-[normal] left-[216px] opacity-75 text-[22px] text-white top-[188px] w-[52px]" style={{ fontVariationSettings: '"wdth" 100' }}>
        Craft
      </p>
    </div>
  );
}

function DollsButton() {
  return (
    <div className="absolute contents left-[23px] top-[130px]" data-name="DOLLS BUTTON">
      <div className="absolute bg-[rgba(20,20,20,0)] border border-[rgba(255,255,255,0.25)] border-solid h-[48px] left-[23px] rounded-[10px] top-[130px] w-[462px]" data-name="DOLLS BUTTON" />
      <p className="[word-break:break-word] absolute font-['Roboto:Medium',sans-serif] font-medium h-[23px] leading-[normal] left-[216px] opacity-75 text-[22px] text-white top-[142px] w-[53px]" style={{ fontVariationSettings: '"wdth" 100' }}>
        Dolls
      </p>
    </div>
  );
}

function ThemedButton() {
  return (
    <div className="absolute contents left-[23px] top-[83px]" data-name="THEMED BUTTON">
      <div className="absolute bg-[rgba(20,20,20,0)] border border-[rgba(255,255,255,0.25)] border-solid h-[48px] left-[23px] rounded-[10px] top-[83px] w-[462px]" data-name="THEMED BUTTON" />
      <p className="[word-break:break-word] absolute font-['Roboto:Medium',sans-serif] font-medium h-[23px] leading-[normal] left-[199px] opacity-75 text-[22px] text-white top-[95px] w-[88px]" style={{ fontVariationSettings: '"wdth" 100' }}>
        Themed
      </p>
    </div>
  );
}

function BouquetButton() {
  return (
    <div className="absolute contents left-[23px] top-[36px]" data-name="BOUQUET BUTTON">
      <div className="absolute bg-[rgba(20,20,20,0)] border border-[rgba(255,255,255,0.25)] border-solid h-[48px] left-[23px] rounded-bl-[10px] rounded-br-[10px] top-[36px] w-[462px]" data-name="BOUQUET BUTTON" />
      <p className="[word-break:break-word] absolute font-['Roboto:Medium',sans-serif] font-medium h-[23px] leading-[normal] left-[199px] opacity-75 text-[22px] text-white top-[48px] w-[87px]" style={{ fontVariationSettings: '"wdth" 100' }}>
        Bouquet
      </p>
    </div>
  );
}

export default function CategoryDropdown() {
  return (
    <div className="relative size-full" data-name="CATEGORY | DROPDOWN">
      <div className="absolute bg-[#1a1a1a] border border-[#878787] border-solid h-[188px] left-[23px] rounded-bl-[10px] rounded-br-[10px] top-[36px] w-[462px]" data-name="PANEL" />
      <CraftButton />
      <DollsButton />
      <ThemedButton />
      <BouquetButton />
    </div>
  );
}