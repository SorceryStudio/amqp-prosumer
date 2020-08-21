import * as amqp from "amqplib";
import { actionConsumeExchange, ConsumerFn } from "./from-exchange.action";
import { Command } from "commander";

jest.unmock("amqplib");

describe("Consume From Exchange Action Integration Tests", () => {
  test("integration it consumes a message which is sent to the exchange and writes it as a new line to STDIO", async (done) => {
    const cmd = {
      assert: true,
      autoDelete: true,
      durable: false,
      exclusive: false,
      uri: "amqp://localhost",
    };

    const conn = await amqp.connect("amqp://localhost");
    const ch = await conn.createConfirmChannel();

    const onMessage: ConsumerFn = async (msg) => {
      expect(msg.content.toString()).toEqual("test-message");
      await stopConsume();
      await ch.close();
      await conn.close();
      done();
    };

    const stopConsume = await actionConsumeExchange(
      "test-exchange",
      (cmd as unknown) as Command,
      onMessage
    );

    ch.publish("test-exchange", "", Buffer.from("test-message"));

    await ch.waitForConfirms();
  });
});