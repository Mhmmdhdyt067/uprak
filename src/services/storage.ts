import {
  AuditLog,
  ExamSession,
  Participant,
  ParticipantAssignment,
  ProblemCase,
  Submission,
  SystemSettings,
  TestCase,
  User,
} from '../types';
import { INITIAL_PROBLEM_CASES } from '../data/seedCases';

const STORAGE_KEYS = {
  USERS: 'pces_users',
  PROBLEM_CASES: 'pces_problem_cases',
  EXAM_SESSIONS: 'pces_exam_sessions',
  PARTICIPANTS: 'pces_participants',
  AUDIT_LOGS: 'pces_audit_logs',
  SETTINGS: 'pces_settings',
  ACTIVE_PARTICIPANT_HASH: 'pces_active_participant_hash',
  CURRENT_ADMIN_USER: 'pces_current_admin_user',
};

export const INITIAL_USERS: User[] = [
  {
    id: 'user-01',
    name: 'Koordinator Praktikum (Super Admin)',
    nim: 'ADMIN01',
    role: 'super_admin',
  },
  {
    id: 'user-02',
    name: 'Asisten Dosen Lab 1',
    nim: 'ASLAB01',
    role: 'assistant',
  },
];

export const INITIAL_SETTINGS: SystemSettings = {
  judge0_url: 'https://judge0-ce.p.rapidapi.com',
  judge0_api_key: '',
  judge0_host: 'judge0-ce.p.rapidapi.com',
  judge0_simulate: true,
  institution_name: 'Fakultas Ilmu Komputer & Rekayasa Perangkat Lunak',
  course_name: 'Algoritma dan Pemrograman (C++)',
  academic_year: 'Tahun Ajaran 2026/2027 Ganjil',
  coordinator_name: 'Dr. Ir. Hendra Prasetyo, S.Kom., M.Cs.',
};

export class StorageService {
  private static getItem<T>(key: string, defaultValue: T): T {
    try {
      const data = localStorage.getItem(key);
      if (!data) return defaultValue;
      return JSON.parse(data) as T;
    } catch {
      return defaultValue;
    }
  }

