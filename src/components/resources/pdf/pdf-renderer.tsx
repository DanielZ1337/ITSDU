import {
  ChevronDown,
  ChevronUp,
  DownloadIcon,
  RotateCw,
  Search,
  Sidebar,
} from "lucide-react";
import { Document, Page, pdfjs } from "react-pdf";
import { AnimatePresence, m } from "framer-motion";

import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useResizeDetector } from "react-resize-detector";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Loader } from "@/components/ui/loader";
import { useAISidepanel } from "@/hooks/atoms/useAISidepanel";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useCustomPDFContext } from "../../../hooks/useCustomPDF";
import AISidepanelButton from "../../ai-chat/ai-sidepanel-button";
import PdfFullscreen from "./pdf-fullscreen";
import useResizeObserver from "use-resize-observer";
import { useSettings } from "@/hooks/atoms/useSettings";

// import SimpleBar from 'simplebar-react'
// import PdfFullscreen from './PdfFullscreen'

pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

interface PdfRendererProps {
  url?: string;
  filename?: string;
  externalIsLoading?: boolean;
  aiSidepanelWidth: number;
  containerWidth?: number | null;
  containerHeight?: number | null;
}

export function Thumbnail({
  pageNumber,
  onClick,
  isActive,
  sidebarOpen,
}: {
  pageNumber: number;
  onClick: () => void;
  isActive: boolean;
  sidebarOpen: boolean;
}) {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [width, setWidth] = useState<number>(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useResizeObserver({
    ref: containerRef,
    onResize: (entry) => {
      setWidth(entry.width || 0);
    },
  });

  useEffect(() => {
    if (isActive) {
      setTimeout(() => {
        containerRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }, 100);
    }
  }, [isActive]);

  useEffect(() => {
    if (sidebarOpen && isActive) {
      setTimeout(() => {
        containerRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }, 500);
    }
  }, [sidebarOpen]);

  return (
    <div
      className={cn(
        "w-full m-auto hover:bg-muted rounded-md transition-all flex flex-col gap-2",
        isActive ? "bg-primary p-2" : "p-0",
      )}
      ref={containerRef}
    >
      <div
        className="overflow-hidden cursor-pointer rounded-md"
        onClick={onClick}
      >
        {isLoading && (
          <div className="w-[100px] h-[141px] bg-gray-200 animate-pulse" />
        )}
        {error && (
          <div className="w-full h-[141px] bg-red-100 flex items-center justify-center text-red-500 text-xs">
            Error
          </div>
        )}
        <Page
          pageNumber={pageNumber}
          width={width}
          renderTextLayer={false}
          renderAnnotationLayer={false}
          onLoadSuccess={() => setIsLoading(false)}
          onLoadError={setError}
          loading=""
        />
      </div>
    </div>
  );
}

export default function PdfRenderer({
  url,
  filename,
  externalIsLoading,
  aiSidepanelWidth,
  containerWidth,
  containerHeight,
}: PdfRendererProps) {
  const { aiSidepanel, toggleSidebar } = useAISidepanel();
  const {
    currPage,
    numPages,
    setCurrPage,
    setNumPages,
    setValue,
    register,
    handleSubmit,
    errors,
    handlePageDecrease,
    handlePageIncrease,
    handlePageSubmit,
  } = useCustomPDFContext();
  const { settings, updateSettings } = useSettings();
  const { CustomPDFSidebarOpened } = settings;
  const [scale, setScale] = useState<number>(1);
  const [rotation, setRotation] = useState<number>(0);
  const [renderedScale, setRenderedScale] = useState<number | null>(null);

  const [pageHeight, setPageHeight] = useState<number | null>(null);
  const [pageWidth, setPageWidth] = useState<number | null>(null);
  const [isThumbnailLoading, setIsThumbnailLoading] = useState(true);
  const { height: toolbarHeight, ref: toolbarRef } = useResizeDetector();

  const getWidth = useCallback(() => {
    if (
      pageHeight &&
      pageWidth &&
      containerHeight &&
      containerWidth &&
      toolbarHeight
    ) {
      const ratio = pageWidth / pageHeight;
      const availableHeight = containerHeight - toolbarHeight;
      const availableWidth = containerWidth - aiSidepanelWidth;
      const availableRatio = availableWidth / availableHeight;

      if (ratio > availableRatio) {
        return availableWidth;
      } else {
        return Math.floor(Math.min(availableHeight) * Math.min(ratio)) - 1;
      }
    } else {
      if (containerHeight && containerWidth && toolbarHeight) {
        const availableHeight = containerHeight - toolbarHeight;
        const availableWidth = containerWidth - aiSidepanelWidth;
        return Math.floor(Math.min(availableHeight, availableWidth)) - 1;
      } else {
        return null;
      }
    }
  }, [
    pageHeight,
    pageWidth,
    containerHeight,
    containerWidth,
    toolbarHeight,
    aiSidepanelWidth,
    aiSidepanel,
  ]);

  const width = useMemo(
    () => getWidth(),
    [
      pageHeight,
      pageWidth,
      containerHeight,
      containerWidth,
      toolbarHeight,
      aiSidepanelWidth,
      aiSidepanel,
    ],
  );

  const isLoading = renderedScale !== scale;

  const ref = useRef<HTMLDivElement>(null);

  const [isPageFocused, setIsPageFocused] = useState(false);

  const handleFocus = () => {
    setIsPageFocused(true);
  };

  const handleDocumentClick = (event: MouseEvent) => {
    if (ref.current && !ref.current.contains(event.target as Node)) {
      setIsPageFocused(false);
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleDocumentClick);

    return () => {
      document.removeEventListener("click", handleDocumentClick);
    };
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // check if the ref is focused
      if (isPageFocused) {
        if (event.key === "ArrowRight" || event.key === "ArrowDown") {
          handlePageIncrease();
        } else if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
          handlePageDecrease();
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isPageFocused, currPage, numPages]);

  return (
    <div
      className="flex h-full w-full flex-col items-center shadow bg-background"
      key={url}
      ref={ref}
    >
      <div
        className="flex h-14 w-full items-center justify-between border-b px-2"
        ref={toolbarRef}
      >
        <div className="flex items-center gap-1.5">
          <Button
            variant="ghost"
            size="icon"
            onClick={() =>
              updateSettings({
                CustomPDFSidebarOpened: !CustomPDFSidebarOpened,
              })
            }
          >
            <Sidebar className="h-4 w-4" />
          </Button>
          <Button
            disabled={currPage <= 1}
            onClick={handlePageDecrease}
            variant="ghost"
            size="icon"
            aria-label="previous page"
          >
            <ChevronDown className="h-4 w-4" />
          </Button>

          <div className="flex items-center gap-1.5">
            <Input
              {...register("page")}
              className={cn(
                "w-12 h-8",
                errors.page && "focus-visible:ring-red-500",
              )}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSubmit(handlePageSubmit)();
                }
              }}
            />
            <p className="text-sm text-zinc-700 space-x-1">
              <span>/</span>
              <span>{numPages ?? "x"}</span>
            </p>
          </div>

          <Button
            disabled={numPages === undefined || currPage === numPages}
            onClick={handlePageIncrease}
            variant="ghost"
            size="icon"
            aria-label="next page"
          >
            <ChevronUp className="h-4 w-4" />
          </Button>
        </div>

        <div className="space-x-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                className="gap-1.5 group px-3"
                aria-label="zoom"
                variant="ghost"
              >
                <Search className="h-4 w-4" />
                {scale * 100}%
                <ChevronDown className="group-data-[state=open]:rotate-180 h-3 w-3 opacity-50" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownScaleList
                setScale={setScale}
                scales={[0.5, 0.75, 1, 1.25, 1.5, 2]}
              />
            </DropdownMenuContent>
          </DropdownMenu>

          <Button
            onClick={() => setRotation((prev) => prev + 90)}
            variant="ghost"
            size="icon"
            aria-label="rotate 90 degrees"
          >
            <RotateCw className="h-4 w-4" />
          </Button>
          <Button asChild variant={"ghost"} size="icon">
            <a
              href={url}
              download={filename || "document.pdf"}
              className="flex items-center gap-1.5"
              aria-label="download"
            >
              <DownloadIcon className="h-4 w-4" />
            </a>
          </Button>
          <PdfFullscreen fileUrl={url} />
          <AISidepanelButton />
        </div>
      </div>

      <div
        className="h-full w-full flex-1 flex overflow-hidden"
        onClick={handleFocus}
      >
        <div
          data-open={CustomPDFSidebarOpened}
          className="max-w-52 overflow-x-hidden shrink-0 data-[open=true]:p-4 data-[open=false]:p-0 overflow-y-auto data-[open=true]:w-64 data-[open=false]:w-0 transition-all min-w-0"
        >
          <Document
            file={url}
            className={cn(
              "flex flex-col gap-2",
              isThumbnailLoading && "hidden absolute",
            )}
            onLoadSuccess={() => setIsThumbnailLoading(false)}
          >
            {Array.from(new Array(numPages), (_, index) => (
              <>
                <Thumbnail
                  key={`thumbnail-${index + 1}`}
                  sidebarOpen={CustomPDFSidebarOpened}
                  pageNumber={index + 1}
                  onClick={() => setCurrPage(index + 1)}
                  isActive={currPage === index + 1}
                />
                <span
                  className={cn(
                    index + 1 === currPage ? "text-primary" : "text-foreground",
                    "text-sm text-center transition-all",
                  )}
                >
                  {index + 1}
                </span>
              </>
            ))}
          </Document>
        </div>
        {externalIsLoading ? (
          <div className="flex h-full w-full justify-center">
            <Loader size={"sm"} className="m-auto" />
          </div>
        ) : (
          <Document
            loading={<Loader size={"sm"} className="m-auto" />}
            onLoadError={() => {
              toast.error("Failed to load PDF", {
                description: "Please try again later",
              });
            }}
            onLoadSuccess={({ numPages }) => setNumPages(numPages)}
            file={url}
            className={cn(
              "w-full h-full flex flex-col overflow-auto items-center max-h-full",
              isLoading && "justify-center",
            )}
          >
            {isLoading && renderedScale ? (
              <Page
                width={width ? width : 1}
                pageNumber={currPage}
                scale={scale}
                rotate={rotation}
                key={"@" + renderedScale}
              />
            ) : (
              <Page
                className={cn(isLoading ? "hidden" : "")}
                _className="w-full h-full flex justify-center items-center !bg-background"
                width={width ? width : 1}
                pageNumber={currPage}
                scale={scale}
                rotate={rotation}
                key={"@" + scale}
                loading={
                  <div className="flex justify-center">
                    <Loader size={"sm"} className="my-24" />
                  </div>
                }
                onRenderSuccess={(page) => {
                  setPageHeight(page.height);
                  setPageWidth(page.width);
                  setRenderedScale(scale);
                }}
              />
            )}
          </Document>
        )}
      </div>
    </div>
  );
}

function DropdownScaleList({
  setScale,
  scales,
}: {
  setScale: (scale: number) => void;
  scales: number[];
}) {
  return scales.map((scale) => (
    <DropdownMenuItem key={scale} onSelect={() => setScale(scale)}>
      {scale * 100}%
    </DropdownMenuItem>
  ));
}
