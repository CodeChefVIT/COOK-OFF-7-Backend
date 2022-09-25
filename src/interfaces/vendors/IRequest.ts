import { Request } from "express";

type logout = (err?: any) => void;

export interface IRequest extends Request {
  user: any;

  logout: logout;
}
