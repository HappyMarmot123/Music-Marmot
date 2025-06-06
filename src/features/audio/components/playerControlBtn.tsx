export const PlayerControlBtn: React.FC<{
  id: string;
  onClick: () => void;
  ariaLabel: string;
  children: React.ReactNode;
}> = ({ id, onClick, ariaLabel, children }) => {
  return (
    <button
      className="button w-8 h-8 flex group m-auto rounded-[6px] cursor-pointer transition-all duration-200 ease-[ease] bg-[#ffffff] hover:bg-[#b3bac2]"
      id={id}
      onClick={onClick}
      aria-label={ariaLabel}
    >
      {children}
    </button>
  );
};
