import { Command, program } from "commander";
import { actionConsumeQueue } from "./from-queue.action";
import { reportErrorAndExit } from "../common";

export interface ConsumeFromQueueCommand extends Command {
  uri: string;
  queueName: string;
  assert: boolean;
  exclusive: boolean;
  durable: boolean;
  autoDelete: boolean;
}

export function buildConsumeFromQueueCommand(): ConsumeFromQueueCommand {
  return program
    .command("from-queue <queueName>")
    .option(
      "-u, --uri <uri>",
      "The URL to the RabbitMQ instance",
      "amqp://localhost"
    )
    .option(
      "-a, --assert",
      "Perform assertion of the queue before binding to it",
      false
    )
    .option(
      "-x, --exclusive",
      "Make sure that the queue is going to be 'exclusive' and no other consumer will be able to use it",
      false
    )
    .option(
      "-d, --durable",
      "Mark the resulting queue as 'durable' which will make it survive broker restarts",
      false
    )
    .option(
      "-a, --autoDelete",
      "Mark the resulting queue for automatic delete when if there will be no consumers",
      true
    )
    .action((queueName: string, options: ConsumeFromQueueCommand) => {
      actionConsumeQueue(queueName, options).catch(reportErrorAndExit);
    }) as ConsumeFromQueueCommand;
}
