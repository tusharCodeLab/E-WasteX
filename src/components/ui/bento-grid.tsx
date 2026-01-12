import { cn } from "@/lib/utils";

export const BentoGrid = ({
  className,
  children,
}: {
  className?: string;
  children?: React.ReactNode;
}) => {
  return (
    <div
      className={cn(
        "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto auto-rows-fr",
        className
      )}
    >
      {children}
    </div>
  );
};

export const BentoGridItem = ({
  className,
  title,
  description,
  header,
  icon,
}: {
  className?: string;
  title?: string | React.ReactNode;
  description?: string | React.ReactNode;
  header?: React.ReactNode;
  icon?: React.ReactNode;
}) => {
  return (
    <div
      className={cn(
        "row-span-1 rounded-3xl group/bento hover:shadow-2xl transition duration-500 shadow-input dark:shadow-none p-6 dark:bg-zinc-900/50 dark:border-zinc-800 bg-white border border-zinc-100 flex flex-col justify-between space-y-4",
        className
      )}
    >
      <div className="flex flex-col flex-1">
        {header}
        <div className="group-hover/bento:translate-x-2 transition duration-200">
          <div className="flex items-center gap-2 mb-2">
            {icon}
            <div className="font-sans font-bold text-neutral-600 dark:text-neutral-200">
              {title}
            </div>
          </div>
          <div className="font-sans font-normal text-neutral-600 text-xs dark:text-neutral-300 leading-relaxed">
            {description}
          </div>
        </div>
      </div>
    </div>

  );
};
