import 'dotenv/config';
import * as joi from 'joi';

interface IEnvVars {
  PORT: number;
}

const envVarsSchema: joi.ObjectSchema<IEnvVars> = joi
  .object({
    PORT: joi.number().required(),
  })
  .unknown();

const { error, value } = envVarsSchema.validate(process.env);

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

export const env: IEnvVars = value;

export const envs = {
  port: env.PORT,
};
