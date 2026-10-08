import { useEffect } from "react";
import { Outlet, Link, useLocation } from "react-router-dom";
import { ChevronRight } from "lucide-react";

export function AppLayout() {
  const location = useLocation();
  const trail = location.pathname.endsWith("/new")
    ? "Добавить источник"
    : location.pathname.endsWith("/edit")
      ? "Редактирование"
      : location.pathname !== "/sources"
        ? "Карточка источника"
        : null;
  useEffect(() => {
    window.scrollTo(0, 0);
    const timer = setTimeout(
      () =>
        document
          .querySelector<HTMLElement>("h1")
          ?.focus({ preventScroll: true }),
      80,
    );
    return () => clearTimeout(timer);
  }, [location.pathname]);

  return (
    <div className="app-shell">
      <a href="#main-content" className="skip-link">
        Перейти к содержимому
      </a>
      <div className="main-shell">
        <header className="topbar">
          <div className="breadcrumbs">
            <span className="breadcrumb-root">Рабочее пространство</span>
            <ChevronRight className="breadcrumb-root" size={14} />
            <Link to="/sources">Источники видео</Link>
            {trail && (
              <>
                <ChevronRight size={14} />
                <span className="breadcrumb-current">{trail}</span>
              </>
            )}
          </div>
         
        </header>
        <main id="main-content">
          <Outlet />
        </main>
        <footer className="app-footer">
          
         
        </footer>
      </div>
    </div>
  );
}
