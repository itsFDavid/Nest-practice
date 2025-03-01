import 'dotenv/config';
import * as joi from 'joi';

interface EnvVars{
  PORT: number;
  PRODUCTS_MICROSERVICE_PORT: number;
  PRODUCTS_MICROSERVICE_HOST: string;
  ORDERS_MICROSERVICE_PORT: number;
  ORDERS_MICROSERVICE_HOST: string;
  NATS_SERVERS: string[];
}

const envVarsSchema = joi.object({
  PORT: joi.number().required(),
  PRODUCTS_MICROSERVICE_PORT: joi.number().required(),
  PRODUCTS_MICROSERVICE_HOST: joi.string().required(), 
  ORDERS_MICROSERVICE_PORT: joi.number().required(),
  ORDERS_MICROSERVICE_HOST: joi.string().required(),
  NATS_SERVERS: joi.array().items(joi.string()).required(),
})
.unknown(true);

const { error, value } = envVarsSchema.validate({
  PORT: process.env.PORT,
  PRODUCTS_MICROSERVICE_PORT: process.env.PRODUCTS_MICROSERVICE_PORT,
  PRODUCTS_MICROSERVICE_HOST: process.env.PRODUCTS_MICROSERVICE_HOST,
  ORDERS_MICROSERVICE_PORT: process.env.ORDERS_MICROSERVICE_PORT,
  ORDERS_MICROSERVICE_HOST: process.env.ORDERS_MICROSERVICE_HOST,
  NATS_SERVERS: process.env.NATS_SERVERS?.split(','),
});


if (error) throw new Error(`Config validation error: ${error.message}`);
const envVars: EnvVars = value;

export const envs = {
  port: envVars.PORT,
  productsMicroservicePort: envVars.PRODUCTS_MICROSERVICE_PORT,
  productsMicroserviceHost: envVars.PRODUCTS_MICROSERVICE_HOST,
  ordersMicroservicePort: envVars.ORDERS_MICROSERVICE_PORT,
  ordersMicroserviceHost: envVars.ORDERS_MICROSERVICE_HOST,
  natsServers: envVars.NATS_SERVERS,
};