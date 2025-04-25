export interface User {
  auth_id: string;
  number: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: string;
  dept: string;
  instructor_office: string;
  instructor_rank: string;
}

export interface RawUser {
  auth_id: string;
  student_num?: string;
  instructor_id?: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  role: string;
  dept: string;
  instructor_office: string;
  instructor_rank: string;
}
