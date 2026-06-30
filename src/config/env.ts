import 'dotenv/config';
import * as joi from 'joi';

interface IEnvVars {
  PORT: number;
  DATABASE_URL: string;
  NATS_SERVERS: string[];
}

const envVarsSchema: joi.ObjectSchema<IEnvVars> = joi
  .object({
    PORT: joi.number().required(),
    DATABASE_URL: joi.string().required(),
    NATS_SERVERS: joi.array().items(joi.string()).required(),
  })
  .unknown();

const { error, value } = envVarsSchema.validate({
  ...process.env,
  NATS_SERVERS: process.env.NATS_SERVERS?.split(','),
});

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

export const env: IEnvVars = value;

export const envs = {
  port: env.PORT,
  databaseUrl: env.DATABASE_URL,
  natsServers: env.NATS_SERVERS,
};
