const SmallDashboardItem = ({ children ,className=""}: { children: React.ReactNode,className?:string }) => {
  return <div className={`bg-primary-foreground p-4 rounded-lg shadow-md ${className}`}>{children}</div>;
};

export default SmallDashboardItem;
