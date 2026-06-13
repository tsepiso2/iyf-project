import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "../Index";
import Register from "../Register";
import NotFound from "../NotFound";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/register" element={<Register />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}
