import { Routes, Route } from "react-router-dom";
import NavBar from "./components/navbar.component";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<NavBar />}>
        <Route path="/signup" element={<h1>Sign Up Page</h1>} />
        <Route path="/signin" element={<h1>Sign In Page</h1>} />
      </Route>
    </Routes>
  );
};

export default App;
