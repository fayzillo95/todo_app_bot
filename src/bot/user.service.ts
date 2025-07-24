import { Injectable } from "@nestjs/common";
import { Bot, Context } from "grammy";
import { PrismaService } from "src/core/prisma/prisma.service";
import { getTodoButtos, getTodoMessage } from "./utils/functions";
import { TaskMap } from "./utils/helper.types";
import { StatusTask } from "@prisma/client";

@Injectable()
export class UserService {
    constructor(
        private readonly prisma: PrismaService
    ) { }

    async createNewUser(ctx: Context) {
        const oldUser = await this.prisma.user.findFirst({
            where: { userId: ctx.from?.id }
        });
        console.log(oldUser)
        if (!oldUser && (ctx.from?.id && ctx.message?.chat.id)) {
            try {
                await this.prisma.user.create({
                    data: {
                        userId: ctx.from?.id,
                        chatId: ctx.message?.chat.id,
                    }
                })
            } catch (error) {

            }
        }
    }
    async findTodos(ctx: Context) {
        const user = await this.prisma.user.findFirst({
            where: { userId: ctx.from?.id }
        })
        const todos = await this.prisma.task.findMany({ where: { userId: user?.id } })
        if (!todos[0]) {
            ctx.reply("Kechirasiz todo listingizda todolar topilmadi ")
            return
        }
        for (let todo of todos) {
            const message = getTodoMessage(todo)
            const butons = getTodoButtos(todo)
            ctx.reply(message, butons)
        }
    }

    async createTask(ctx: Context, data: TaskMap) {
        try {
            const userId = ctx.from?.id
            const taskData = data.get(userId!)
            console.log(taskData, data)
            console.log(userId)
            const user = await this.prisma.user.findFirst({ where: { userId: userId } })
            if (!user) return
            const newTask = await this.prisma.task.create({
                // @ts-ignore
                data: { userId: user.id, ...taskData }
            })
            return newTask
        } catch (error) {
            console.log(error)
            return
        }
    }

    getUser(id: number) {
        return this.prisma.user.findFirst({
            where: {
                userId: id
            }
        })
    }

    async notificationData(bot: Bot) {
        const taskData = await this.prisma.task.findMany({
            select: {
                id: true,
                userId: true,
                startTime: true,
                name: true,
                level: true,
                status: true,
                user: {
                    select: {
                        chatId: true
                    }
                }
            }
        })
        taskData.forEach(async (todo) => {
            if (todo.startTime && todo.user.chatId) {
                const hozir = Date.now()
                const startTime = new Date(todo.startTime).getTime()
                const difirencesTime = startTime - hozir
                if (difirencesTime > 0 && (difirencesTime / 1000) <= (60 * 5) && todo.status !== StatusTask.COMPLIETED) {
                    try {
                        bot.api.sendMessage(Number(todo.user.chatId), "Assalomu alaykum bu test xabar " + ` [ ${todo.name} ] nomli vazifangizga 5 daqiadan kam vaqt qoldi`, {
                            reply_markup: {
                                inline_keyboard: [
                                    [{ text: "delete", callback_data: `delete:${todo.id}` }],
                                    [{ text: "compliete", callback_data: `belgilash:${todo.id}` }]
                                ]
                            }
                        })
                    } catch (error) {
                        console.log(error.message || "Notificationda xatolik !", todo)
                    }
                } else {
                    console.log(todo.user.chatId)
                    try {
                        if (todo.status === StatusTask.PENDING && difirencesTime <= 0) {
                            await this.prisma.task.update({
                                where: { id: todo.id },
                                data: { status: StatusTask.ACTIV }
                            })
                        }
                    } catch (error) {
                        console.log(error.message)
                    }
                }
            }
        })
    }

    async setStatus(id: number, payload: { status: StatusTask }) {
        await this.prisma.task.update({
            where: { id: id },
            data: payload
        })
        const task = await this.prisma.task.findFirst({ where: { id: id } })
        return task
    }

    async deleteTask(id: string) {
        if (!(await this.prisma.task.findFirst({ where: { id: parseInt(id) } }))) return
        const result = await this.prisma.task.delete({ where: { id: parseInt(id) } })
        console.log(result)
        return result
    }

    async findOneTaskById(id: number) {
        const task = await this.prisma.task.findFirst({ where: { id: id } })
        return task
    }
}