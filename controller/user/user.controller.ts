import db from "../../models";
import bcrypt from "bcrypt";
import jsonwebtoken from "jsonwebtoken";
import * as dotenv from "dotenv";
import sendMail from "../../helper/sendMail";
import crypto from "crypto";
import moment from "moment";

dotenv.config({ path: __dirname + "/.env" });

const User = db["User"];
export class UserController {
  static async register(req: any, res: any, next: any) {
    try {
      //Validation for all the required fields
      let { email, firstName, password, lastName, phoneNumber } = req.body;
      if (!(firstName && lastName && email && password)) {
        throw new Error("Please fill all the required fields");
      }
      let existingEmail = await User.findOne({
        where: {
          email: email,
        },
      });

      if (existingEmail) {
        throw new Error("User already exists");
      }

      req.body.password = await bcrypt.hash(password, 10);

      let result = await User.create(req.body);
      // firstName: firstName,
      // lastName: lastName,
      // email: email,
      // password: hasedPassword,
      // phoneNumber:phoneNumber

      res.send(result);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  static async login(req: any, res: any, next: any) {
    try {
      let { email, password } = req.body;

      if (!(email && password)) {
        throw new Error("Please enter email and password");
      }

      let userExists: any = await User.findOne({
        where: {
          email: email,
        },
      });
      if (!userExists) {
        throw new Error("User does not exists");
      }

      let checkPassword = await bcrypt.compare(password, userExists.password);

      let secret: any = process.env.SECRET;

      if (!checkPassword) {
        throw new Error("Incorrect credentials");
      } else {
        let token = jsonwebtoken.sign({ id: userExists.id }, secret, {
          expiresIn: "1h",
        });
        res.send({
          token: token,
          email: userExists.email,
        });
      }
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getUser(req: any, res: any, next: any) {
    res.send(req.user);
  }

  static async updateUser(req: any, res: any, next: any) {
    try {
      let user = await User.update(req.body, {
        where: { id: req.user.dataValues.id },
      });
      if (user) {
        res.status(200).json({
          message: "User Updated Successfully",
        });
      } else {
        throw new Error("User not updated");
      }
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  static async forgotPassword(req: any, res: any, next: any) {
    try {
      let { email } = req.body;

      let user = await User.findOne({
        where: {
          email: email,
        },
      });

      if (!user)
        return res.status(401).json({
          message:
            "The email address " +
            req.body.email +
            " is not associated with any account. Double-check your email address and try again.",
        });

      let resetPasswordToken = crypto.randomBytes(20).toString("hex");
      let resetPasswordExpire = Date.now() + 360000;

      let result = await User.update(
        {
          resetPasswordToken: resetPasswordToken,
          resetPasswordExpire: resetPasswordExpire,
        },
        {
          where: {
            email: email,
          },
        }
      );
      sendMail(email, resetPasswordToken);

      res.send({
        message: "Email has been send",
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  static async resetPassword(req: any, res: any, next: any) {
    try {
      let { token, password, email } = req.body;

      let user = await User.findOne({
        where: {
          email: email,
        },
      });

      let currentDate = moment().format("DD/MM/YYYY H:mm:ss");

      let expiryDate = moment(user.resetPasswordExpire).format(
        "DD/MM/YYYY H:mm:ss"
      );

      let hasedPassword = await bcrypt.hash(password, 12);

      if (token === user.resetPasswordToken && currentDate <= expiryDate) {
        let updatePassword = await User.update(
          {
            password: hasedPassword,
          },
          {
            where: {
              email: email,
            },
          }
        );
        res.status(200).json({
          message: "Your password has been changed please login to continue",
        });
      } else if (expiryDate < currentDate) {
        throw new Error("The token you enter is expired");
      } else {
        throw new Error("Wrong token, Please check the token again");
      }
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
}
