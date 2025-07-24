
export const InternalMessage = "Kechirasiz kutilmagan xatolik yuz berdi !"

export const enum TaskLevel {
    LOW = 'LOW',
    MEDIUM = 'MEDIUM',
    HIGH = 'HIGH'
}
export const enum StatusTask {
    PENDING = 'PENDING',
    ACTIV = 'ACTIV',
    COMPLIETED = 'COMPLIETED'
}

export const stepCreateTask = ["name", "level", "startTime"];

export interface TaskType {
    userId: number,
    name: string,
    level: TaskLevel,
    status: StatusTask,
    startTime: Date,
}


export type TypeState = Map<number, { state: number }>

export type TaskMap = Map<number, Partial<TaskType>>


