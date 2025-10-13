import {
  AlignStartHorizontal,
  AudioLines,
  Calendar,
  Rows3,
} from "lucide-react";
import { Button } from "../ui/button";

export default function SecondHeader() {
  return (
    <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-1 px-1.5 lg:gap-2 lg:px-3.5">
        <Button variant="ghost">
          <Rows3 />
          List
        </Button>
        <Button variant="ghost">
          <AlignStartHorizontal />
          Board
        </Button>
        <Button variant="ghost">
          <Calendar />
          Calender
        </Button>
        <Button variant="ghost">
          <AudioLines />
          Analytics
        </Button>
      </div>
    </header>
  );
}
