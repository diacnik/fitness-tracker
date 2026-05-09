import { config } from 'dotenv';
config();

import { seed as seedUsers } from "./users";
import { seed as seedActivities } from "./activities";
import { seed as seedConnections } from "./connections";

async function runSeed() {
    try {
        await seedUsers();
        await seedActivities();
        await seedConnections();
        console.log("Seeding complete");
        process.exit(0);
    } catch (err) {
        console.error("Error seeding data:", err);
        process.exit(1);
    }
}

runSeed();