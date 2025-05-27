const LargeDashboardItem = ({ children ,className=""}: { children: React.ReactNode ,className?:string}) => {
  return <div className={`bg-primary-foreground p-6 rounded-lg shadow-lg lg:col-span-2 2xl:col-span-2 ${className}`}>{children}</div>;
};

export default LargeDashboardItem;
