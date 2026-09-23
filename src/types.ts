
export interface ITask {
  id: string;       
  title: string;     
  createdAt: number; 
  state:ColumnType
}


export type ColumnType = 'todo' | 'in-progress' | 'done';



