import "../styles/global.css";
import { BrowserRouter, Routes, Route } from "react-router";
import ChatAppPage from "../pages/ChatAppPage";
import { Toaster } from "sonner";
import SignupPage from "@/pages/signup-page";
import SigninPage from "@/pages/signin-page";

function App() {
  return (
    <>
      {/* Sonner Toaster for notifications richColors: success, error, warning, info */}
      <Toaster richColors />
      <BrowserRouter>
        <Routes>
          {/* Public Routes with shared layout */}
          <Route>
            <Route path="/signin" element={<SigninPage />} />
            <Route path="/signup" element={<SignupPage />} />
          </Route>

          {/* Protected Route (no layout or own layout later) */}
          <Route path="/chatapp" element={<ChatAppPage />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