  private static setItem<T>(key: string, value: T): void {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.error('Storage write error:', e);
    }
  }

  public static initialize(): void {
    if (!localStorage.getItem(STORAGE_KEYS.PROBLEM_CASES)) {
      this.setItem(STORAGE_KEYS.PROBLEM_CASES, INITIAL_PROBLEM_CASES);
    }
    if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
      this.setItem(STORAGE_KEYS.USERS, INITIAL_USERS);
    }
    if (!localStorage.getItem(STORAGE_KEYS.SETTINGS)) {
      this.setItem(STORAGE_KEYS.SETTINGS, INITIAL_SETTINGS);
    }

    if (!localStorage.getItem(STORAGE_KEYS.EXAM_SESSIONS)) {
      const defaultSession: ExamSession = {
        id: 'sess-algo-2026',
        name: 'Ujian Praktikum Algoritma C++ - Shift A',
        slug: 'ujian-praktikum-algoritma-cplusplus-shift-a',
        description: 'Ujian digital praktikum coding C++ semester ganjil. 2 studi kasus wajib diselesaikan dalam 90 menit.',
        exam_date: new Date().toISOString().split('T')[0],
        start_time: '08:30',
        duration_minutes: 90,
        token: 'ALGO26',
        compiler_version: 'C++17 (GCC 9.2.0)',
        execution_time_limit: 2.0,
        memory_limit_mb: 128,
        passing_grade: 65,
        status: 'running',
        actual_start_at: new Date(Date.now() - 25 * 60 * 1000).toISOString(), // started 25 mins ago
        created_by: 'user-01',
        created_at: new Date().toISOString(),
      };
      this.setItem(STORAGE_KEYS.EXAM_SESSIONS, [defaultSession]);

      // Seed sample participants for live monitoring
      const p1Id = 'p-12301';
      const p2Id = 'p-12302';
      const p3Id = 'p-12303';
      const p4Id = 'p-12304';

      const cases = INITIAL_PROBLEM_CASES;

      const sampleParticipants: Participant[] = [
        {
          id: p1Id,
          exam_session_id: defaultSession.id,
          name: 'ANDI PRASETYA',
          nim: '12301',
          session_hash: 'hash-andi-12301',
          ip_address: '192.168.1.101',
          user_agent: 'Chrome 122.0 (macOS)',
          status: 'in_progress',
          started_at: new Date(Date.now() - 24 * 60 * 1000).toISOString(),
          total_score: 50.0,
          is_passed: false,
          last_heartbeat: new Date().toISOString(),
          assignments: [
            {
              id: 'asg-p1-1',
              participant_id: p1Id,
              problem_case_id: cases[0].id,
              problem_case: cases[0],
              sequence_number: 1,
              status: 'submitted',
              score: 50.0,
              max_score: 50.0,
              code_draft: cases[0].reference_solution?.code || '',
              last_saved_at: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
              submitted_at: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
              submission: {
                id: 'sub-p1-1',
                participant_assignment_id: 'asg-p1-1',
                code: cases[0].reference_solution?.code || '',
                language_id: 54,
                status: 'submitted',
                score: 50.0,
                passed_test_cases: 3,
                total_test_cases: 3,
                submitted_at: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
                test_case_results: [],
              },
            },
            {
              id: 'asg-p1-2',
              participant_id: p1Id,
              problem_case_id: cases[1].id,
              problem_case: cases[1],
              sequence_number: 2,
              status: 'active',
              score: 0.0,
              max_score: 50.0,
              code_draft: `#include <iostream>\nusing namespace std;\n\nint main() {\n    // Sedang dikerjakan\n    return 0;\n}`,
              last_saved_at: new Date().toISOString(),
            },
          ],
        },
        {
          id: p2Id,
          exam_session_id: defaultSession.id,
          name: 'BUDI KURNIAWAN',
          nim: '12302',
          session_hash: 'hash-budi-12302',
          ip_address: '192.168.1.102',
          user_agent: 'Firefox 123.0 (Windows 11)',
          status: 'in_progress',
          started_at: new Date(Date.now() - 23 * 60 * 1000).toISOString(),
          total_score: 50.0,
          is_passed: false,
          last_heartbeat: new Date().toISOString(),
          assignments: [
            {
              id: 'asg-p2-1',
              participant_id: p2Id,
              problem_case_id: cases[2].id,
              problem_case: cases[2],
              sequence_number: 1,
              status: 'submitted',
              score: 50.0,
              max_score: 50.0,
              code_draft: cases[2].reference_solution?.code || '',
              last_saved_at: new Date(Date.now() - 8 * 60 * 1000).toISOString(),
              submitted_at: new Date(Date.now() - 8 * 60 * 1000).toISOString(),
            },
            {
              id: 'asg-p2-2',
              participant_id: p2Id,
              problem_case_id: cases[3].id,
              problem_case: cases[3],
              sequence_number: 2,
              status: 'active',
              score: 0.0,
              max_score: 50.0,
              code_draft: `#include <iostream>\n#include <vector>\nusing namespace std;\n\nint main() {\n    int n, q;\n    cin >> n >> q;\n    return 0;\n}`,
              last_saved_at: new Date().toISOString(),
            },
          ],
        },
        {
          id: p3Id,
          exam_session_id: defaultSession.id,
          name: 'CITRA DEWI LESTARI',
          nim: '12303',
          session_hash: 'hash-citra-12303',
          ip_address: '192.168.1.103',
          user_agent: 'Chrome 122.0 (Ubuntu Linux)',
          status: 'completed',
          started_at: new Date(Date.now() - 24 * 60 * 1000).toISOString(),
          finished_at: new Date(Date.now() - 2 * 60 * 1000).toISOString(),
          total_score: 100.0,
          is_passed: true,
          last_heartbeat: new Date().toISOString(),
          assignments: [
            {
              id: 'asg-p3-1',
              participant_id: p3Id,
              problem_case_id: cases[4].id,
              problem_case: cases[4],
              sequence_number: 1,
              status: 'submitted',
              score: 50.0,
              max_score: 50.0,
              code_draft: cases[4].reference_solution?.code || '',
              last_saved_at: new Date(Date.now() - 14 * 60 * 1000).toISOString(),
              submitted_at: new Date(Date.now() - 14 * 60 * 1000).toISOString(),
            },
            {
              id: 'asg-p3-2',
              participant_id: p3Id,
              problem_case_id: cases[5].id,
              problem_case: cases[5],
              sequence_number: 2,
              status: 'submitted',
              score: 50.0,
              max_score: 50.0,
              code_draft: cases[5].reference_solution?.code || '',
              last_saved_at: new Date(Date.now() - 2 * 60 * 1000).toISOString(),
              submitted_at: new Date(Date.now() - 2 * 60 * 1000).toISOString(),
            },
          ],
        },
        {
          id: p4Id,
          exam_session_id: defaultSession.id,
          name: 'DEWA BAGUS RAMADHAN',
          nim: '12304',
          session_hash: 'hash-dewa-12304',
          ip_address: '192.168.1.104',
          user_agent: 'Edge 122.0 (Windows 11)',
          status: 'in_progress',
          started_at: new Date(Date.now() - 20 * 60 * 1000).toISOString(),
          total_score: 30.0,
          is_passed: false,
          last_heartbeat: new Date().toISOString(),
          assignments: [
            {
              id: 'asg-p4-1',
              participant_id: p4Id,
              problem_case_id: cases[6].id,
              problem_case: cases[6],
              sequence_number: 1,
              status: 'submitted',
              score: 30.0,
              max_score: 50.0,
              code_draft: cases[6].reference_solution?.code || '',
              last_saved_at: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
              submitted_at: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
            },
            {
              id: 'asg-p4-2',
              participant_id: p4Id,
              problem_case_id: cases[7].id,
              problem_case: cases[7],
              sequence_number: 2,
              status: 'active',
              score: 0.0,
              max_score: 50.0,
              code_draft: `#include <iostream>\nusing namespace std;\n\nint main() {\n    return 0;\n}`,
              last_saved_at: new Date().toISOString(),
            },
          ],
        },
      ];

      this.setItem(STORAGE_KEYS.PARTICIPANTS, sampleParticipants);
    }

    if (!localStorage.getItem(STORAGE_KEYS.AUDIT_LOGS)) {
      const logs: AuditLog[] = [
        {
          id: 'log-1',
          event: 'SESSION_INITIALIZED',
          description: 'Sesi ujian Shift A dibuat dengan Token ALGO26.',
          timestamp: new Date(Date.now() - 40 * 60 * 1000).toISOString(),
          type: 'info',
        },
        {
          id: 'log-2',
          event: 'EXAM_STARTED',
          description: 'Asisten dosen memulai sesi ujian secara serentak.',
          timestamp: new Date(Date.now() - 25 * 60 * 1000).toISOString(),
          type: 'success',
        },
        {
          id: 'log-3',
          event: 'SUBMISSION_GRADED',
          description: 'Citra Dewi Lestari (12303) menyelesaikan kedua studi kasus dengan nilai sempurna 100/100.',
          timestamp: new Date(Date.now() - 2 * 60 * 1000).toISOString(),
          type: 'success',
        },
      ];
      this.setItem(STORAGE_KEYS.AUDIT_LOGS, logs);
    }
  }

  // --- PROBLEM CASES ---
  public static getProblemCases(): ProblemCase[] {
    return this.getItem<ProblemCase[]>(STORAGE_KEYS.PROBLEM_CASES, INITIAL_PROBLEM_CASES);
  }

  public static getProblemCaseById(id: string): ProblemCase | undefined {
    return this.getProblemCases().find((c) => c.id === id);
  }

  public static saveProblemCase(problemCase: ProblemCase): void {
    const list = this.getProblemCases();
    const index = list.findIndex((c) => c.id === problemCase.id);
    if (index >= 0) {
      list[index] = { ...problemCase, updated_at: new Date().toISOString() };
    } else {
      list.push(problemCase);
    }
    this.setItem(STORAGE_KEYS.PROBLEM_CASES, list);
    this.logAudit('CASE_UPDATED', `Studi kasus '${problemCase.title}' diperbarui.`, 'info');
  }

  public static deleteProblemCase(id: string): void {
    const list = this.getProblemCases().filter((c) => c.id !== id);
    this.setItem(STORAGE_KEYS.PROBLEM_CASES, list);
    this.logAudit('CASE_DELETED', `Studi kasus dengan ID ${id} dihapus.`, 'warning');
  }

  public static saveTestCase(problemCaseId: string, testCase: TestCase): void {
    const list = this.getProblemCases();
    const problem = list.find((c) => c.id === problemCaseId);
    if (!problem) return;

    const tcIndex = problem.test_cases.findIndex((t) => t.id === testCase.id);
    if (tcIndex >= 0) {
      problem.test_cases[tcIndex] = testCase;
    } else {
      problem.test_cases.push(testCase);
    }
    this.setItem(STORAGE_KEYS.PROBLEM_CASES, list);
  }

  public static deleteTestCase(problemCaseId: string, testCaseId: string): void {
    const list = this.getProblemCases();
    const problem = list.find((c) => c.id === problemCaseId);
    if (!problem) return;

    problem.test_cases = problem.test_cases.filter((t) => t.id !== testCaseId);
    this.setItem(STORAGE_KEYS.PROBLEM_CASES, list);
  }

  // --- SESSIONS ---
  public static getExamSessions(): ExamSession[] {
    return this.getItem<ExamSession[]>(STORAGE_KEYS.EXAM_SESSIONS, []);
  }

  public static getSessionByToken(token: string): ExamSession | undefined {
    return this.getExamSessions().find((s) => s.token.toUpperCase() === token.toUpperCase());
  }

  public static getSessionById(id: string): ExamSession | undefined {
    return this.getExamSessions().find((s) => s.id === id);
  }

  public static saveExamSession(session: ExamSession): void {
    const list = this.getExamSessions();
    const idx = list.findIndex((s) => s.id === session.id);
    if (idx >= 0) {
      list[idx] = session;
    } else {
      list.unshift(session);
    }
    this.setItem(STORAGE_KEYS.EXAM_SESSIONS, list);
  }

  public static updateSessionStatus(sessionId: string, status: ExamSession['status']): void {
    const list = this.getExamSessions();
    const session = list.find((s) => s.id === sessionId);
    if (!session) return;

    session.status = status;
    if (status === 'running' && !session.actual_start_at) {
      session.actual_start_at = new Date().toISOString();
      // Also update waiting participants in this session to 'in_progress'
      const participants = this.getParticipants();
      participants.forEach((p) => {
        if (p.exam_session_id === sessionId && p.status === 'waiting') {
          p.status = 'in_progress';
          p.started_at = p.started_at || new Date().toISOString();
        }
      });
      this.setItem(STORAGE_KEYS.PARTICIPANTS, participants);
    } else if (status === 'completed' && !session.actual_end_at) {
      session.actual_end_at = new Date().toISOString();
    }

    this.setItem(STORAGE_KEYS.EXAM_SESSIONS, list);
    this.logAudit('SESSION_STATUS_CHANGED', `Sesi '${session.name}' diubah statusnya menjadi ${status.toUpperCase()}.`, 'info');
  }

  // --- PARTICIPANTS ---
  public static getParticipants(): Participant[] {
    return this.getItem<Participant[]>(STORAGE_KEYS.PARTICIPANTS, []);
  }

  public static getParticipantsBySession(sessionId: string): Participant[] {
    return this.getParticipants().filter((p) => p.exam_session_id === sessionId);
  }

  public static getParticipantByHash(sessionHash: string): Participant | undefined {
    return this.getParticipants().find((p) => p.session_hash === sessionHash);
  }

  public static registerOrGetParticipant(
    sessionId: string,
    name: string,
    nim: string,
    ipAddress = '127.0.0.1',
    userAgent = 'Web Browser'
  ): { participant: Participant; isNew: boolean } {
    const participants = this.getParticipants();
    const existing = participants.find(
      (p) => p.exam_session_id === sessionId && p.nim.toUpperCase() === nim.toUpperCase()
    );

    if (existing) {
      existing.last_heartbeat = new Date().toISOString();
      this.setItem(STORAGE_KEYS.PARTICIPANTS, participants);
      this.setActiveParticipantHash(existing.session_hash);
      return { participant: existing, isNew: false };
    }

    // Assign 2 unique random problem cases
    const publishedCases = this.getProblemCases().filter((c) => c.status === 'published' && c.test_cases.length > 0);
    if (publishedCases.length < 2) {
      throw new Error("Bank soal belum mencukupi (minimal 2 studi kasus aktif 'published' dengan test cases).");
    }

    // Shuffle and pick 2 without replacement
    const shuffled = [...publishedCases].sort(() => Math.random() - 0.5);
    const case1 = shuffled[0];
    const case2 = shuffled[1];

    const participantId = `p-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const sessionHash = `hash-${nim}-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;

    const session = this.getSessionById(sessionId);
    const initialStatus = session?.status === 'running' ? 'in_progress' : 'waiting';

    const starterCpp = `#include <iostream>\n\nusing namespace std;\n\nint main() {\n    // Tulis solusi C++ Anda di sini\n    \n    return 0;\n}\n`;

    const assignment1: ParticipantAssignment = {
      id: `asg-${participantId}-1`,
      participant_id: participantId,
      problem_case_id: case1.id,
      problem_case: case1,
      sequence_number: 1,
      status: 'active',
      score: 0,
      max_score: 50,
      code_draft: starterCpp,
      last_saved_at: new Date().toISOString(),
    };

    const assignment2: ParticipantAssignment = {
      id: `asg-${participantId}-2`,
      participant_id: participantId,
      problem_case_id: case2.id,
      problem_case: case2,
      sequence_number: 2,
      status: 'pending',
      score: 0,
      max_score: 50,
      code_draft: starterCpp,
      last_saved_at: new Date().toISOString(),
    };

    const newParticipant: Participant = {
      id: participantId,
      exam_session_id: sessionId,
      name: name.toUpperCase().trim(),
      nim: nim.toUpperCase().trim(),
      session_hash: sessionHash,
      ip_address: ipAddress,
      user_agent: userAgent,
      status: initialStatus,
      started_at: initialStatus === 'in_progress' ? new Date().toISOString() : undefined,
      total_score: 0,
      is_passed: false,
      last_heartbeat: new Date().toISOString(),
      assignments: [assignment1, assignment2],
    };

    participants.push(newParticipant);
    this.setItem(STORAGE_KEYS.PARTICIPANTS, participants);
    this.setActiveParticipantHash(sessionHash);

    this.logAudit(
      'PARTICIPANT_JOINED',
      `${newParticipant.name} (${newParticipant.nim}) bergabung ke sesi ujian.`,
      'info'
    );

    return { participant: newParticipant, isNew: true };
  }

  public static saveParticipantDraft(
    sessionHash: string,
    assignmentSequence: 1 | 2,
    code: string
  ): void {
    const participants = this.getParticipants();
    const p = participants.find((x) => x.session_hash === sessionHash);
    if (!p) return;

    const asg = p.assignments.find((a) => a.sequence_number === assignmentSequence);
    if (asg && asg.status === 'active') {
      asg.code_draft = code;
      asg.last_saved_at = new Date().toISOString();
      p.last_heartbeat = new Date().toISOString();
      this.setItem(STORAGE_KEYS.PARTICIPANTS, participants);
    }
  }

  public static submitCaseAssignment(
    sessionHash: string,
    assignmentSequence: 1 | 2,
    submission: Submission,
    isAutoSubmit = false
  ): { nextCaseAvailable: boolean; participant: Participant } {
    const participants = this.getParticipants();
    const p = participants.find((x) => x.session_hash === sessionHash);
    if (!p) throw new Error('Participant not found');

    const asg = p.assignments.find((a) => a.sequence_number === assignmentSequence);
    if (!asg) throw new Error('Assignment not found');

    asg.status = 'submitted';
    asg.score = submission.score;
    asg.submitted_at = submission.submitted_at;
    asg.code_draft = submission.code;
    asg.submission = submission;

    let nextCaseAvailable = false;

    if (assignmentSequence === 1) {
      // Unlock Case 2
      const asg2 = p.assignments.find((a) => a.sequence_number === 2);
      if (asg2 && asg2.status === 'pending' && !isAutoSubmit) {
        asg2.status = 'active';
        nextCaseAvailable = true;
      }
    }

    // Check if both cases are completed or if auto-submit
    const allSubmitted = p.assignments.every((a) => a.status === 'submitted');
    if (allSubmitted || isAutoSubmit) {
      const total = p.assignments.reduce((sum, a) => sum + (a.score || 0), 0);
      const session = this.getSessionById(p.exam_session_id);
      const passGrade = session?.passing_grade ?? 65;

      p.status = 'completed';
      p.finished_at = new Date().toISOString();
      p.total_score = Number(total.toFixed(2));
      p.is_passed = p.total_score >= passGrade;
    }

    p.last_heartbeat = new Date().toISOString();
    this.setItem(STORAGE_KEYS.PARTICIPANTS, participants);

    this.logAudit(
      isAutoSubmit ? 'AUTO_SUBMISSION' : 'CASE_SUBMITTED',
      `${p.name} (${p.nim}) ${isAutoSubmit ? 'auto-submitted' : 'mengumpulkan'} studi kasus #${assignmentSequence} (Skor: ${submission.score.toFixed(1)}).`,
      isAutoSubmit ? 'warning' : 'success'
    );

    return { nextCaseAvailable, participant: p };
  }

  // Session state storage
  public static getActiveParticipantHash(): string | null {
    return localStorage.getItem(STORAGE_KEYS.ACTIVE_PARTICIPANT_HASH);
  }

  public static setActiveParticipantHash(hash: string | null): void {
    if (hash) {
      localStorage.setItem(STORAGE_KEYS.ACTIVE_PARTICIPANT_HASH, hash);
    } else {
      localStorage.removeItem(STORAGE_KEYS.ACTIVE_PARTICIPANT_HASH);
    }
  }

  public static getCurrentAdminUser(): User | null {
    return this.getItem<User | null>(STORAGE_KEYS.CURRENT_ADMIN_USER, null);
  }

  public static setCurrentAdminUser(user: User | null): void {
    this.setItem(STORAGE_KEYS.CURRENT_ADMIN_USER, user);
  }

  // --- AUDIT LOGS ---
  public static getAuditLogs(): AuditLog[] {
    return this.getItem<AuditLog[]>(STORAGE_KEYS.AUDIT_LOGS, []);
  }

  public static logAudit(
    event: string,
    description: string,
    type: AuditLog['type'] = 'info'
  ): void {
    const logs = this.getAuditLogs();
    const newLog: AuditLog = {
      id: `log-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      event,
      description,
      timestamp: new Date().toISOString(),
      type,
    };
    logs.unshift(newLog);
    if (logs.length > 100) logs.pop();
    this.setItem(STORAGE_KEYS.AUDIT_LOGS, logs);
  }

  // --- SETTINGS ---
  public static getSettings(): SystemSettings {
    return this.getItem<SystemSettings>(STORAGE_KEYS.SETTINGS, INITIAL_SETTINGS);
  }

  public static saveSettings(settings: SystemSettings): void {
    this.setItem(STORAGE_KEYS.SETTINGS, settings);
    this.logAudit('SETTINGS_UPDATED', 'Pengaturan sistem diperbarui oleh administrator.', 'info');
  }

  public static resetToDefaults(): void {
    localStorage.clear();
    this.initialize();
  }
}
