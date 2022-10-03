import { Request, Response } from "express";
import { v4 } from "uuid";
import Token from "../../models/token.model";
import User, { IUserModel } from "../../models/user.model";
import jwt from "jsonwebtoken";
import SendEmail from "../../services/sendEmail";

class Login {
  public static async sendRequest(req: Request, res: Response) {
    try {
      const { email } = req.body;
      const user: IUserModel = await User.findOne({email});
      if (!user) {
        return res.status(404).json({
        success: false,
        message: "user does not exist"
      })
    }
      const hash = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
      const expiredDate = new Date()
      expiredDate.setTime(expiredDate.getTime() + 30 * 60 * 1000);
      await SendEmail.login(email, hash);
      const refreshToken = new Token({
        token: hash,
        user: user._id,
        expiryDate: expiredDate,
      });
      await refreshToken.save();
      return res.status(200).json({
        success: true,
        message: "Check your email for login"
      })
    } catch (err) {
      console.log(err)
      return res.status(500).json({
        success: false,
        message: "Internal Server Error"
      })
    }
  } 

  public static async login(req: Request, res: Response){
    try {
      const { token } = req.body;
      const data = await Token.findOne({token: token});
      if (!data) {
        return res.status(403).json({
          success: false,
          message: "Wrong Link"
        })
      }
      const user = data.user;


      const _token = await jwt.sign(
        {
          _id: user._id,
        },
        process.env.JWT_SECRET,
        {
          expiresIn: 86400, // 1 day
        }
      );
    
      let expiredDate = new Date();
      expiredDate.setTime(expiredDate.getTime() + 30 * 60 * 1000);
    
      let _refreshToken = v4();
      const refreshToken = new Token({
        token: _refreshToken,
        user: user._id,
        expiryDate: expiredDate,
      });
      await data.remove();
      await refreshToken.save();
      
      const dataToSend = {
        accessToken: _token,
        refreshToken: {
          token: refreshToken.token,
          expiryDate: refreshToken.expiryDate,
        },
      };

      return res.status(200).json({
        success: true,
        token: dataToSend
      })
      
    } catch (err) {
      console.log(err)
      return res.status(500).json({
        success: false,
        message: "Internal Server Error"
      })
    }
  }

  public static async renewToken(
    req: Request,
    res: Response
  ): Promise<Response | void> {
    try {
      const { token } = req.body;
      const data = await Token.findOne({ token: token });
      if (!data) {
        return res.status(401).send("Token Does not exist");
      }
      if (data.expiryDate < new Date()) {
        return res.status(401).send("Token expired");
      }
      const user = data.user;
      const _token = jwt.sign(
        {
          id: user,
        },
        process.env.JWT_SECRET,
        {
          expiresIn: 86400, // 1 day
        }
      );
    
      let expiredDate = new Date();
      expiredDate.setTime(expiredDate.getTime() + 30 * 60 * 1000);
    
      let _refreshToken = v4();
      const refreshToken = new Token({
        token: _refreshToken,
        user: user._id,
        expiryDate: expiredDate,
      });
      await data.remove();
      await refreshToken.save();

      const dataToSend = {
        accessToken: _token,
        refreshToken: {
          token: refreshToken.token,
          expiryDate: refreshToken.expiryDate,
        },
      };

      return res.status(200).json({
        success: true,
        token: dataToSend
      })

    } catch (error) {
      return res.status(500).send("Internal server error");
    }
  }

  public static async myprofile (
    req: Request,
    res: Response
  ): Promise<Response | void> {
    try {
      const currentUser = req.user as IUserModel;
      const user = await User.findById(currentUser._id);
      return res.status(200).json({
        user
      })
    } catch (err) {
      console.log(err)
      return res.status(500).json({
        succes: false,
        message: "Internal Error Occured"
      })
    }
  }
}

export default Login;
