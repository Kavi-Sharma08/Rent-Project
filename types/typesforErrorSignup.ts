export  interface ZodIssue {
  code?: string;
  inclusive?: boolean;
  message: string;
  minimum?: number;
  origin?: string;
  path: string[];
}

export interface IAPIError {
  data: {
    message: string;
    success: boolean;
  };
  status: number;
  
}