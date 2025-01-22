import { TODO_FILTERS } from "../consts/consts"

export interface Todo {
    uuid: string,
    content: string,
    id_group: number | null,
    completed: boolean,
    created_at: string,
}

export interface Group {
    id: number,
    group_name: string,
    created_at: string,
}

export type TodoId = Pick<Todo, 'uuid'>
export type TodoContent = Pick<Todo, 'content'>
export type TodoCompleted = Pick<Todo, 'completed'>

export type FilterValue= typeof TODO_FILTERS[keyof typeof TODO_FILTERS]