import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  DownloadIcon,
  Maximize2,
  Minus,
  PanelLeftClose,
  PanelLeftOpen,
  Plus,
  RotateCw,
  ZoomIn,
} from "lucide-react";
import { Document, Page, pdfjs } from "react-pdf";

import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCallback, useEffect, useMemo, useRef, useState, type WheelEvent } from "react";
import { useResizeDetector } from "react-resize-detector";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Loader } from "@/components/ui/loader";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
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
  const containerRef = useRef<HTMLButtonElement>(null);

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
    <button
      type="button"
      className={cn(
        "w-full rounded-lg transition-all duration-200 flex flex-col items-center gap-1.5 p-2 group focus:outline-none focus-visible:ring-2 focus-visible:ring-primary",
        isActive
          ? "bg-primary/10 ring-2 ring-primary shadow-sm"
          : "hover:bg-muted/80",
      )}
      ref={containerRef}
      onClick={onClick}
    >
      <div
        className={cn(
          "overflow-hidden rounded-md shadow-sm transition-all duration-200 border",
          isActive
            ? "border-primary"
            : "border-border group-hover:border-primary/50",
        )}
      >
        {isLoading && (
          <div className="w-full aspect-[1/1.414] bg-muted animate-pulse min-w-[100px]" />
        )}
        {error && (
          <div className="w-full aspect-[1/1.414] bg-destructive/10 flex items-center justify-center text-destructive text-xs min-w-[100px]">
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
      <span
        className={cn(
          "text-xs font-medium tabular-nums transition-colors",
          isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground",
        )}
      >
        {pageNumber}
      </span>
    </button>
  );
}

