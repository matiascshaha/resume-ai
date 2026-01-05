import { cn } from "@/lib/utils";

interface InputOption {
  id: string;
  label: string;
  icon: React.ReactNode;
}

interface InputOptionBarProps {
  options: InputOption[];
  activeOption: string;
  onOptionChange: (optionId: string) => void;
}

const InputOptionBar = ({ options, activeOption, onOptionChange }: InputOptionBarProps) => {
  return (
    <div className="input-option-bar">
      {options.map((option) => (
        <button
          key={option.id}
          onClick={() => onOptionChange(option.id)}
          className={cn(
            "input-option-tab flex items-center justify-center gap-2",
            activeOption === option.id && "input-option-tab-active"
          )}
        >
          {option.icon}
          <span>{option.label}</span>
        </button>
      ))}
    </div>
  );
};

export default InputOptionBar;
