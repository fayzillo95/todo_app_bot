import { Task } from "@prisma/client";
import { StatusTask } from "./helper.types";

function isKabisa(year : number){
    if(year % 400 > 100){
        return false
    }
    if(year % 4 > 0){
        return false
    } 
    return true
}


export const checkDate = (date : string) => {
    const oyKunlari = new Map<number, number>([[1, 31],  [2, 28], [3, 31],  [4, 30],  [5, 31],  [6, 30],  [7, 31],  [8, 31], [9, 30], [10, 31], [11, 30], [12, 31],]);

    
    if(!/^\d{4}\.(0[1-9]|1[0-2])\.(0[1-9]|[12][0-9]|3[01]) ([01][0-9]|2[0-3]):[0-5][0-9]$/.test(date)){
        throw "Vaqt YYYY.MM.DD HH:MM formatda bo'lishi kerak !"
    }

    let [year, month, day] = date.split(".")
    const [hour,minut] = date.split(" ")[1].split(":")
    const mnt = new Date().getMinutes()
    const hrs = new Date().getHours()
    day = day.split(" ")[0]
    console.log(hour,hrs,minut,mnt)
    console.log(year,month,day)
    
    if(+hour > 24){
        throw `Kechirasiz ${hour} soat mavjud emas`
    }
    if(+minut > 59){
        throw `Kechirasiz ${minut} minut mavjud emas`
    }
    if(+year < new Date().getFullYear()){
        throw "Yil kelajakdagi yil bo'lihi kerak !"
    }
    if(+month > 12){
        throw "Oy 12 da katta bo'lmasligi kerak !"
    }
    if(+month < new Date().getMonth()+1 && +year == new Date().getFullYear()){
        throw "Oy kelajakdagi oy bo'lishi kerak!"
    }
    if(+day < new Date().getDate() && +year == new Date().getFullYear() && +month == new Date().getMonth()+1){
        throw "Kun kelajakdagi kun bo'lishi kerak"
    }
    if(isKabisa(+year)){
        const oyKuni = month == "2" ? oyKunlari.get(+month)! + 1 : oyKunlari.get(+month)!
        if(oyKuni < +day){
            throw "Sana xato kiritilgan " + `${year} - yil ${month} - oy ${day} - kun mavjud emas ${oyKuni} - kun!`
        }
    }else{
        const oyKuni = oyKunlari.get(+month)! 
        if(oyKuni < +day){
            throw "Sana xato kiritilgan " + `${year} -yil ${month} - oy ${day} - kun mavjud emas ${oyKuni} - kun!`
        }
    }

    console.log(Date.now() ,1, new Date(date).getTime())

    if(new Date(date).getTime() < Date.now()){
        throw "Berilgan vaqt kelajakda Bo'lishi kerak !"
    }

    return Date.now() - new Date(date).getTime()
}

export const getTodoMessage = (todo: Task) => {
    const message = `
TodoId : ${todo.id}
Todo : ${todo.name},
Level : ${todo.level}
StartTime : ${todo.startTime}
Status : ${todo.status}
`
    return message
}
export const getTodoButtos = (todo: Task) => {

    const buttons = (todo.status === 'PENDING' || todo.status === StatusTask.ACTIV)? [
        { text: "delete", callback_data: `delete:${todo.id}` },
        { text: "compliete", callback_data: `belgilash:${todo.id}` }
    ] : [{ text: "delete", callback_data: `delete:${todo.id}` }]
    return {
        reply_markup: {
            inline_keyboard: [buttons]
        }
    }
}
