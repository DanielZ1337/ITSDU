import { queryClient } from "@/lib/tanstack-client";
import { QueryClientProvider } from "@tanstack/react-query";
import { domAnimation, LazyMotion } from "framer-motion";
import { ThemeProvider } from "next-themes";
import { HelmetProvider } from "react-helmet-async";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <HelmetProvider>
      <ThemeProvider attribute={"class"} enableSystem defaultTheme="dark">
        <QueryClientProvider client={queryClient}>
          {/*<div className={"overflow-x-auto"}>*/}
          <LazyMotion features={domAnimation}>{children}</LazyMotion>
          {/*</div>*/}
        </QueryClientProvider>
      </ThemeProvider>
    </HelmetProvider>
  );
}
