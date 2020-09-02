import { Command } from "commander";
import { debug } from "debug";
import fs from "fs";
import {
  ConsumeCallback,
  ConsumeResult,
  connectToBroker,
  createChannel,
  declareQueue,
  consume,
  cancelConsumer,
  closeChannel,
  disconnectFromBroker,
  declareExchange,
  bindQueueAndExchange,
} from "../../utils/amqp-adapter";
import { registerShutdownHandler, RegisterShutdownHandlerFn } from "../common";

const log = debug("amqp-prosumer:consumer");

export const defOnMessage: ConsumeCallback = async (msg) => {
  const write = msg.content.toString("utf-8");

  log("Consuming message", write);

  fs.writeFileSync(1, write + "\n");

  return ConsumeResult.ACK;
};

export async function actionConsumeExchange(
  exchangeName: string,
  command: Command,
  onMessage: ConsumeCallback = defOnMessage,
  regShutdown: RegisterShutdownHandlerFn = registerShutdownHandler
): Promise<void> {
  log("Staring the consumer for exchange", exchangeName);

  const qOpts = {
    autoDelete: true,
    durable: false,
    exclusive: true,
  };

  const exOpts = {
    durable: command.durable,
    autoDelete: command.autoDelete,
  };

  connectToBroker(command.uri)
    .then(createChannel)
    .then(declareQueue("", qOpts, true))
    .then(declareExchange(exchangeName, "topic", exOpts, command.assert))
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    .then(bindQueueAndExchange("#"))
    .then(consume(onMessage))
    .then((context) => {
      const shutdown = async (): Promise<void> => {
        cancelConsumer(context)
          .then(closeChannel)
          .then(disconnectFromBroker)
          .catch((err) => console.error("Error during shutdown", err));
      };
      regShutdown(shutdown);
      return context;
    })
    .catch((err) => console.error(err));
}
