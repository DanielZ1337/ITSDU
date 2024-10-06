import { AnimatePresence, m } from "framer-motion";
import { StarHalfIcon, StarIcon } from "lucide-react";
import { useState } from "react";

export default function AllStarredCoursesButton() {
  const [starred] = useState<boolean>(true);

  return (
    <button>
      <AnimatePresence>
        {starred && (
          <m.span
            layoutId={"starred"}
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 100 }}
            transition={{ duration: 0.2 }}
            className={"absolute flex flex-row gap-2 items-center justify-center"}
          >
            <StarIcon
              className={"stroke-secondary-500 fill-secondary-500 shrink-0 m-1 h-6 w-6"}
            />
            <span>Starred</span>
          </m.span>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {!starred && (
          <m.span
            layoutId={"all"}
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 100 }}
            transition={{ duration: 0.2 }}
            className={"absolute flex flex-row gap-2 items-center justify-center"}
          >
            <span className={"relative h-6 w-6 shrink-0 ml-1"}>
              <StarHalfIcon
                className={"absolute stroke-secondary-500 fill-secondary-500 h-6 w-6"}
              />
              <StarIcon className={"absolute stroke-secondary-500 h-6 w-6"} />
            </span>
            <span>All</span>
          </m.span>
        )}
      </AnimatePresence>
    </button>
  );
}
