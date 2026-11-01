export type Role = 'super_admin' | 'assistant';

export interface User {
  id: string;
  name: string;
  nim: string;
  role: Role;
  avatar?: string;
}

export type Difficulty = 'easy' | 'medium' | 'hard';
export type CaseStatus = 'draft' | 'published' | 'archived';
export type TestType = 'positive' | 'negative' | 'boundary' | 'edge_case' | 'error_handling';
export type ComparisonMode = 'exact' | 'trimmed' | 'normalized';
export type TestCaseVisibility = 'public' | 'hidden';

export interface TestCase {
  id: string;
  problem_case_id: string;
  name: string;
  input: string;
  expected_output: string;
  test_type: TestType;
  comparison_mode: ComparisonMode;
  visibility: TestCaseVisibility;
  weight: number;
  order: number;
}

export interface ReferenceSolution {
  id: string;
  problem_case_id: string;
  language: string;
  code: string;
  is_valid: boolean;
  last_validated_at: string;
}

export interface ProblemCase {
  id: string;
  title: string;
  slug: string;
  synopsis: string;
  description: string;
  instructions: string;
  input_format: string;
  output_format: string;
  example_input: string;
  example_output: string;
  difficulty: Difficulty;
  estimated_duration_minutes: number;
  max_score: number;
  status: CaseStatus;
  test_cases: TestCase[];
  reference_solution?: ReferenceSolution;
  created_at: string;
  updated_at: string;
}

export type SessionStatus = 'draft' | 'scheduled' | 'waiting' | 'running' | 'paused' | 'completed' | 'cancelled';

export interface ExamSession {
  id: string;
  name: string;
  slug: string;
  description?: string;
  exam_date: string;
  start_time: string;
  duration_minutes: number;
  token: string;
  compiler_version: string;
  execution_time_limit: number; // in seconds
  memory_limit_mb: number;
  passing_grade: number;
  status: SessionStatus;
  actual_start_at?: string;
  actual_end_at?: string;
  created_by: string;
  created_at: string;
}

export type ParticipantStatus = 'waiting' | 'in_progress' | 'completed' | 'abandoned';
export type AssignmentStatus = 'pending' | 'active' | 'submitted';
export type TestCaseStatus =
  | 'pass'
  | 'fail'
  | 'compilation_error'
  | 'runtime_error'
  | 'time_limit_exceeded'
  | 'memory_limit_exceeded'
  | 'internal_error';

export interface TestCaseResult {
  id: string;
  test_case_id: string;
  name: string;
  visibility: TestCaseVisibility;
  status: TestCaseStatus;
  is_passed: boolean;
  actual_output: string;
  expected_output?: string;
  error_message?: string;
  execution_time_seconds: number;
  memory_kb: number;
  score_earned: number;
  weight: number;
}

export interface Submission {
  id: string;
  participant_assignment_id: string;
  code: string;
  language_id: number;
  status: 'submitted' | 'auto_submitted' | 'grading';
  score: number;
  passed_test_cases: number;
  total_test_cases: number;
  submitted_at: string;
  test_case_results: TestCaseResult[];
}

export interface ParticipantAssignment {
  id: string;
  participant_id: string;
  problem_case_id: string;
  problem_case?: ProblemCase;
  sequence_number: 1 | 2;
  status: AssignmentStatus;
  score: number;
  max_score: number;
  code_draft: string;
  last_saved_at: string;
  submitted_at?: string;
  submission?: Submission;
}

export interface Participant {
  id: string;
  exam_session_id: string;
  name: string;
  nim: string;
  session_hash: string;
  ip_address: string;
  user_agent: string;
  status: ParticipantStatus;
  started_at?: string;
  finished_at?: string;
  total_score: number;
  is_passed: boolean;
  last_heartbeat: string;
  assignments: ParticipantAssignment[];
}

export interface AuditLog {
  id: string;
  user_name?: string;
  participant_name?: string;
  event: string;
  description: string;
  timestamp: string;
  type: 'info' | 'warning' | 'success' | 'danger';
}

export interface SystemSettings {
  judge0_url: string;
  judge0_api_key: string;
  judge0_host: string;
  judge0_simulate: boolean;
  institution_name: string;
  course_name: string;
  academic_year: string;
  coordinator_name: string;
}
