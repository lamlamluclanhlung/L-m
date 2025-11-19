import { Outlet, Route, Routes } from 'react-router-dom';

const Placeholder = ({ label }: { label: string }) => (
  <div className="flex h-screen w-full items-center justify-center bg-slate-100 text-slate-800">
    <div className="rounded-xl bg-white p-10 shadow-xl">
      <p className="text-lg font-semibold">{label}</p>
      <p className="text-sm text-slate-500">More content will arrive in the next steps.</p>
    </div>
  </div>
);

const Layout = () => (
  <div className="min-h-screen bg-slate-50">
    <Outlet />
  </div>
);

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Placeholder label="Dashboard" />} />
        <Route path="*" element={<Placeholder label="Coming soon" />} />
      </Route>
    </Routes>
  );
}

export default App;
