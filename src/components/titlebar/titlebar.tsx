import { useSettings } from "@/hooks/atoms/useSettings";
import { cn } from "@/lib/utils";
import { Maximize2Icon, Minimize2Icon } from "lucide-react";
import { BiWindows } from "react-icons/bi";
import { MdMinimize, MdOutlineClose } from "react-icons/md";

export default function TitlebarButtons() {
  const minimize = () => {
    window.app.minimize();
  };

  const maximize = () => {
    window.app.maximize();
  };

  const close = () => {
    window.app.quit();
  };

  const { settings } = useSettings();

  const showCustomTitlebar = settings.CustomTitleBarButtons;

  return (
    <div className="flex items-center justify-center gap-1 rounded-full border px-4 py-2 no-drag">
      {showCustomTitlebar ? (
        <CustomTitlebarButtons
          handleMinimizeClick={minimize}
          handleMaximizeClick={maximize}
          handleCloseClick={close}
        />
      ) : (
        <DefaultWindowButtons
          handleMinimizeClick={minimize}
          handleMaximizeClick={maximize}
          handleCloseClick={close}
        />
      )}
    </div>
  );
}

function CustomTitlebarButtons({
  handleMinimizeClick,
  handleMaximizeClick,
  handleCloseClick,
}: {
  handleMinimizeClick: () => void;
  handleMaximizeClick: () => void;
  handleCloseClick: () => void;
}) {
  return (
    <>
      <TitlebarButton
        className="mr-2 text-yellow-500 hover:bg-yellow-800"
        onClick={handleMinimizeClick}
      >
        <Minimize2Icon className="h-3.5 w-3.5" />
      </TitlebarButton>
      <TitlebarButton
        className="mr-2 text-green-500 hover:bg-green-800"
        onClick={handleMaximizeClick}
      >
        <Maximize2Icon className="h-3.5 w-3.5" />
      </TitlebarButton>
      <TitlebarButton
        className="text-red-500 hover:bg-red-800"
        onClick={handleCloseClick}
      >
        <MdOutlineClose className="h-5 w-5" />
      </TitlebarButton>
    </>
  );
}

function TitlebarButton({
  children,
  onClick,
  className,
}: {
  children: React.ReactNode;
  onClick: () => void;
  className?: string;
}) {
  return (
    <button
      className={cn(
        "w-6 h-6 rounded-full bg-foreground/10 inline-flex items-center justify-center p-0.5 hover:scale-110 transition-all hover:text-white",
        className,
      )}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

function DefaultWindowButtons({
  handleMinimizeClick,
  handleMaximizeClick,
  handleCloseClick,
}: {
  handleMinimizeClick: () => void;
  handleMaximizeClick: () => void;
  handleCloseClick: () => void;
}) {
  return (
    <>
      <button
        className="w-6 h-6 mr-2 flex justify-center items-center focus:outline-none hover:text-foreground/50"
        onClick={handleMinimizeClick}
      >
        <MdMinimize />
      </button>
      <button
        className="w-6 h-6 mr-2 flex justify-center items-center focus:outline-none hover:text-foreground/50"
        onClick={handleMaximizeClick}
      >
        <BiWindows />
      </button>
      <button
        className="w-6 h-6 flex justify-center items-center focus:outline-none hover:bg-red-800 rounded-full "
        onClick={handleCloseClick}
      >
        <MdOutlineClose className="w-5 h-5 hover:text-white" />
      </button>
    </>
  );
}
