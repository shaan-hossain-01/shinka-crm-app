import { createUser } from "./models/user.model";

async function seed() {
  console.log("🌱 Seeding database...");

  try {
    // Create test user 1
    const user1 = await createUser({
      name: "Test User",
      email: "test@example.com",
      password: "password123",
    });
    console.log("✅ Created user 1:", user1.email);

    // Create test user 2
    const user2 = await createUser({
      name: "Jane Doe",
      email: "jane@example.com",
      password: "password123",
    });
    console.log("✅ Created user 2:", user2.email);

    console.log("✅ Database seeded successfully!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    process.exit(1);
  }
}

seed();
