import { useEffect, useRef, useState } from "react";
import { NavLink, Outlet, Link, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import {
  Camera,
  ChevronRight,
  Layers3,
  Menu,
  PanelLeftClose,
  Plus,
  Radio,
  X,
} from "lucide-react";

export function AppLayout() {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const drawer = useRef<HTMLDialogElement>(null);
  const trail = location.pathname.endsWith("/new")
    ? "Добавить источник"
    : location.pathname.endsWith("/edit")
      ? "Редактирование"
      : location.pathname !== "/sources"
        ? "Карточка источника"
        : null;
  useEffect(() => {
    setMobileOpen(false);
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
  useEffect(() => {
    if (mobileOpen) drawer.current?.showModal();
    else drawer.current?.close();
  }, [mobileOpen]);
  const navigation = (
    <>
      <Link
        to="/sources"
        className="brand"
        aria-label="Control CV — источники видео"
      >
        <span className="brand-symbol">
          <Camera size={22} />
        </span>
        <span className="nav-label">
          control<span className="brand-cv">cv</span>
        </span>
      </Link>
      <div className="workspace">
        <span className="workspace-symbol">
          <Layers3 size={17} />
        </span>
        <span className="nav-label">
          Рабочее пространство<small>Управление камерами</small>
        </span>
      </div>
      <div className="nav-category nav-label">УПРАВЛЕНИЕ</div>
      <nav aria-label="Основная навигация">
        <NavLink
          to="/sources"
          className="nav-item"
          aria-label="Источники видео"
        >
          <Camera size={19} />
          <span className="nav-label">Источники видео</span>
          <span className="nav-indicator" />
        </NavLink>
        <Link
          to="/sources/new"
          className="nav-item nav-add"
          aria-label="Добавить источник"
        >
          <Plus size={19} />
          <span className="nav-label">Добавить источник</span>
        </Link>
      </nav>
      <div className="sidebar-bottom">
        <div className="sidebar-note nav-label">
          <Radio size={23} />
         
        </div>
        <div className="sidebar-version">
          <span className="nav-label">CONTROL CV</span>
        </div>
      </div>
    </>
  );
  return (
    <div className={`app-shell ${collapsed ? "sidebar-collapsed" : ""}`}>
      <a href="#main-content" className="skip-link">
        Перейти к содержимому
      </a>
      <aside className="sidebar">
        {navigation}
        <button
          className="collapse-button icon-button"
          aria-label={collapsed ? "Развернуть меню" : "Свернуть меню"}
          onClick={() => setCollapsed(!collapsed)}
        >
          <PanelLeftClose size={16} />
        </button>
      </aside>
      <dialog
        ref={drawer}
        className="mobile-drawer"
        aria-label="Меню навигации"
        onCancel={() => setMobileOpen(false)}
      >
        <button
          className="drawer-close icon-button"
          aria-label="Закрыть меню"
          onClick={() => setMobileOpen(false)}
        >
          <X size={22} />
        </button>
        {navigation}
      </dialog>
      <div className="main-shell">
        <header className="topbar">
          <div className="breadcrumbs">
            <button
              className="icon-button mobile-menu"
              aria-label="Открыть меню"
              onClick={() => setMobileOpen(true)}
            >
              <Menu size={22} />
            </button>
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
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.16 }}
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </main>
        <footer className="app-footer">
          
         
        </footer>
      </div>
    </div>
  );
}
