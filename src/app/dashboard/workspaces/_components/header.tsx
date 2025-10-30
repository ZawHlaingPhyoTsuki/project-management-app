import AddWorkspace from "./add-workspace";

export default function Header() {
  return (
    <header className="flex h-(--header-height) shrink-0 items-center justify-between gap-2 border-b px-1.5 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height) lg:px-3.5">
      <div className="flex items-center gap-1 lg:gap-2"></div>
      <div className="flex items-center gap-2">
        <AddWorkspace />
      </div>
    </header>
  );
}
