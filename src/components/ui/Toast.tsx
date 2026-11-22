type ToastProps = {
  message: string
  visible: boolean
}

export function Toast({ message, visible }: ToastProps) {
  return (
    <div
      role="status"
      aria-live="polite"
      className={`fixed bottom-6 left-1/2 z-50 flex -translate-x-1/2 items-center gap-2.5 rounded-md border-2 border-brand-sky bg-slate-950 px-4 py-2.5 font-display text-xs font-bold uppercase tracking-wider text-white shadow-[4px_4px_0px_#986900] transition-all duration-200 sm:text-sm ${
        visible
          ? 'translate-y-0 opacity-100'
          : 'pointer-events-none translate-y-3 opacity-0'
      }`}
    >
      <span className="h-2.5 w-2.5 shrink-0 rounded-sm bg-brand-sky" />
      <span>{message}</span>
    </div>
  )
}
