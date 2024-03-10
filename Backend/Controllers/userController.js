import "dotenv/config";
import bcrypt from "bcrypt";
import {
  formatDatatoSend,
  generateUsername,
} from "../Services/UserServices.js";
import User from "../Schema/User.js";
import admin from "firebase-admin";
import serviceAccount from "../firebaseConfig.json" assert { type: "json" };
import { getAuth } from "firebase-admin/auth";

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

export const signUp = async (req, res) => {
  const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/; // regex for email
  const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/; // regex for password
  // server.post("/signup", (req, res) => {
  const { fullname, email, password } = req.body;

  if (fullname.length < 3) {
    return res
      .status(403)
      .json({ error: "Fullname must be at least 3 letters long" });
  }
  if (!email.length) {
    return res.status(403).json({ error: "Email is required" });
  }
  if (!emailRegex.test(email)) {
    return res.status(403).json({ error: "Invalid Email Format" });
  }
  if (!passwordRegex.test(password)) {
    return res.status(403).json({
      error: `Password should contain the following : \n1. One uppercase letter \n2. One lowercase letter \n3. One number \n4. Should be between 6 to 20 characters`,
    });
  }

  bcrypt.hash(password, 10, async (err, hashed_password) => {
    let username = await generateUsername(email);
    let user = new User({
      personal_info: { fullname, email, password: hashed_password, username },
    });

    user
      .save()
      .then((u) => {
        return res.status(200).json(formatDatatoSend(u));
      })
      .catch((err) => {
        if (err.code === 11000) {
          return res.status(500).send("Email already in use");
        } else {
          console.log(err);
          return res.status(500).send("Something went wrong!");
        }
      });
  });
};

export const signIn = async (req, res) => {
  const { email, password } = req.body;

  User.findOne({ "personal_info.email": email })
    .then((user) => {
      if (!user) {
        return res.status(403).json({ error: "Email Not Found" });
      }

      if (!user.google_auth) {
        bcrypt.compare(password, user.personal_info.password, (err, result) => {
          if (err) {
            return res
              .status(403)
              .json({ error: "Error Occurred while login please try again" });
          }
          if (!result) {
            return res.status(403).json({ error: "Incorrect Password" });
          } else {
            return res.status(200).json(formatDatatoSend(user));
          }
        });
      } else {
        return res.status(403).json({error: "Account was created using Google. Try logging in with Google."})
      }
    })
    .catch((err) => {
      console.log(err.message);
      return res.status(500).json({ error: err.message });
    });
};

export const googleAuth = async (req, res) => {
  let { access_token } = req.body;
  getAuth()
    .verifyIdToken(access_token)
    .then(async (decodedUser) => {
      let { email, name } = decodedUser;

      let user = await User.findOne({ "personal-info.email": email })
        .select(
          "personal-info.fullname personal-info.username personal-info.profile_img google_auth"
        )
        .then((u) => {
          return u || null;
        })
        .catch((err) => {
          return res.status(500).json({ error: err.message });
        });

      if (user) {
        if (!user.google_auth) {
          return res.status(403).json({
            error:
              "This email was signed up without Google. Please log in with password to access the account",
          });
        }
      } else {
        let username = await generateUsername(email);

        user = new User({
          personal_info: {
            fullname: name,
            email,
            username,
          },
          google_auth: true,
        });

        await user
          .save()
          .then((u) => {
            user = u;
          })
          .catch((err) => {
            return res.status(500).json({ error: err.message });
          });
      }

      return res.status(200).json(formatDatatoSend(user));
    })
    .catch((err) => {
      return res.status(500).json({
        error:
          "Failed to authenticate with Google. Try with another Google account.",
      });
    });
};
