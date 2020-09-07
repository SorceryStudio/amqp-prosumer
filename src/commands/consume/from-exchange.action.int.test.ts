import * as amqp from "amqplib";
import { actionConsumeExchange } from "./from-exchange.action";
import { Command } from "commander";
import { ConsumeCallback, ConsumeResult } from "../../utils/amqp-adapter";

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

    const onMessage: ConsumeCallback = async (msg) => {
      expect(msg.content.toString()).toEqual("test-message");
      // Make sure that you got everything before you shut down
      await ch.waitForConfirms();
      await ch.close();
      await conn.close();
      done();
      await shutdown(); // It's not the case

      return ConsumeResult.ACK;
    };

    const shutdown = await actionConsumeExchange(
      "test-exchange",
      (cmd as unknown) as Command,
      onMessage
    );

    ch.publish("test-exchange", "", Buffer.from("test-message"));
  });
});
