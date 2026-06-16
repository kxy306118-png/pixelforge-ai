export function AdBanner() {
  return (
    <div className="ad-slot h-[90px] rounded-2xl w-full">广告位</div>
  );
}

export function AdSidebar() {
  return (
    <div className="hidden lg:block">
      <div className="ad-slot h-[250px] rounded-2xl sticky top-20">广告位</div>
    </div>
  );
}

export function AdInline() {
  return (
    <div className="ad-slot h-[60px] rounded-xl w-full my-4">广告位</div>
  );
}
