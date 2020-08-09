import { Command } from "commander";
import { CommandFactoryFn } from "../common";
import { buildConsumeFromQueueCommand } from "./from-queue.command";
import { buildConsumeFromExchangeCommand } from "./from-exchange.command";

export function buildConsumeCommand(cmdFactory: CommandFactoryFn): Command {
  const consumeCommand = cmdFactory("consume");

  consumeCommand.addCommand(buildConsumeFromQueueCommand());
  consumeCommand.addCommand(buildConsumeFromExchangeCommand());

  return consumeCommand;
}
