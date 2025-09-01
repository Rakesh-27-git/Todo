import { Routes, Route } from "react-router-dom";
import AuthLayout from "./pages/AuthLayout";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Dashboard from "./pages/Dashboard";

function App() {
  return (
    <Routes>
      <Route element={<AuthLayout />}>
        <Route path="sign-in" element={<SignIn />} />
        <Route path="sign-up" element={<SignUp />} />
      </Route>
      <Route path="/" element={<Dashboard />} />
    </Routes>
  );
}

export default App;
