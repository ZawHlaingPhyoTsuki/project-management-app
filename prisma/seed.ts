import prisma from "../src/lib/db";

export const seed = async () => {
    await prisma.user.create({
      data: {
        name: "John Doe",
        email: "john.doe@example.com",
        image: "https://github.com/shadcn.png",
      },
    });
};

