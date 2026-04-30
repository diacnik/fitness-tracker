import { Router } from 'express';
import { getAll, get, create, update, remove, seed } from '../models/activities';
import { Activity, DataEnvelope, DataListEnvelope } from '../types';

const app = Router();

app.get("/", async (req, res) => {
    const { list, count } = await getAll(req.query);
    const response: DataListEnvelope<Activity> = {
        data: list,
        isSuccess: true,
        total: count,
    }
    res.json(response);
})

.get("/count", async (req, res) => {
    const { count } = await getAll(req.query);
    const response: DataEnvelope<{ count: number }> = {
        data: { count },
        isSuccess: true,
    }
    res.json(response);
})

.get("/:id", async (req, res) => {
    const { id } = req.params;
    const response: DataEnvelope<Activity> = {
        data: await get(Number(id)),
        isSuccess: true,
    }
    res.json(response);
})

.post("/", async (req, res) => {
    const newItem = await create(req.body);
    const response: DataEnvelope<Activity> = {
        data: newItem,
        isSuccess: true,
    }
    res.json(response);
})

.patch("/:id", async (req, res) => {
    const { id } = req.params;
    const updatedItem = await update(Number(id), req.body);
    const response: DataEnvelope<Activity> = {
        data: updatedItem,
        isSuccess: true,
    }
    res.json(response);
})

.delete("/:id", async (req, res) => {
    const { id } = req.params;
    const removedItem = await remove(Number(id));
    const response: DataEnvelope<Activity> = {
        data: removedItem,
        isSuccess: true,
        message: `Activity ${removedItem.category} has been removed.`, // activities only have categories and descriptions, not names
    }
    res.json(response);
})

.post("/seed", async (_req, res) => {
    await seed();
    const response: DataEnvelope<null> = {
        data: null,
        isSuccess: true,
        message: "Activities have been seeded.",
    }
    res.json(response);
})

export default app;