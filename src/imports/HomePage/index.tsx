import svgPaths from "./svg-h0pbh9mrjn";
import imgRectangle22 from "./b984e134a710d20bae607ec5d2a67a05932b3602.png";
import imgRectangle17 from "./8bbe4ef13bf84089b951b93a9d69a2de0996fbf9.png";
import imgImage3 from "./85d8a27d2f0c263b5ac1532bcd66e2ba639bd4e0.png";
import imgBoquet from "./7e582f8184054b5f76704446cb4ee1ae91146626.png";
import imgLogo from "./b34d701fd1ceed4106f0f96c9254084af23d9951.png";
import { imgGroup } from "./svg-duddk";

function Group1() {
  return (
    <div className="absolute inset-0 mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-size-[49px_49px]" style={{ maskImage: `url("${imgGroup}")` }} data-name="Group">
      <svg className="absolute block inset-0 size-full" fill="none" height="49" preserveAspectRatio="none" viewBox="0 0 49 49" width="49">
        <g id="Group">
          <path clipRule="evenodd" d={svgPaths.p201ee100} fill="#D17EA5" fillRule="evenodd" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function ClipPathGroup() {
  return (
    <div className="absolute contents inset-0" data-name="Clip path group">
      <Group1 />
    </div>
  );
}

function Group() {
  return (
    <div className="absolute contents inset-0" data-name="Group">
      <ClipPathGroup />
    </div>
  );
}

function FacebookButton() {
  return (
    <div className="absolute left-[74px] overflow-clip size-[49px] top-[2251px]" data-name="FACEBOOK BUTTON">
      <Group />
    </div>
  );
}

function FacebookLink() {
  return (
    <div className="absolute contents left-[74px] top-[2251px]" data-name="FACEBOOK LINK">
      <FacebookButton />
      <p className="[word-break:break-word] absolute font-['Roboto:Regular',sans-serif] font-normal leading-[normal] left-[145px] text-[26px] text-white top-[2263px] whitespace-nowrap" style={{ fontVariationSettings: '"wdth" 100' }}>
        Yuri’s Craft
      </p>
    </div>
  );
}

function EmailIcon() {
  return (
    <div className="absolute left-[74px] size-[49px] top-[2413px]" data-name="EMAIL ICON">
      <svg className="absolute block inset-0 size-full" fill="none" height="49" preserveAspectRatio="none" viewBox="0 0 49 49" width="49">
        <g id="EMAIL ICON">
          <path d={svgPaths.p1dbfeb00} fill="#D17EA5" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function EmailLink() {
  return (
    <div className="absolute contents left-[74px] top-[2413px]" data-name="EMAIL LINK">
      <EmailIcon />
      <p className="[word-break:break-word] absolute font-['Roboto:Regular',sans-serif] font-normal leading-[normal] left-[146px] text-[26px] text-white top-[2413px] whitespace-nowrap" style={{ fontVariationSettings: '"wdth" 100' }}>
        lucasjoshmarie2005@gmail.com
      </p>
    </div>
  );
}

function TiktokIcon() {
  return (
    <div className="absolute aspect-[24/24] left-[4.65%] overflow-clip right-[91.04%] top-[2322px]" data-name="TIKTOK ICON">
      <div className="absolute inset-[8.33%]" data-name="Vector">
        <svg className="absolute block inset-0 size-full" fill="none" height="51.6667" preserveAspectRatio="none" viewBox="0 0 51.6667 51.6667" width="51.6667">
          <path d={svgPaths.p6a19b00} fill="#D17EA5" id="Vector" />
        </svg>
      </div>
    </div>
  );
}

function TiktokLink() {
  return (
    <div className="absolute contents left-[67px] top-[2322px]" data-name="TIKTOK LINK">
      <p className="[word-break:break-word] absolute font-['Roboto:Regular',sans-serif] font-normal leading-[normal] left-[146px] text-[26px] text-white top-[2338px] whitespace-nowrap" style={{ fontVariationSettings: '"wdth" 100' }}>
        @ate_yuriiiiiii
      </p>
      <TiktokIcon />
    </div>
  );
}

function SendAMessageButton() {
  return (
    <div className="absolute contents left-[758px] top-[2427px]" data-name="SEND A MESSAGE BUTTON">
      <div className="absolute bg-[#d17ea5] h-[63px] left-[758px] rounded-[10px] shadow-[0px_4px_15px_5px_rgba(246,169,169,0.15)] top-[2427px] w-[591px]" data-name="SEND A MESSAGE BUTTON" />
      <p className="[word-break:break-word] absolute font-['Roboto:Medium',sans-serif] font-medium leading-[normal] left-[956px] text-[26px] text-black top-[2444px] whitespace-nowrap" style={{ fontVariationSettings: '"wdth" 100' }}>
        Send a Message
      </p>
    </div>
  );
}

function TextFieldName() {
  return (
    <div className="absolute contents left-[758px] top-[2163px]" data-name="TEXT FIELD NAME">
      <div className="absolute bg-[#624949] h-[60px] left-[758px] rounded-[10px] top-[2163px] w-[591px]" data-name="TEXT FIELD NAME" />
      <p className="[word-break:break-word] absolute font-['Roboto:Regular',sans-serif] font-normal leading-[normal] left-[784px] text-[26px] text-white top-[2178px] whitespace-nowrap" style={{ fontVariationSettings: '"wdth" 100' }}>
        Your Name
      </p>
    </div>
  );
}

function SendAMessageTextField() {
  return (
    <div className="absolute contents left-[758px] top-[2237px]" data-name="SEND A MESSAGE TEXT FIELD">
      <div className="absolute bg-[#624949] h-[169px] left-[758px] rounded-[10px] top-[2237px] w-[591px]" data-name="TEXT FIELD MESSAGE" />
      <p className="[word-break:break-word] absolute font-['Roboto:Regular',sans-serif] font-normal leading-[normal] left-[784px] text-[26px] text-white top-[2257px] whitespace-nowrap" style={{ fontVariationSettings: '"wdth" 100' }}>
        Your Message...
      </p>
    </div>
  );
}

function SendUsAMessageSection() {
  return (
    <div className="absolute contents left-[718px] top-[2053px]" data-name="SEND US A MESSAGE SECTION">
      <div className="absolute bg-[#1b1115] border-2 border-[#ffc7e1] border-solid h-[486px] left-[718px] opacity-20 rounded-[20px] shadow-[0px_4px_10px_4px_rgba(255,162,162,0.3)] top-[2053px] w-[671px]" data-name="MESSAGE PANEL" />
      <p className="[word-break:break-word] absolute font-['Crimson_Text:Regular',sans-serif] leading-[normal] left-[758px] not-italic text-[40px] text-white top-[2100px] whitespace-nowrap">Send us a message!</p>
      <SendAMessageButton />
      <TextFieldName />
      <SendAMessageTextField />
    </div>
  );
}

function SocialsPanelSection() {
  return (
    <div className="absolute contents left-[-2px] top-[2004px]" data-name="SOCIALS PANEL SECTION">
      <div className="absolute bg-[#8b596e] h-[579px] left-[-2px] opacity-10 top-[2004px] w-[1442px]" data-name="SOCIALS PANEL" />
      <div className="[word-break:break-word] absolute font-['Crimson_Text:Regular',sans-serif] leading-[0] left-[64px] not-italic text-[0px] text-white top-[2081px] whitespace-nowrap">
        <p className="leading-[normal] mb-0 text-[55px] whitespace-pre">{`Let’s Create Something `}</p>
        <p className="font-['Crimson_Text:Bold',sans-serif] leading-[normal] text-[#df9ebf] text-[55px] whitespace-pre">Beautiful Together!</p>
      </div>
      <FacebookLink />
      <EmailLink />
      <TiktokLink />
      <SendUsAMessageSection />
    </div>
  );
}

function LocationIcon() {
  return (
    <div className="absolute left-[696px] size-[62px] top-[1541px]" data-name="LOCATION ICON">
      <svg className="absolute block inset-0 size-full" fill="none" height="62" preserveAspectRatio="none" viewBox="0 0 62 62" width="62">
        <g id="LOCATION ICON">
          <path d={svgPaths.pdde81f2} fill="#C43578" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Location() {
  return (
    <div className="absolute contents left-[568px] top-[1446px]" data-name="LOCATION">
      <div className="absolute h-[421px] left-[588px] pointer-events-none rounded-[20px] top-[1503px] w-[763px]">
        <img alt="" className="absolute inset-0 max-w-none object-cover opacity-95 rounded-[20px] size-full" src={imgRectangle22} />
        <div aria-hidden className="absolute border-3 border-[#ac5757] border-solid inset-0 rounded-[20px]" />
      </div>
      <div className="absolute flex h-[530.401px] items-center justify-center left-[568px] top-[1446px] w-[661px]">
        <div className="flex-none rotate-[17.04deg]">
          <div className="h-[378.375px] relative w-[575.365px]" data-name="COVERED">
            <div className="absolute inset-[-13.48%_-9.56%_-15.59%_-9.56%]">
              <svg className="block size-full" fill="none" height="488.375" preserveAspectRatio="none" viewBox="0 0 685.365 488.375" width="685.365">
                <g filter="url(#filter0_d_0_18)" id="COVERED">
                  <ellipse cx="342.683" cy="240.187" fill="#D17EA5" fillOpacity="0.3" rx="287.683" ry="189.187" shapeRendering="crispEdges" />
                </g>
                <defs>
                  <filter colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" height="488.375" id="filter0_d_0_18" width="685.365" x="0" y="0">
                    <feFlood floodOpacity="0" result="BackgroundImageFix" />
                    <feColorMatrix in="SourceAlpha" result="hardAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" />
                    <feMorphology in="SourceAlpha" operator="dilate" radius="5" result="effect1_dropShadow_0_18" />
                    <feOffset dy="4" />
                    <feGaussianBlur stdDeviation="25" />
                    <feComposite in2="hardAlpha" operator="out" />
                    <feColorMatrix type="matrix" values="0 0 0 0 0.901961 0 0 0 0 0.803922 0 0 0 0 0.843137 0 0 0 0.8 0" />
                    <feBlend in2="BackgroundImageFix" mode="normal" result="effect1_dropShadow_0_18" />
                    <feBlend in="SourceGraphic" in2="effect1_dropShadow_0_18" mode="normal" result="shape" />
                  </filter>
                </defs>
              </svg>
            </div>
          </div>
        </div>
      </div>
      <LocationIcon />
    </div>
  );
}

function DeliveryIcon() {
  return (
    <div className="absolute h-[52px] left-[97px] top-[1505px] w-[66px]" data-name="DELIVERY ICON">
      <svg className="absolute block inset-0 size-full" fill="none" height="52" preserveAspectRatio="none" viewBox="0 0 66 52" width="66">
        <g clipPath="url(#clip0_0_11)" id="DELIVERY ICON">
          <path d={svgPaths.pdd81e00} fill="#D17EA5" id="Vector" />
        </g>
        <defs>
          <clipPath id="clip0_0_11">
            <rect fill="white" height="52" width="66" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function DeliveryPanelSection() {
  return (
    <div className="absolute contents left-[55px] top-[1446px]" data-name="DELIVERY PANEL SECTION">
      <Location />
      <DeliveryIcon />
      <div className="absolute bg-[#8b596e] border-3 border-[#fdd0d0] border-solid h-[493px] left-[55px] opacity-10 rounded-[15px] top-[1464px] w-[1329px]" data-name="FREE DELIVERY PANEL" />
      <p className="[word-break:break-word] absolute font-['Roboto:Regular',sans-serif] font-normal leading-[normal] left-[106px] text-[28px] text-white top-[1645px] w-[482px]" style={{ fontVariationSettings: '"wdth" 100' }}>
        Within selected areas of Las Pinas - Pulanglupa Uno, Naga Road Area
      </p>
      <p className="[word-break:break-word] absolute font-['Crimson_Text:Regular',sans-serif] leading-[0] left-[90px] not-italic text-[48px] text-white top-[1572px] whitespace-nowrap">
        <span className="leading-[normal]">{`We Offer `}</span>
        <span className="leading-[normal] text-[#ff5faa]">Free Delivery!</span>
      </p>
    </div>
  );
}

function ArrowButtonIcon() {
  return (
    <div className="absolute flex items-center justify-center left-[70px] size-[39.364px] top-[1219px]">
      <div className="flex-none rotate-[-179.46deg]">
        <div className="relative size-[39px]" data-name="ARROW BUTTON ICON">
          <svg className="absolute block inset-0 size-full" fill="none" height="39" preserveAspectRatio="none" viewBox="0 0 39 39" width="39">
            <g id="ARROW BUTTON ICON">
              <path d={svgPaths.pc3b4500} fill="#FFABAB" id="Vector" />
            </g>
          </svg>
        </div>
      </div>
    </div>
  );
}

function ArrowButtonIcon1() {
  return (
    <div className="absolute left-[1315px] size-[39px] top-[1219px]" data-name="ARROW BUTTON ICON">
      <svg className="absolute block inset-0 size-full" fill="none" height="39" preserveAspectRatio="none" viewBox="0 0 39 39" width="39">
        <g id="ARROW BUTTON ICON">
          <path d={svgPaths.pc3b4500} fill="#FFABAB" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function GaleryIcon() {
  return (
    <div className="absolute contents left-[70px] top-[1076px]" data-name="GALERY ICON">
      <div className="absolute h-[325px] left-[130px] pointer-events-none rounded-[20px] top-[1076px] w-[277px]">
        <img alt="" className="absolute inset-0 max-w-none object-cover rounded-[20px] size-full" src={imgRectangle17} />
        <div aria-hidden className="absolute border-3 border-[#f1c3c3] border-solid inset-0 rounded-[20px]" />
      </div>
      <div className="absolute h-[325px] left-[429px] pointer-events-none rounded-[20px] top-[1076px] w-[277px]">
        <img alt="" className="absolute inset-0 max-w-none object-cover rounded-[20px] size-full" src={imgRectangle17} />
        <div aria-hidden className="absolute border-3 border-[#f1c3c3] border-solid inset-0 rounded-[20px]" />
      </div>
      <div className="absolute h-[325px] left-[727px] pointer-events-none rounded-[20px] top-[1076px] w-[277px]">
        <img alt="" className="absolute inset-0 max-w-none object-cover rounded-[20px] size-full" src={imgRectangle17} />
        <div aria-hidden className="absolute border-3 border-[#f1c3c3] border-solid inset-0 rounded-[20px]" />
      </div>
      <div className="absolute h-[325px] left-[1026px] pointer-events-none rounded-[20px] top-[1076px] w-[277px]">
        <img alt="" className="absolute inset-0 max-w-none object-cover rounded-[20px] size-full" src={imgRectangle17} />
        <div aria-hidden className="absolute border-3 border-[#f1c3c3] border-solid inset-0 rounded-[20px]" />
      </div>
      <ArrowButtonIcon />
      <ArrowButtonIcon1 />
    </div>
  );
}

function GalleryPanelSection() {
  return (
    <div className="absolute contents left-[53px] top-[943px]" data-name="GALLERY PANEL SECTION">
      <GaleryIcon />
      <p className="[word-break:break-word] absolute font-['Roboto:Regular',sans-serif] font-normal leading-[normal] left-[130px] text-[23px] text-white top-[1029px] whitespace-nowrap" style={{ fontVariationSettings: '"wdth" 100' }}>
        A few of our handmade favorites.
      </p>
      <p className="[word-break:break-word] absolute font-['Crimson_Text:Regular',sans-serif] leading-[0] left-[120px] not-italic text-[0px] text-white top-[977px] whitespace-nowrap">
        <span className="leading-[normal] text-[48px]">{`Our `}</span>
        <span className="font-['Crimson_Text:Bold',sans-serif] leading-[normal] text-[#df9ebf] text-[48px]">Gallery</span>
      </p>
      <div className="absolute bg-[#8b596e] border-3 border-[#fdd0d0] border-solid h-[493px] left-[53px] opacity-10 rounded-[15px] top-[943px] w-[1329px]" data-name="PANEL GALLERY" />
    </div>
  );
}

function BackgroundImages() {
  return (
    <div className="absolute contents left-[348px] top-[58px]" data-name="BACKGROUND IMAGES">
      <div className="absolute h-[47px] left-[528px] top-[233px] w-[56px]" data-name="image 3">
        <div aria-hidden className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 overflow-hidden">
            <img alt="" className="absolute h-[568.89%] left-[-61.21%] max-w-none top-[-41.11%] w-[717.76%]" src={imgImage3} />
          </div>
          <div className="absolute inset-0 overflow-hidden">
            <img alt="" className="absolute h-[568.89%] left-[-61.21%] max-w-none top-[-41.11%] w-[717.76%]" src={imgImage3} />
          </div>
        </div>
      </div>
      <div className="absolute left-[1352px] size-[78px] top-[606px]" data-name="image 4">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <img alt="" className="absolute h-[396.9%] left-[-11.2%] max-w-none top-[-170.93%] w-[593.05%]" src={imgImage3} />
        </div>
      </div>
      <div className="absolute flex h-[120.177px] items-center justify-center left-[1178.46px] top-[645.41px] w-[113.09px]">
        <div className="flex-none rotate-[29.71deg]">
          <div className="h-[95px] relative w-[76px]" data-name="image 6">
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <img alt="" className="absolute h-[825.81%] left-[-236.36%] max-w-none top-[-557.26%] w-[1551.52%]" src={imgImage3} />
            </div>
          </div>
        </div>
      </div>
      <div className="absolute flex h-[196.422px] items-center justify-center left-[1183px] top-[151px] w-[217.287px]">
        <div className="flex-none rotate-[-144.08deg]">
          <div className="h-[101.371px] relative w-[194.876px]" data-name="image 7">
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <img alt="" className="absolute h-[882.76%] left-[-230.94%] max-w-none top-[-563.79%] w-[688.79%]" src={imgImage3} />
            </div>
          </div>
        </div>
      </div>
      <div className="absolute flex h-[183.613px] items-center justify-center left-[494px] top-[549px] w-[226.206px]">
        <div className="flex-none rotate-[-14.31deg]">
          <div className="h-[139px] relative w-[198px]" data-name="image 10">
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <img alt="" className="absolute h-[736.69%] left-[-370.71%] max-w-none top-[-267.63%] w-[775.76%]" src={imgImage3} />
            </div>
          </div>
        </div>
      </div>
      <div className="absolute flex h-[111.003px] items-center justify-center left-[1318px] top-[438.87px] w-[76.025px]">
        <div className="flex-none rotate-[-14.31deg]">
          <div className="h-[101.124px] relative w-[52.672px]" data-name="image 11">
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <img alt="" className="absolute h-[736.69%] left-[-1187.29%] max-w-none top-[-267.63%] w-[2121.54%]" src={imgImage3} />
            </div>
          </div>
        </div>
      </div>
      <div className="absolute flex h-[125.661px] items-center justify-center left-[623px] top-[717px] w-[127.396px]">
        <div className="flex-none rotate-[62.86deg]">
          <div className="h-[96px] relative w-[92px]" data-name="image 5">
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <img alt="" className="absolute h-[393.7%] left-[-421.49%] max-w-none top-[-283.61%] w-[616.23%]" src={imgImage3} />
            </div>
          </div>
        </div>
      </div>
      <div className="absolute flex h-[90.777px] items-center justify-center left-[490px] top-[427px] w-[113.209px]">
        <div className="-scale-y-100 flex-none rotate-[-114.11deg]">
          <div className="h-[99.436px] relative w-[54.952px]" data-name="image 8">
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <img alt="" className="absolute h-[384.96%] left-[-576.19%] max-w-none top-[-284.96%] w-[1044.9%]" src={imgImage3} />
            </div>
          </div>
        </div>
      </div>
      <div className="absolute flex h-[63.685px] items-center justify-center left-[357.54px] top-[58px] w-[52.673px]">
        <div className="-scale-y-100 flex-none rotate-[-114.11deg]">
          <div className="h-[33.114px] relative w-[54.952px]" data-name="image 14">
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <img alt="" className="absolute h-[1155.97%] left-[-576.19%] max-w-none top-[-855.69%] w-[1044.9%]" src={imgImage3} />
            </div>
          </div>
        </div>
      </div>
      <div className="absolute flex h-[199.776px] items-center justify-center left-[603px] top-[124px] w-[164.794px]">
        <div className="flex-none rotate-[29.91deg]">
          <div className="h-[181px] relative w-[86px]" data-name="image 9">
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <img alt="" className="absolute h-[334.64%] left-[-826.9%] max-w-none top-[-15.36%] w-[1059.31%]" src={imgImage3} />
            </div>
          </div>
        </div>
      </div>
      <div className="absolute flex h-[87.755px] items-center justify-center left-[449px] top-[755px] w-[92.826px]">
        <div className="flex-none rotate-[-73.19deg]">
          <div className="h-[76.233px] relative w-[68.642px]" data-name="image 13">
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <img alt="" className="absolute h-[667.9%] left-[-870.87%] max-w-none top-[-130.24%] w-[1115.65%]" src={imgImage3} />
            </div>
          </div>
        </div>
      </div>
      <div className="absolute flex h-[118.067px] items-center justify-center left-[348px] top-[231px] w-[147.372px]">
        <div className="flex-none rotate-[24.8deg]">
          <div className="h-[70px] relative w-[130px]" data-name="image 11">
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <img alt="" className="absolute h-[898.25%] left-[-243.13%] max-w-none top-[-579.82%] w-[727.96%]" src={imgImage3} />
            </div>
          </div>
        </div>
      </div>
      <div className="absolute flex h-[83.765px] items-center justify-center left-[1320px] top-[382px] w-[84.453px]">
        <div className="flex-none rotate-[137.17deg]">
          <div className="h-[53.076px] relative w-[65.957px]" data-name="image 12">
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <img alt="" className="absolute h-[898.25%] left-[-363.34%] max-w-none top-[-579.82%] w-[1087.9%]" src={imgImage3} />
            </div>
          </div>
        </div>
      </div>
      <div className="absolute h-[743px] left-[557px] top-[144px] w-[883px]" data-name="BOQUET">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <img alt="" className="absolute h-[290.17%] left-[-49.49%] max-w-none top-[-11.17%] w-[305.1%]" src={imgBoquet} />
        </div>
      </div>
    </div>
  );
}

function Design() {
  return (
    <div className="absolute contents left-[66px] top-[304px]" data-name="DESIGN">
      <p className="[word-break:break-word] absolute font-['Roboto:Regular',sans-serif] font-normal leading-[normal] left-[93px] text-[24px] text-white top-[310px] whitespace-nowrap" style={{ fontVariationSettings: '"wdth" 100' }}>
        HANDMADE WITH LOVE.
      </p>
      <div className="absolute bg-[#d9d9d9] h-[39px] left-[66px] opacity-40 rounded-[100px] shadow-[0px_6px_50px_4px_rgba(253,108,108,0.25)] top-[304px] w-[322px]" data-name="DESIGN" />
    </div>
  );
}

function ShopNowButton() {
  return (
    <a className="absolute contents cursor-pointer left-[82px] top-[738px]" data-name="SHOP NOW BUTTON">
      <div className="absolute bg-[#d17ea5] h-[65px] left-[82px] rounded-[100px] shadow-[0px_4px_50px_0px_rgba(212,70,70,0.25)] top-[738px] w-[320px]" data-name="SHOP NOW BUTTON" />
      <p className="[word-break:break-word] absolute font-['Roboto:Medium',sans-serif] font-medium leading-[normal] left-[182px] text-[26px] text-black top-[756px] whitespace-nowrap" style={{ fontVariationSettings: '"wdth" 100' }}>
        Shop Now
      </p>
    </a>
  );
}

function AccountButton() {
  return (
    <div className="absolute left-[1331px] size-[50px] top-[36px]" data-name="ACCOUNT BUTTON">
      <svg className="absolute block inset-0 size-full" fill="none" height="50" preserveAspectRatio="none" viewBox="0 0 50 50" width="50">
        <g id="ACCOUNT BUTTON">
          <path d={svgPaths.p4974270} fill="#E6E6E6" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function SearchButton() {
  return (
    <div className="absolute left-[1271px] size-[35px] top-[43px]" data-name="SEARCH BUTTON">
      <svg className="absolute block inset-0 size-full" fill="none" height="35" preserveAspectRatio="none" viewBox="0 0 35 35" width="35">
        <g id="SEARCH BUTTON">
          <path d={svgPaths.p375df640} id="Vector" stroke="#E6E6E6" strokeLinecap="round" strokeWidth="4" />
        </g>
      </svg>
    </div>
  );
}

function ShopButton() {
  return (
    <a className="absolute contents cursor-pointer left-[557px] top-[32px]" data-name="SHOP BUTTON">
      <div className="absolute bg-[rgba(217,217,217,0)] h-[58px] left-[557px] rounded-[20px] top-[32px] w-[124px]" />
      <p className="[word-break:break-word] absolute font-['Roboto:Regular',sans-serif] font-normal leading-[normal] left-[593px] text-[26px] text-white top-[43px] whitespace-nowrap" style={{ fontVariationSettings: '"wdth" 100' }}>
        Shop
      </p>
    </a>
  );
}

function HomeButon() {
  return (
    <div className="absolute contents left-[404px] top-[32px]" data-name="HOME BUTON">
      <div className="absolute bg-[rgba(217,217,217,0)] h-[58px] left-[404px] rounded-[20px] top-[32px] w-[124px]" />
      <p className="[word-break:break-word] absolute font-['Roboto:Bold',sans-serif] font-bold leading-[normal] left-[429px] text-[#df9ebf] text-[26px] top-[43px] whitespace-nowrap" style={{ fontVariationSettings: '"wdth" 100' }}>
        Home
      </p>
    </div>
  );
}

export default function HomePage() {
  return (
    <div className="relative size-full" style={{ backgroundImage: "url(\"data:image/svg+xml;utf8,<svg viewBox='0 0 1440 2614' xmlns='http://www.w3.org/2000/svg' preserveAspectRatio='none'><g transform='matrix(53.8 0.000014128 -0.000039302 632.41 987 1385.1)' opacity='0.5'><rect height='39.144' width='249.31' fill='url(%23grad)' id='quad' shape-rendering='crispEdges'/><use href='%23quad' transform='scale(1 -1)'/><use href='%23quad' transform='scale(-1 1)'/><use href='%23quad' transform='scale(-1 -1)'/></g><defs><linearGradient id='grad' gradientUnits='userSpaceOnUse' x2='5' y2='5'><stop stop-color='rgba(76,46,38,1)' offset='0'/><stop stop-color='rgba(47,30,27,1)' offset='0.4462'/><stop stop-color='rgba(18,14,15,1)' offset='1'/></linearGradient></defs></svg>\"), linear-gradient(90deg, rgb(18, 14, 14) 0%, rgb(18, 14, 14) 100%)" }} data-name="HOME PAGE">
      <p className="[word-break:break-word] absolute font-['Roboto:Light',sans-serif] font-light leading-[normal] left-[590px] text-[20px] text-white top-[2588px] whitespace-nowrap" style={{ fontVariationSettings: '"wdth" 100' }}>
        © 2026 Yuri’s Craft. All rights reserved.
      </p>
      <SocialsPanelSection />
      <DeliveryPanelSection />
      <GalleryPanelSection />
      <BackgroundImages />
      <Design />
      <div className="[word-break:break-word] absolute font-['Roboto:Regular',sans-serif] font-normal leading-[0] left-[68px] text-[23px] text-white top-[596px] whitespace-nowrap" style={{ fontVariationSettings: '"wdth" 100' }}>
        <p className="leading-[normal] mb-0 whitespace-pre">{`Unique  and Affordable Fuzzy  wire `}</p>
        <p className="leading-[normal] mb-0 whitespace-pre">crafts and bouquets that speak from</p>
        <p className="leading-[normal] whitespace-pre">the heart.</p>
      </div>
      <div className="[word-break:break-word] absolute font-['Crimson_Text:Regular',sans-serif] leading-[0] left-[70px] not-italic text-[64px] text-white top-[343px] whitespace-nowrap">
        <p className="leading-[normal] mb-0">Crafted with</p>
        <p className="font-['Crimson_Text:Bold',sans-serif] leading-[normal] mb-0 text-[#df9ebf]">Creativity,</p>
        <p className="leading-[normal]">Made For You.</p>
      </div>
      <ShopNowButton />
      <AccountButton />
      <SearchButton />
      <div className="absolute h-0 left-[422px] top-[75px] w-[87px]" data-name="ACTIVE PAGE LINE">
        <div className="absolute inset-[-0.5px_0]">
          <svg className="block size-full" fill="none" height="1" preserveAspectRatio="none" viewBox="0 0 87 1" width="87">
            <path d="M0 0.5H87" id="ACTIVE PAGE LINE" stroke="white" />
          </svg>
        </div>
      </div>
      <ShopButton />
      <HomeButon />
      <div className="absolute h-[72px] left-[31px] top-[22px] w-[202px]" data-name="LOGO">
        <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgLogo} />
      </div>
    </div>
  );
}