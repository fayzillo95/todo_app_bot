import { OnModuleInit } from "@nestjs/common";
import { Injectable } from "@nestjs/common";
import { Bot, BotError, Context } from "grammy";
import { checkDate, getTodoButtos, getTodoMessage } from "./utils/functions";
import { InternalMessage, TaskMap, TypeState } from "./utils/helper.types"
import { UserService } from "./user.service";
import { StatusTask } from "@prisma/client";

@Injectable()
export class BotService implements OnModuleInit {
  private bot: Bot
  private userTasks: TaskMap
  private userState: TypeState
  constructor(
    private readonly userService: UserService
  ) { }

  async onModuleInit() {
    this.userTasks = new Map()
    this.userState = new Map()
    const BOT_TOKEN = process.env.BOT_TOKEN || ""
    console.log(BOT_TOKEN)
    this.bot = new Bot(BOT_TOKEN)

    this.bot.command("start", async (ctx: Context) => {
      await this.userService.createNewUser(ctx)
      await ctx.reply("Asslomu alaykum botimizga hush kelibsiz")
    })
    this.bot.command("tasks", async (ctx: Context) => {
      this.userService.findTodos(ctx)
    })
    this.bot.command("add", (ctx: Context) => {
      try {
        const userId = ctx.from?.id
        if (this.userTasks.get(userId!)) {
          this.setReply(ctx)
          return
        }
        ctx.reply("Task nomini kirting !")
        this.userState.set(userId!, { state: 1 })
      } catch (error) {
        ctx.reply(InternalMessage)
      }
    })

    setInterval(() => {
      this.userService.notificationData(this.bot)
      console.log(BOT_TOKEN)
      console.log("[   ____ SET INTERVAL ISHGA TUSHDI ____ ]")
    }, (1000 * 60));
    await this.bot.api.setWebhook("https://todo-app-bot.onrender.com/webhook")
    this.createTask()
    this.controllAction()

    this.bot.catch((error: BotError) => {
      console.log(error)
    })

  }

  async controllAction() {
    this.bot.callbackQuery([/delete/, /belgilash/], async (ctx: Context) => {
      ctx.answerCallbackQuery("Iltimos kutib turing jarayon ketmoqda")
      try {
        const data = ctx.callbackQuery?.data

        if (data?.includes("delete")) {
          const message_id = ctx.message?.message_id
          const chat_id = ctx.chat?.id
          const id = data.split(":")[1]
          await this.userService.deleteTask(id)
          ctx.deleteMessage()
        }

        if (data?.includes("belgilash")) {
          console.log(data)

          const id = parseInt(data!.split(":")[1])
          const task = await this.userService.setStatus(id, { status: StatusTask.COMPLIETED })

          if (!task) return

          ctx.editMessageText(getTodoMessage(task), getTodoButtos(task))
        }

      } catch (error) {
        ctx.reply(InternalMessage)
      }
    })

  }

  async createTask() {
    this.bot.on("message:text", async (ctx: Context) => {
      this.setReply(ctx)
    })
  }
  async setReply(ctx: Context) {
    try {
      const userId: number = ctx.from!.id
      const matn = ctx.message?.text?.trim()
      if (["/start", "/tasks"].includes(matn!)) {
        return
      }
      const userState = this.userState.get(userId)

      if (!userState || !matn || matn.length < 1) return

      const state = userState.state
      const oldData = this.userTasks.get(userId)

      if (state === 1) {
        if (matn.length < 3) {
          ctx.reply("Nomda kamida 3 ta harf bo'lishi kerak !")
          return
        }
        if (matn.length > 50) {
          ctx.reply("Nomning uzunligi maximal 50 ta bo'lishi kerak !")
          return
        }
        this.userTasks.set(userId, { name: matn })
        ctx.reply("Levelni kiriting : [low, medium, high]")
        this.userState.set(userId, { state: 2 })
        return
      }
      if (state === 2) {

        if (['HIGH', "LOW", "MEDIUM"].includes(matn!.toUpperCase().trim())) {
          // @ts-ignore
          oldData.level = matn.trim().toUpperCase()
          //@ts-ignore
          this.userTasks.set(userId, oldData)

          ctx.reply("Vazifa vaqtini kirting : format YYYY.MM.DD HH:MM !")
          this.userState.set(userId, { state: 3 })
        } else {
          ctx.reply("Level hato kiritildi : bulardan birini kiriting  [ low, medium, high ]")
        }
        return
      }
      if (state === 3) {
        let times = 1000
        const chat_id = ctx.chat?.id
        try {
          times = Math.abs(checkDate(matn))
        } catch (error) {
          ctx.reply(error)
          return
        }
        // @ts-ignore
        oldData.startTime = new Date(matn)
        // @ts-ignore
        this.userTasks.set(userId, oldData)
        const result = await this.userService.createTask(ctx, this.userTasks)
        if (result) {
          setTimeout(async () => {
            if (chat_id) {
              try {
                const name = result.name
                const taskId = result.id
                const task = await this.userService.findOneTaskById(Number(taskId))
                if (task) {
                  ctx.reply(`Salom sizning [ ${task.name} ] nomli taskingizning vaqti keldi `)
                }
              } catch (error) {
                console.log(error.message)
              }
            }
          }, times)
          ctx.reply("Task yaratildi")
          this.userTasks.delete(userId)
          this.userState.delete(userId)
        }
        return
      }
    } catch (error) {
      ctx.reply(InternalMessage)
    }
  }
  handleUpdate(update: any) {
    return this.bot.handleUpdate(update);
  }
}
