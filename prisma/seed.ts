import { faker } from "@faker-js/faker";
import {
  InvitationStatus,
  PrismaClient,
  ResourceType,
  Role,
} from "./generated/client";

const prisma = new PrismaClient();

// Available tag colors from your constants
const TAG_COLORS = [
  "blue",
  "red",
  "green",
  "yellow",
  "purple",
  "pink",
] as const;

async function main() {
  console.log("🌱 Starting seed...");

  // Clear existing data
  await prisma.$transaction([
    prisma.taskCardTag.deleteMany(),
    prisma.tag.deleteMany(),
    prisma.taskCard.deleteMany(),
    prisma.taskList.deleteMany(),
    prisma.boardMember.deleteMany(),
    prisma.board.deleteMany(),
    prisma.invitation.deleteMany(),
    prisma.shareableLink.deleteMany(),
    prisma.workspaceMember.deleteMany(),
    prisma.workspace.deleteMany(),
    prisma.verification.deleteMany(),
    prisma.session.deleteMany(),
    prisma.account.deleteMany(),
    prisma.user.deleteMany(),
  ]);

  console.log("🧹 Cleared existing data");

  // Create users in batch
  const userData = Array.from({ length: 10 }, (_, i) => ({
    id: faker.string.uuid(),
    name: faker.person.fullName(),
    email: i === 0 ? "admin@example.com" : faker.internet.email(),
    emailVerified: faker.datatype.boolean(0.8),
    image: faker.image.avatar(),
    createdAt: faker.date.past({ years: 1 }),
    updatedAt: faker.date.recent({ days: 30 }),
  }));

  await prisma.user.createMany({ data: userData });
  const users = await prisma.user.findMany();
  console.log(`👥 Created ${users.length} users`);

  const adminUser = users[0];

  // Create workspaces in batch
  const workspaceData = Array.from({ length: 5 }, () => ({
    id: faker.string.uuid(),
    name: `${faker.company.name()} Workspace`,
    description: faker.datatype.boolean(0.7)
      ? faker.company.catchPhrase()
      : null,
    isArchived: faker.datatype.boolean(0.1),
    archivedAt: faker.datatype.boolean(0.1)
      ? faker.date.recent({ days: 60 })
      : null,
    createdAt: faker.date.past({ years: 1 }),
    updatedAt: faker.date.recent({ days: 30 }),
    createdById: adminUser.id,
  }));

  await prisma.workspace.createMany({ data: workspaceData });
  const workspaces = await prisma.workspace.findMany();
  console.log(`🏢 Created ${workspaces.length} workspaces`);

  // Create workspace members in batch
  const workspaceMemberData = workspaces.flatMap((workspace) =>
    users.slice(0, faker.number.int({ min: 2, max: 6 })).map((user, index) => ({
      id: faker.string.uuid(),
      role:
        index === 0
          ? Role.OWNER
          : faker.helpers.arrayElement([Role.ADMIN, Role.MEMBER, Role.VIEWER]),
      userId: user.id,
      workspaceId: workspace.id,
    })),
  );

  await prisma.workspaceMember.createMany({ data: workspaceMemberData });
  console.log(`👥 Created ${workspaceMemberData.length} workspace members`);

  // Create tags in batch
  const tagData = workspaces.flatMap((workspace) =>
    Array.from({ length: faker.number.int({ min: 5, max: 15 }) }, () => ({
      id: faker.string.uuid(),
      name: faker.word.adjective() + " " + faker.word.noun(),
      color: faker.helpers.arrayElement(TAG_COLORS),
      description: faker.datatype.boolean(0.4) ? faker.lorem.sentence() : null,
      createdAt: faker.date.past({ years: 1 }),
      updatedAt: faker.date.recent({ days: 30 }),
      workspaceId: workspace.id,
    })),
  );

  await prisma.tag.createMany({ data: tagData });
  const tags = await prisma.tag.findMany();
  console.log(`🏷️  Created ${tags.length} tags`);

  // Create boards in batch
  const boardData = workspaces.flatMap((workspace) =>
    Array.from({ length: faker.number.int({ min: 2, max: 5 }) }, () => ({
      id: faker.string.uuid(),
      name: `${faker.company.buzzVerb()} Board`,
      description: faker.datatype.boolean(0.6) ? faker.lorem.sentence() : null,
      isArchived: faker.datatype.boolean(0.05),
      archivedAt: faker.datatype.boolean(0.05)
        ? faker.date.recent({ days: 30 })
        : null,
      createdAt: faker.date.past({ years: 1 }),
      updatedAt: faker.date.recent({ days: 30 }),
      workspaceId: workspace.id,
      createdById: faker.helpers.arrayElement(users).id,
    })),
  );

  await prisma.board.createMany({ data: boardData });
  const boards = await prisma.board.findMany();
  console.log(`📋 Created ${boards.length} boards`);

  // Create board members in batch
  const boardMemberData = boards.flatMap((board) =>
    users.slice(0, faker.number.int({ min: 1, max: 4 })).map((user) => ({
      id: faker.string.uuid(),
      role: faker.helpers.arrayElement([Role.ADMIN, Role.MEMBER, Role.VIEWER]),
      userId: user.id,
      boardId: board.id,
    })),
  );

  await prisma.boardMember.createMany({ data: boardMemberData });
  console.log(`👥 Created ${boardMemberData.length} board members`);

  // Create task lists in batch
  const taskListData = boards.flatMap((board) =>
    Array.from(
      { length: faker.number.int({ min: 3, max: 6 }) },
      (_, index) => ({
        id: faker.string.uuid(),
        name: faker.helpers.arrayElement([
          "Backlog",
          "To Do",
          "In Progress",
          "Review",
          "Done",
          "Blocked",
        ]),
        position: index,
        isArchived: faker.datatype.boolean(0.02),
        archivedAt: faker.datatype.boolean(0.02)
          ? faker.date.recent({ days: 15 })
          : null,
        createdAt: faker.date.past({ years: 1 }),
        updatedAt: faker.date.recent({ days: 30 }),
        boardId: board.id,
      }),
    ),
  );

  await prisma.taskList.createMany({ data: taskListData });
  const taskLists = await prisma.taskList.findMany();
  console.log(`📝 Created ${taskLists.length} task lists`);

  // Create task cards in batch
  const taskCardData = taskLists.flatMap((taskList) =>
    Array.from(
      { length: faker.number.int({ min: 3, max: 8 }) },
      (_, cardIndex) => ({
        id: faker.string.uuid(),
        title: faker.hacker.phrase(),
        description: faker.datatype.boolean(0.8)
          ? faker.lorem.paragraph()
          : null,
        dueDate: faker.datatype.boolean(0.3)
          ? faker.date.future({ years: 1 })
          : null,
        position: cardIndex,
        isArchived: faker.datatype.boolean(0.03),
        archivedAt: faker.datatype.boolean(0.03)
          ? faker.date.recent({ days: 10 })
          : null,
        createdAt: faker.date.past({ years: 1 }),
        updatedAt: faker.date.recent({ days: 30 }),
        taskListId: taskList.id,
        assigneeId: faker.datatype.boolean(0.7)
          ? faker.helpers.arrayElement(users).id
          : null,
      }),
    ),
  );

  await prisma.taskCard.createMany({ data: taskCardData });
  const taskCards = await prisma.taskCard.findMany();
  console.log(`📄 Created ${taskCards.length} task cards`);

  // Create task card tags in batch
  const taskCardTagData = taskCards.flatMap((taskCard) => {
    const selectedTags = faker.helpers.arrayElements(
      tags,
      faker.number.int({ min: 0, max: 3 }),
    );
    return selectedTags.map((tag) => ({
      id: faker.string.uuid(),
      taskCardId: taskCard.id,
      tagId: tag.id,
      createdAt: faker.date.recent({ days: 10 }),
    }));
  });

  await prisma.taskCardTag.createMany({ data: taskCardTagData });
  console.log(`🔖 Created ${taskCardTagData.length} task card tags`);

  // Create shareable links in batch
  const shareableLinkData = workspaces.flatMap((workspace) =>
    Array.from({ length: 2 }, () => ({
      id: faker.string.uuid(),
      token: faker.string.alphanumeric(20),
      resourceType: ResourceType.WORKSPACE,
      role: faker.helpers.arrayElement([Role.VIEWER, Role.MEMBER]),
      expiresAt: faker.datatype.boolean(0.5)
        ? faker.date.future({ years: 1 })
        : null,
      maxUses: faker.datatype.boolean(0.3)
        ? faker.number.int({ min: 1, max: 10 })
        : null,
      useCount: faker.number.int({ min: 0, max: 5 }),
      isActive: faker.datatype.boolean(0.9),
      createdAt: faker.date.past({ years: 1 }),
      updatedAt: faker.date.recent({ days: 30 }),
      createdById: adminUser.id,
      workspaceId: workspace.id,
    })),
  );

  await prisma.shareableLink.createMany({ data: shareableLinkData });
  console.log(`🔗 Created ${shareableLinkData.length} shareable links`);

  // Create invitations in batch
  const invitationData = workspaces.flatMap((workspace) =>
    Array.from({ length: faker.number.int({ min: 3, max: 8 }) }, () => ({
      id: faker.string.uuid(),
      token: faker.string.alphanumeric(20),
      email: faker.internet.email(),
      role: faker.helpers.arrayElement([Role.MEMBER, Role.VIEWER]),
      status: faker.helpers.arrayElement([
        InvitationStatus.PENDING,
        InvitationStatus.ACCEPTED,
        InvitationStatus.DECLINED,
        InvitationStatus.EXPIRED,
        InvitationStatus.CANCELLED,
      ]),
      expiresAt: faker.date.future({ years: 1 }),
      createdAt: faker.date.past({ years: 1 }),
      updatedAt: faker.date.recent({ days: 30 }),
      resourceType: ResourceType.WORKSPACE,
      workspaceId: workspace.id,
      invitedById: adminUser.id,
    })),
  );

  await prisma.invitation.createMany({ data: invitationData });
  console.log(`✉️  Created ${invitationData.length} invitations`);

  console.log("✅ Seed completed!");
  console.log(`   👥 ${users.length} users`);
  console.log(`   🏢 ${workspaces.length} workspaces`);
  console.log(`   📋 ${boards.length} boards`);
  console.log(`   📝 ${taskLists.length} task lists`);
  console.log(`   📄 ${taskCards.length} task cards`);
  console.log(`   🏷️  ${tags.length} tags`);
  console.log(`   🔖 ${taskCardTagData.length} task card tags`);
  console.log(`   🔗 ${shareableLinkData.length} shareable links`);
  console.log(`   ✉️  ${invitationData.length} invitations`);
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:");
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
