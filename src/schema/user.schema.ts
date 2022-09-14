import { object, string, TypeOf } from "zod";

export const createUserSchema = object({
  body: object({
    name: string({
      required_error: "Name is required",
    }),
    password: string({
      required_error: "Password is required",
    }).min(6, "Passwords too short. It must be atleast 6 characters."),
    passwordConfirmation: string({
      required_error: "Password Confirm is required",
    }),
    email: string({
      required_error: "Email is required",
    }).email("Not a valid email address"),
  }).refine((data) => data.password === data.passwordConfirmation, {
    message: "Password does not match",
    path: ["passwordConfirmation"],
  }),
});

export type CreateUserInput = Omit<
  TypeOf<typeof createUserSchema>,
  "body.passwordConfirmation"
>;
