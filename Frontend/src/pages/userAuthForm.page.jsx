import React, { useContext } from "react";
import { Link, Navigate } from "react-router-dom";
import InputBox from "../components/input.component";
import googleIcon from "../imgs/google.png";
import AnimationWrapper from "../common/page-animation";
import { Toaster, toast } from "react-hot-toast";
import axios from "axios";
import { storeInSession } from "../common/session";
import { UserContext } from "../App";
import { authWithGoogle } from "../common/firebase";

export default function UserAuthForm({ type }) {
  let { userAuth, setUserAuth } = useContext(UserContext);

  // Ensure userAuth object is defined before accessing its properties
  const access_token = userAuth ? userAuth.access_token : null;

  const userAuthToServer = (serverRoute, formData) => {
    axios
      .post(import.meta.env.VITE_SERVER_DOMAIN + serverRoute, formData)
      .then(({ data }) => {
        storeInSession("user", JSON.stringify(data));
        setUserAuth(data);
      })
      .catch(({ response }) => {
        toast.error(response?.data?.error);
      });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    let serverRoute =
      type == "sign-in" ? "/api/users/signin" : "/api/users/signup";

    const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/; // regex for email
    const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/; // regex for password

    // FormData
    let form = new FormData(formElement);
    let formData = {};

    for (let [key, value] of form.entries()) {
      formData[key] = value;
    }

    let { fullname, email, password } = formData;

    // Form Validitation

    if (fullname) {
      if (fullname.length < 3) {
        return toast.error("Fullname must be at least 3 letters long");
      }
    }
    if (!email.length) {
      return toast.error("Email is required");
    }
    if (!emailRegex.test(email)) {
      return toast.error("Invalid Email Format");
    }
    if (!passwordRegex.test(password)) {
      return toast.error(
        `Password should contain the following : \n1. One uppercase letter \n2. One lowercase letter \n3. One number \n4. Should be between 6 to 20 characters`
      );
    }
    userAuthToServer(serverRoute, formData);
  };

  const handleGoogleAuth = (e) => {
    e.preventDefault();

    authWithGoogle()
      .then((user) => {
        let serverRoute = "/api/users/google-auth";

        let formData = { access_token: user?.accessToken };

        userAuthToServer(serverRoute, formData);
      })
      .catch((err) => {
        toast.error("Unable to login through Google");
        console.log("Error: ", err);
      });
  };

  return access_token ? (
    <Navigate to="/" />
  ) : (
    <AnimationWrapper keyValue={type}>
      <section className="h-cover flex items-center justify-center">
        <Toaster />
        <form
          className="w-[80%] max-w-[400px]"
          id="formElement"
          onSubmit={handleSubmit}
        >
          <h1 className="text-4xl font-gelasio capitalize text-center mb-24">
            {type == "sign-in" ? "Welcome Back" : "Join Us Today"}
          </h1>

          {type !== "sign-in" ? (
            <InputBox
              name="fullname"
              type="text"
              placeholder="Full name"
              icon="fi-rr-user"
            />
          ) : (
            ""
          )}

          <InputBox
            name="email"
            type="email"
            placeholder="Email"
            icon="fi-rr-envelope"
          />

          <InputBox
            name="password"
            type="password"
            placeholder="Password"
            icon="fi-rr-key"
          />

          <button
            className="btn-dark center mt-14"
            type="submit"
            onClick={handleSubmit}
          >
            {type.replace("-", " ")}
          </button>

          <div className="relative w-full flex items-center gap-2 my-10 opacity-10 uppercase text-black font-bold">
            <hr className="w-1/2 border-black" />
            <p>OR</p>
            <hr className="w-1/2 border-black" />
          </div>

          <button
            className="btn-dark flex items-center justify-center gap-4 w-[90%] center"
            onClick={handleGoogleAuth}
          >
            <img src={googleIcon} alt="Google Icon" className="w-5" />
            Continue with Google
          </button>

          {type == "sign-in" ? (
            <p className="mt-6 text-dark-grey text-xl text-center">
              Don't have an account?
              <Link to="/signup" className="underline text-black text-xl ml-1">
                Sign Up
              </Link>
            </p>
          ) : (
            <p className="mt-6 text-dark-grey text-xl text-center">
              Already a member?
              <Link to="/signin" className="underline text-black text-xl ml-1">
                Sign In Here
              </Link>
            </p>
          )}
        </form>
      </section>
    </AnimationWrapper>
  );
}