export default function PdfRenderer({
  url,
  filename,
  externalIsLoading,
}: PdfRendererProps) {
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
  const [fitMode, setFitMode] = useState<"width" | "page" | "custom">("page");

  const ZOOM_STEP = 0.1;
  const MIN_SCALE = 0.1;
  const MAX_SCALE = 5;

  // Track intrinsic page dimensions (before any scaling)
  const [intrinsicPageWidth, setIntrinsicPageWidth] = useState<number | null>(null);
  const [intrinsicPageHeight, setIntrinsicPageHeight] = useState<number | null>(null);

  const [isThumbnailLoading, setIsThumbnailLoading] = useState(true);

  // Use resize detector for the content area
  const { width: rawContentWidth, height: rawContentHeight, ref: contentRef } = useResizeDetector({
    refreshMode: 'debounce',
    refreshRate: 100,
  });
  const { ref: toolbarRef } = useResizeDetector();

  // Stabilize container dimensions to prevent oscillation
  // Only update if the change is significant (more than 20px)
  const [stableContentWidth, setStableContentWidth] = useState<number>(0);
  const [stableContentHeight, setStableContentHeight] = useState<number>(0);

  useEffect(() => {
    if (!rawContentWidth || !rawContentHeight) return;

    const widthDiff = Math.abs(rawContentWidth - stableContentWidth);
    const heightDiff = Math.abs(rawContentHeight - stableContentHeight);

    // Only update if this is initial set or a significant change (e.g., window resize)
    if (stableContentWidth === 0 || stableContentHeight === 0 || widthDiff > 20 || heightDiff > 20) {
      setStableContentWidth(rawContentWidth);
      setStableContentHeight(rawContentHeight);
    }
  }, [rawContentWidth, rawContentHeight, stableContentWidth, stableContentHeight]);

  // Check if rotated 90 or 270 degrees (landscape orientation)
  const isRotated90or270 = rotation % 180 !== 0;

  // Calculate the width to pass to the Page component
  // For fit modes, we add a small buffer to prevent oscillation from scrollbar appearing/disappearing
  const baseWidth = useMemo(() => {
    if (!stableContentWidth || !stableContentHeight) return 400; // fallback

    // For custom zoom, add padding for visual spacing
    // For fit modes, use full container (no buffer needed since overflow is hidden)
    const padding = fitMode === "custom" ? 32 : 0;
    const availableWidth = stableContentWidth - padding;
    const availableHeight = stableContentHeight - padding;

    // If we don't have page dimensions yet, use available width
    if (!intrinsicPageWidth || !intrinsicPageHeight) {
      return Math.min(availableWidth, 800);
    }

    // The page's natural aspect ratio (width/height as rendered without rotation)
    const pageAspectRatio = intrinsicPageWidth / intrinsicPageHeight;

    if (fitMode === "custom") {
      // Custom zoom - use a reference width based on the smaller dimension
      return Math.min(availableWidth, availableHeight, 800);
    }

    if (isRotated90or270) {
      // When using react-pdf's native rotation, the output dimensions are swapped
      // So we need to fit the rotated output into the container
      // 
      // Original page: W x H (aspectRatio = W/H)
      // Rendered at width=w: canvas is w x (w/aspectRatio)  
      // After react-pdf rotation: canvas becomes (w/aspectRatio) x w
      //
      // For fit-to-page: we need (w/aspectRatio) <= availableWidth AND w <= availableHeight
      // For fit-to-width: we need (w/aspectRatio) = availableWidth

      if (fitMode === "width") {
        // Rotated width = w / aspectRatio = availableWidth
        // So: w = availableWidth * aspectRatio
        return availableWidth * pageAspectRatio;
      } else {
        // fitMode === "page"
        // Rotated width: w / aspectRatio <= availableWidth => w <= availableWidth * aspectRatio
        // Rotated height: w <= availableHeight
        const maxWidthFromVisualWidth = availableWidth * pageAspectRatio;
        const maxWidthFromVisualHeight = availableHeight;
        return Math.min(maxWidthFromVisualWidth, maxWidthFromVisualHeight);
      }
    } else {
      // Normal orientation (0° or 180°)
      // Rendered dimensions are w x (w / aspectRatio)
      // Visual dimensions are the same

      if (fitMode === "width") {
        return availableWidth;
      } else {
        // fitMode === "page"
        // We want: w <= availableWidth AND w/aspectRatio <= availableHeight
        const maxWidthFromHeight = availableHeight * pageAspectRatio;
        return Math.min(availableWidth, maxWidthFromHeight);
      }
    }
  }, [stableContentWidth, stableContentHeight, intrinsicPageWidth, intrinsicPageHeight, isRotated90or270, fitMode]);

  // Calculate the actual rendered dimensions
  // When using react-pdf's native rotation, the canvas output is already rotated
  // so we just need to calculate what size it will be
  const renderedDimensions = useMemo(() => {
    const appliedScale = fitMode === "custom" ? scale : 1;

    if (!intrinsicPageWidth || !intrinsicPageHeight) {
      // Fallback to A4 aspect ratio
      const width = baseWidth * appliedScale;
      const height = baseWidth * 1.414 * appliedScale;
      // When rotated 90/270, react-pdf swaps the output dimensions
      if (isRotated90or270) {
        return { width: height, height: width };
      }
      return { width, height };
    }

    const aspectRatio = intrinsicPageWidth / intrinsicPageHeight;
    const baseHeight = baseWidth / aspectRatio;

    // When rotated 90/270, react-pdf outputs a canvas with swapped dimensions
    if (isRotated90or270) {
      // The width prop still controls the base size, but output dimensions swap
      return {
        width: baseHeight * appliedScale,
        height: baseWidth * appliedScale
      };
    }
    return {
      width: baseWidth * appliedScale,
      height: baseHeight * appliedScale
    };
  }, [baseWidth, intrinsicPageWidth, intrinsicPageHeight, isRotated90or270, fitMode, scale]);

  const handleZoomIn = useCallback(() => {
    setFitMode("custom");
    setScale((prev) => Math.min(prev + ZOOM_STEP, MAX_SCALE));
  }, []);

  const handleZoomOut = useCallback(() => {
    setFitMode("custom");
    setScale((prev) => Math.max(prev - ZOOM_STEP, MIN_SCALE));
  }, []);

  const handleFitWidth = useCallback(() => {
    setFitMode("width");
    setScale(1);
  }, []);

  const handleFitPage = useCallback(() => {
    setFitMode("page");
    setScale(1);
  }, []);

  const handleSetScale = useCallback((newScale: number) => {
    setFitMode("custom");
    setScale(newScale);
  }, []);

  // Mouse wheel zoom
  const handleWheel = useCallback((e: WheelEvent<HTMLDivElement>) => {
    if (e.ctrlKey || e.metaKey) {
      e.preventDefault();
      const delta = e.deltaY > 0 ? -ZOOM_STEP : ZOOM_STEP;
      setFitMode("custom");
      setScale((prev) => Math.min(Math.max(prev + delta, MIN_SCALE), MAX_SCALE));
    }
  }, []);

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
          event.preventDefault();
          handlePageIncrease();
        } else if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
          event.preventDefault();
          handlePageDecrease();
        } else if (event.key === "+" || event.key === "=") {
          event.preventDefault();
          handleZoomIn();
        } else if (event.key === "-" || event.key === "_") {
          event.preventDefault();
          handleZoomOut();
        } else if (event.key === "r" || event.key === "R") {
          event.preventDefault();
          setRotation((prev) => prev + 90);
        } else if (event.key === "Home") {
          event.preventDefault();
          setCurrPage(1);
          setValue("page", "1");
        } else if (event.key === "End") {
          event.preventDefault();
          if (numPages) {
            setCurrPage(numPages);
            setValue("page", String(numPages));
          }
        } else if (event.key === "0" && (event.ctrlKey || event.metaKey)) {
          event.preventDefault();
          handleFitPage();
        } else if (event.key === "1" && (event.ctrlKey || event.metaKey)) {
          event.preventDefault();
          handleSetScale(1);
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isPageFocused, currPage, numPages, handleZoomIn, handleZoomOut, setCurrPage, setValue, handleFitPage, handleSetScale]);

  return (
    <TooltipProvider delayDuration={300}>
      <div
        className="flex h-full flex-1 min-w-0 flex-col items-center bg-background rounded-tl-sm border shadow-sm"
        key={url}
        ref={ref}
      >
        <div
          className="flex h-12 w-full items-center justify-between border-b px-2 bg-muted/30"
          ref={toolbarRef}
        >
          {/* Left section: Sidebar toggle and page navigation */}
          <div className="flex items-center gap-1">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() =>
                    updateSettings({
                      CustomPDFSidebarOpened: !CustomPDFSidebarOpened,
                    })
                  }
                >
                  {CustomPDFSidebarOpened ? (
                    <PanelLeftClose className="h-4 w-4" />
                  ) : (
                    <PanelLeftOpen className="h-4 w-4" />
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom">
                {CustomPDFSidebarOpened ? "Hide" : "Show"} thumbnails
              </TooltipContent>
            </Tooltip>

            <div className="h-4 w-px bg-border mx-1" />

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  disabled={currPage <= 1}
                  onClick={handlePageDecrease}
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  aria-label="Previous page"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom">
                Previous page <kbd className="ml-1 text-[10px] opacity-60">←</kbd>
              </TooltipContent>
            </Tooltip>

            <div className="flex items-center gap-1.5">
              <Input
                {...register("page")}
                className={cn(
                  "w-12 h-7 text-center text-sm tabular-nums",
                  errors.page && "focus-visible:ring-destructive border-destructive",
                )}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleSubmit(handlePageSubmit)();
                  }
                }}
              />
              <span className="text-sm text-muted-foreground">/</span>
              <span className="text-sm text-muted-foreground tabular-nums min-w-[2ch]">
                {numPages ?? "–"}
              </span>
            </div>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  disabled={numPages === undefined || currPage === numPages}
                  onClick={handlePageIncrease}
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  aria-label="Next page"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom">
                Next page <kbd className="ml-1 text-[10px] opacity-60">→</kbd>
              </TooltipContent>
            </Tooltip>
          </div>

          {/* Right section: Zoom, rotate, download, fullscreen */}
          <div className="flex items-center gap-1">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  onClick={handleFitPage}
                  variant={fitMode === "page" ? "secondary" : "ghost"}
                  size="icon"
                  className="h-8 w-8"
                  aria-label="Fit to page"
                >
                  <Maximize2 className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom">
                Fit to page <kbd className="ml-1 text-[10px] opacity-60">Ctrl+0</kbd>
              </TooltipContent>
            </Tooltip>

            <div className="h-4 w-px bg-border mx-0.5" />

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  onClick={handleZoomOut}
                  disabled={fitMode !== "custom" || scale <= MIN_SCALE}
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  aria-label="Zoom out"
                >
                  <Minus className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom">
                Zoom out <kbd className="ml-1 text-[10px] opacity-60">-</kbd>
              </TooltipContent>
            </Tooltip>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  className="gap-1 group px-2 h-8 min-w-[5.5rem] tabular-nums"
                  aria-label="Zoom level"
                  variant="ghost"
                >
                  <ZoomIn className="h-3.5 w-3.5" />
                  {fitMode === "page" ? "Fit" : fitMode === "width" ? "Width" : `${Math.round(scale * 100)}%`}
                  <ChevronDown className="group-data-[state=open]:rotate-180 h-3 w-3 opacity-50 transition-transform" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="center">
                <DropdownScaleList
                  setScale={(val) => {
                    if (val === -1) {
                      handleFitPage();
                    } else if (val === -2) {
                      handleFitWidth();
                    } else {
                      handleSetScale(val);
                    }
                  }}
                  scales={[0.5, 0.75, 1, 1.25, 1.5, 2, 3]}
                  currentScale={scale}
                  fitMode={fitMode}
                />
              </DropdownMenuContent>
            </DropdownMenu>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  onClick={handleZoomIn}
                  disabled={fitMode !== "custom" || scale >= MAX_SCALE}
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  aria-label="Zoom in"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom">
                Zoom in <kbd className="ml-1 text-[10px] opacity-60">+</kbd>
              </TooltipContent>
            </Tooltip>

            <div className="h-4 w-px bg-border mx-1" />

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  onClick={() => setRotation((prev) => prev + 90)}
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 relative"
                  aria-label="Rotate 90 degrees"
                >
                  <RotateCw className="h-4 w-4" />
                  {rotation !== 0 && (
                    <span className="absolute -top-0.5 -right-0.5 text-[9px] font-medium text-primary bg-primary/10 rounded px-0.5">
                      {rotation % 360}°
                    </span>
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom">
                Rotate <kbd className="ml-1 text-[10px] opacity-60">R</kbd>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button asChild variant="ghost" size="icon" className="h-8 w-8">
                  <a
                    href={url}
                    download={filename || "document.pdf"}
                    aria-label="Download PDF"
                  >
                    <DownloadIcon className="h-4 w-4" />
                  </a>
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom">Download PDF</TooltipContent>
            </Tooltip>

            <PdfFullscreen fileUrl={url} />
            <AISidepanelButton />
          </div>
        </div>

        <div
          className="h-full w-full flex-1 flex overflow-hidden"
          onClick={handleFocus}
          tabIndex={0}
          role="application"
          aria-label="PDF viewer"
        >
          {/* Thumbnail Sidebar */}
          <div
            data-open={CustomPDFSidebarOpened}
            className={cn(
              "shrink-0 overflow-hidden transition-all duration-300 ease-in-out border-r bg-muted/20",
              CustomPDFSidebarOpened ? "w-48 p-1" : "w-0 p-0 border-r-0",
            )}
          >
            <div className="h-full overflow-y-auto overflow-x-hidden scrollbar-thin p-2">
              <Document
                file={url}
                className={cn(
                  "flex flex-col gap-1",
                  isThumbnailLoading && "hidden absolute",
                )}
                onLoadSuccess={() => setIsThumbnailLoading(false)}
              >
                {Array.from(new Array(numPages), (_, index) => (
                  <Thumbnail
                    key={`thumbnail-${index + 1}`}
                    sidebarOpen={CustomPDFSidebarOpened}
                    pageNumber={index + 1}
                    onClick={() => {
                      setCurrPage(index + 1);
                      setValue("page", String(index + 1));
                    }}
                    isActive={currPage === index + 1}
                  />
                ))}
              </Document>
            </div>
          </div>
          {/* Main PDF Content */}
          <div
            ref={contentRef}
            className={cn(
              "flex-1 bg-neutral-900",
              // Fit to page: no scrollbars (content fits exactly)
              // Fit to width: vertical scroll only (page may be taller than container)
              // Custom zoom: both scrollbars as needed
              fitMode === "page" ? "overflow-hidden" :
                fitMode === "width" ? "overflow-y-auto overflow-x-hidden" :
                  "overflow-auto"
            )}
            onWheel={handleWheel}
          >
            {externalIsLoading ? (
              <div className="flex h-full w-full items-center justify-center">
                <Loader size="sm" />
              </div>
            ) : (
              <Document
                loading={
                  <div className="flex h-full w-full items-center justify-center">
                    <Loader size="sm" />
                  </div>
                }
                onLoadError={() => {
                  toast.error("Failed to load PDF", {
                    description: "Please try again later",
                  });
                }}
                onLoadSuccess={({ numPages }) => setNumPages(numPages)}
                file={url}
                className="inline-block"
              >
                {/* Wrapper for centering content within scroll area */}
                <div
                  className="flex items-center justify-center"
                  style={{
                    // Fit to page: exact container size (no overflow)
                    // Fit to width: exact width, min-height for vertical scroll
                    // Custom: min sizes so content can grow and scroll both ways
                    width: fitMode === "page" ? stableContentWidth || '100%' :
                      fitMode === "width" ? stableContentWidth || '100%' : undefined,
                    height: fitMode === "page" ? stableContentHeight || '100%' : undefined,
                    minWidth: fitMode === "custom" ? stableContentWidth || '100%' : undefined,
                    minHeight: fitMode !== "page" ? stableContentHeight || '100%' : undefined,
                    // Add padding for custom zoom mode
                    padding: fitMode === "custom" ? 16 : 0,
                  }}
                >
                  {/* Page wrapper with shadow for custom zoom */}
                  <div className={cn(
                    "bg-white overflow-hidden shrink-0 transition-all duration-200",
                    fitMode === "custom" && "rounded-sm shadow-lg"
                  )}>
                    <Page
                      className="block [&.react-pdf__Page]:!bg-transparent [&>canvas]:block"
                      width={baseWidth}
                      pageNumber={currPage}
                      scale={fitMode === "custom" ? scale : 1}
                      rotate={rotation}
                      key={`page-${currPage}-${baseWidth}-${rotation}`}
                      canvasBackground="white"
                      loading={
                        <div
                          className="flex items-center justify-center bg-white"
                          style={{
                            width: renderedDimensions.width,
                            height: renderedDimensions.height,
                          }}
                        >
                          <Loader size="sm" />
                        </div>
                      }
                      onRenderSuccess={(page) => {
                        // Store the intrinsic dimensions (at scale 1, no rotation)
                        setIntrinsicPageWidth(page.originalWidth || page.width);
                        setIntrinsicPageHeight(page.originalHeight || page.height);
                      }}
                    />
                  </div>
                </div>
              </Document>
            )}
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}

function DropdownScaleList({
  setScale,
  scales,
  currentScale,
  fitMode,
}: {
  setScale: (scale: number) => void;
  scales: number[];
  currentScale: number;
  fitMode: "width" | "page" | "custom";
}) {
  return (
    <>
      <DropdownMenuItem
        onSelect={() => setScale(-1)} // -1 signals fit to page
        className={cn(
          fitMode === "page" && "bg-accent font-medium"
        )}
      >
        Fit to page
      </DropdownMenuItem>
      <DropdownMenuItem
        onSelect={() => setScale(-2)} // -2 signals fit to width
        className={cn(
          fitMode === "width" && "bg-accent font-medium"
        )}
      >
        Fit to width
      </DropdownMenuItem>
      <div className="my-1 h-px bg-border" />
      {scales.map((scale) => (
        <DropdownMenuItem
          key={scale}
          onSelect={() => setScale(scale)}
          className={cn(
            "tabular-nums",
            fitMode === "custom" && currentScale === scale && "bg-accent font-medium"
          )}
        >
          {Math.round(scale * 100)}%
        </DropdownMenuItem>
      ))}
    </>
  );
}
