import { PrismaClient } from "@prisma/client";
import { withPulse } from "@prisma/extension-pulse/node";

const prisma = new PrismaClient().$extends(
  withPulse({
    apiKey: process.env.PULSE_API_KEY as string,
  })
);

// async function main() {
//   console.log("ANNE");
//   try {
//     const stream = await prisma.expense.stream({ name: "expense-stream" });

//     if (stream instanceof Error) {
//       console.error(stream);
//       return;
      
//     }
//     for await (const event of stream) {
//       console.log(event);
//     }
//   } catch (error) {
//     console.log(error);
//   }
// }

// main();

export { prisma };
