export function Header() {
  return (
    <header className="app-header">
      <div className="max-w-xl mx-auto px-4 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="header-logo w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0">
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <h1 className="header-title text-sm font-bold tracking-wide">DeployChecker</h1>
            <p className="header-subtitle text-[10px] tracking-widest uppercase">Site Monitor</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="header-dot-ring animate-ping absolute inline-flex h-full w-full rounded-full opacity-60" />
            <span className="header-dot-core relative inline-flex rounded-full h-2 w-2" />
          </span>
          <span className="header-online text-xs">Online</span>
        </div>
      </div>
    </header>
  )
}
