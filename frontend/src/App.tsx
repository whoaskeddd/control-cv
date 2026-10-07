import { Navigate, Route, Routes, Link } from "react-router-dom";
import { AppLayout } from "./layouts/AppLayout";
import { SourcesPage } from "./pages/SourcesPage";
import { SourceDetailPage } from "./pages/SourceDetailPage";
import { SourceFormPage } from "./pages/SourceFormPage";

export function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route index element={<Navigate to="/sources" replace />} />
        <Route path="sources" element={<SourcesPage />} />
        <Route path="sources/new" element={<SourceFormPage />} />
        <Route path="sources/:id" element={<SourceDetailPage />} />
        <Route path="sources/:id/edit" element={<SourceFormPage edit />} />
        <Route
          path="*"
          element={
            <div className="empty-state">
              <span className="eyebrow">404</span>
              <h1>Страница не найдена</h1>
              <p>Проверьте адрес или вернитесь к источникам.</p>
              <Link className="button primary" to="/sources">
                Все источники
              </Link>
            </div>
          }
        />
      </Route>
    </Routes>
  );
}
