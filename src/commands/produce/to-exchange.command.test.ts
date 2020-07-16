import { Command } from "commander";
import { buildProduceToExchangeCommand } from "./to-exchange.command";

describe("Produce To Exchange Command", () => {
  let command: Command;

  beforeEach(() => {
    command = buildProduceToExchangeCommand();
  });

  test("it defines the 'uri' option, default 'amqp://localhost'", () => {
    expect(Object.keys(command.opts())).toContain("uri");
    expect(command.uri).toEqual("amqp://localhost");
  });

  test("it allows to perform an assertion of a exchange", () => {
    expect(Object.keys(command.opts())).toContain("assert");
    expect(command.assert).toEqual(false);
  });

  test("it allows to specify if the exchange is 'durable", () => {
    expect(Object.keys(command.opts())).toContain("durable");
    expect(command.durable).toEqual(false);
  });
});