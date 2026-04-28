import { Router } from "express";
import { getAll, get, getForUser, create, update, remove, seed } from "../models/connections";
import { Connection, DataEnvelope, DataListEnvelope } from "../types";
import { requireAuth } from "../middleware/auth";

const app = Router();

app.get("/", async (req, res) => {
    const { list, count } = await getAll(req.query);
    const response: DataListEnvelope<Connection> = {
        data: list,
        isSuccess: true,
        total: count,
    }
    res.send(response);
})

// This endpoint allows fetching all connections for a specific user, either as the initiator (user_id) or the recipient (friend_id)
.get("/user/:userId", async (req, res) => {
    const { userId } = req.params;
    const list = await getForUser(Number(userId));
    const response: DataListEnvelope<any> = {
        data: list,
        isSuccess: true,
        total: list.length,
    }
    res.send(response);
})

.get("/:id", async (req, res) => {
    const { id } = req.params;
    const response: DataEnvelope<Connection> = {
        data: await get(Number(id)),
        isSuccess: true,
    }
    res.send(response);
})

.post("/", async (req, res) => {
    const newConnection = await create(req.body);
    const response: DataEnvelope<Connection> = {
        data: newConnection,
        isSuccess: true,
    }
    res.send(response);
})

.patch("/:id", async (req, res) => {
    const { id } = req.params;
    const updatedConnection = await update(Number(id), req.body);
    const response: DataEnvelope<Connection> = {
        data: updatedConnection as Connection,
        isSuccess: true,
    }
    res.send(response);
})

.delete("/:id", async (req, res) => {
    const { id } = req.params;
    const removedConnection = await remove(Number(id));
    const response: DataEnvelope<Connection> = {
        data: removedConnection as Connection,
        isSuccess: true,
        message: `Connection between user ${removedConnection.userId} and ${removedConnection.friendId} has been removed.`,
    }
    res.send(response);
})

.post("/seed", requireAuth("admin"), async (_req, res) => {
    const count = await seed();
    const response: DataEnvelope<number | null> = {
        data: count,
        isSuccess: true,
    }
    res.send(response);
})

export default app;