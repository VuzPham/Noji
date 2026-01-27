import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router";
import SignUpPage from "./pages/SignUpPage";
import ChatAppPage from "./pages/ChatAppPage";
import { Toaster } from "sonner";
import { SignInPage } from "./pages/SignInPage";
function App() {
  return (
    <>
      {/* Sonner Toaster for notifications richColors: success, error, warning, info */}
      <Toaster richColors />
      <BrowserRouter>
        <Routes>
          {/* Public Route */}
          <Route path="/signin" element={<SignInPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          {/* Protectect Route */}
          <Route path="chatapp" element={<ChatAppPage />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
