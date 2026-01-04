import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../prisma/prisma-client";

let prisma: PrismaClient;
interface InvitationData {
  id: string;
  key: string;
  maxGuests?: number;
}

// this list is stored in Google doc and not committed to git due to privacy reasons, copy paste it from there
const invitationData: InvitationData[] = [];

async function run() {
  prisma = new PrismaClient({
    adapter: new PrismaPg({
      connectionString: process.env.DATABASE_URL!,
      ssl: {
        rejectUnauthorized: false
      }
    })
  });

  const created = await prisma.invitation.createManyAndReturn({
    data: invitationData.map(data => ({
      id: data.id,
      key: data.key,
      maxGuests: data.maxGuests ?? 2,
      dateTimeAccepted: null,
    })),
    skipDuplicates: true,
  });
  console.log(`Created the following invitations: ${created.map(c => JSON.stringify(c) + "\n")}`);
}

run()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => {
    async () => await prisma.$disconnect();
  });