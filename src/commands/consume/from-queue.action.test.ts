import * as amqp from "amqplib";
import { actionConsumeQueue } from "./from-queue.action";
import { ConsumeFromQueueCommand } from "./from-queue.command";

jest.unmock("amqplib");

describe("Consume From Queue Action", () => {
  test("it consumes a message which is sent to the queue", async (done) => {
    const cmd = {
      assert: true,
      autoDelete: true,
      durable: false,
      exclusive: false,
      uri: "amqp://localhost",
    };

    const conn = await amqp.connect("amqp://localhost");
    const ch = await conn.createConfirmChannel();

    const stopConsume = await actionConsumeQueue(
      "test-queue",
      cmd as ConsumeFromQueueCommand,
      async (msg) => {
        expect(msg.content.toString()).toEqual("test-message");
        await stopConsume();
        await ch.close();
        await conn.close();
        done();
      }
    );

    ch.sendToQueue("test-queue", Buffer.from("test-message"));

    await ch.waitForConfirms();
  });
});