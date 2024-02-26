import { Routes, Route } from "react-router-dom";
import NavBar from "./components/navbar.component";
import UserAuthForm from "./pages/userAuthForm.page";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<NavBar />}>
        <Route path="/signup" element={<UserAuthForm type="sign-up"/>} />
        <Route path="/signin" element={<UserAuthForm type="sign-in"/>} />
      </Route>
    </Routes>
  );
};

export default App;
