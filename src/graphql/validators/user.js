import Joi from "@hapi/joi";
const name = Joi.string().max(255).required().label("Name");
const email = Joi.string().email().required().label("Email");
const username = Joi.string().max(255).min(6).required().label("Username");
const password = Joi.string()
  .max(30)
  .min(8)
  .required()
  .regex(/^(?=\s*[a-z])(?=s\*[A-Z])(?=\s*\d).*$/)
  .label("Password").messages({
      "string.regex":  "Must  have  atleast one lowercase letter, one uppercase letter and one digit"
  })
export const loginValidate = Joi.object({
    username,
    password
});
export const regesterValidate = Joi.object({
    name,
    email,                                                                                                      
    username,
    password
})