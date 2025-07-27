export interface ICourseEntity {
  id: number;

  // foreign‑key IDs (so you can bind directly in forms)
  teacher_id:  number;
  category_id: number;

  title:          string;
  max_student:   number;   // plural to match your code
  duration_hours: number;
  price:          number;

  registration_start_date: string;
  registration_end_date:   string;
  start_date:              string;
  end_date:                string;

  description: string;
  status:      string;

  created_at: string;
  updated_at: string;

  // nested objects still there if you need them for display
  teacher: {
    id:            number;
    specialization:string;
    experience:    number;
    education:     string;
    created_at:    string;
    updated_at:    string;
  };
  category: {
    id:         number;
    name:       string;
    created_at: string;
    updated_at: string;
  };
}
