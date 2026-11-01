/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { StorageService } from './services/storage';
import { User, Participant, ExamSession } from './types';
import { StudentVerification } from './components/student/StudentVerification';
import { StudentWaitingRoom } from './components/student/StudentWaitingRoom';
import { LiveExamWorkspace } from './components/student/LiveExamWorkspace';
import { ExamCompleted } from './components/student/ExamCompleted';
import { AdminLogin } from './components/admin/AdminLogin';
import { AdminNavbar, AdminTab } from './components/admin/AdminNavbar';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { AdminCaseManagement } from './components/admin/AdminCaseManagement';
import { AdminSessionManagement } from './components/admin/AdminSessionManagement';
import { LiveMonitoring } from './components/admin/LiveMonitoring';
import { AdminReports } from './components/admin/AdminReports';
import { AdminSettings } from './components/admin/AdminSettings';
import { ZipExporter } from './services/zipExporter';
import { Terminal, Shield, UserCheck, RefreshCw, Download, Loader2 } from 'lucide-react';

type MainView = 'student' | 'admin';
type StudentStep = 'verify' | 'waiting' | 'active' | 'completed';

export default function App() {
  const [mainView, setMainView] = useState<MainView>('student');
  const [studentStep, setStudentStep] = useState<StudentStep>('verify');
  const [adminTab, setAdminTab] = useState<AdminTab>('dashboard');
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentParticipant, setCurrentParticipant] = useState<Participant | null>(null);
  const [currentSession, setCurrentSession] = useState<ExamSession | null>(null);
  const [targetMonitoringSessionId, setTargetMonitoringSessionId] = useState<string | undefined>();

  // Initialize database and storage on mount
  useEffect(() => {
    StorageService.initialize();

    // Check existing participant session
    const activeHash = StorageService.getActiveParticipantHash();
    if (activeHash) {
      const p = StorageService.getParticipantByHash(activeHash);
      if (p) {
        setCurrentParticipant(p);
        const s = StorageService.getSessionById(p.exam_session_id);
        if (s) setCurrentSession(s);

        if (p.status === 'completed') {
          setStudentStep('completed');
        } else if (p.status === 'in_progress' || (s && s.status === 'running')) {
          setStudentStep('active');
        } else {
          setStudentStep('waiting');
        }
      }
    }

    // Check existing admin user
    const admin = StorageService.getCurrentAdminUser();
    if (admin) {
      setCurrentUser(admin);
    }
  }, []);

  const handleStudentVerified = () => {
    const activeHash = StorageService.getActiveParticipantHash();
    if (activeHash) {
      const p = StorageService.getParticipantByHash(activeHash);
      if (p) {
        setCurrentParticipant(p);
        const s = StorageService.getSessionById(p.exam_session_id);
        if (s) setCurrentSession(s);

        if (p.status === 'completed') {
          setStudentStep('completed');
        } else if (s && s.status === 'running') {
          setStudentStep('active');
        } else {
          setStudentStep('waiting');
        }
      }
    }
  };

  const handleAdminLogin = (user: User) => {
    setCurrentUser(user);
    setAdminTab('dashboard');
  };

  const handleAdminLogout = () => {
    StorageService.setCurrentAdminUser(null);
    setCurrentUser(null);
  };

  const [isDownloadingZip, setIsDownloadingZip] = useState(false);
  const [zipProgress, setZipProgress] = useState<string>('');

  const handleDownloadZip = async () => {
    setIsDownloadingZip(true);
    try {
      await ZipExporter.downloadProjectZip((msg) => setZipProgress(msg));
    } catch (e) {
      console.error('Download error:', e);
      alert('Gagal mengunduh file zip. Silakan coba lagi.');
    } finally {
      setIsDownloadingZip(false);
      setZipProgress('');
    }
  };

  const handleGoToMonitoringFromSession = (sessionId?: string) => {
    setTargetMonitoringSessionId(sessionId);
    setAdminTab('monitoring');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Global Quick Switcher Bar (Only visible outside of active live coding exam) */}
      {!(mainView === 'student' && studentStep === 'active') && (
        <div className="bg-slate-900/90 border-b border-slate-800 px-4 py-2 flex flex-wrap items-center justify-between gap-2 text-xs shrink-0 select-none">
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-blue-500"></span>
            <span className="font-mono text-slate-300 font-semibold text-[11px]">
              PRACTICAL CODING EXAMINATION SYSTEM (C++)
            </span>
          </div>

          <div className="flex items-center space-x-2">
            {/* Download Full Source Code Button */}
            <button
              onClick={handleDownloadZip}
              disabled={isDownloadingZip}
              title="Unduh seluruh source code proyek ini dalam file .ZIP"
              className="px-3 py-1.5 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 font-semibold text-xs transition cursor-pointer flex items-center gap-1.5 shadow-xs disabled:opacity-50"
            >
              {isDownloadingZip ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span className="text-[11px]">{zipProgress || 'Mengompres...'}</span>
                </>
              ) : (
                <>
                  <Download className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Download Full ZIP</span>
                </>
              )}
            </button>

            <span className="text-slate-400 text-[11px] hidden sm:inline">Pindah Portal:</span>
            <div className="bg-slate-950 p-0.5 rounded-lg border border-slate-800 flex items-center">
              <button
                onClick={() => setMainView('student')}
                className={`px-3 py-1 rounded-md font-semibold text-xs transition cursor-pointer flex items-center gap-1.5 ${
                  mainView === 'student'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Terminal className="w-3.5 h-3.5" />
                <span>Portal Mahasiswa</span>
              </button>

              <button
                onClick={() => setMainView('admin')}
                className={`px-3 py-1 rounded-md font-semibold text-xs transition cursor-pointer flex items-center gap-1.5 ${
                  mainView === 'admin'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Shield className="w-3.5 h-3.5" />
                <span>Portal Administrator</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main View Container */}
      <main className="flex-1 flex flex-col">
        {mainView === 'student' ? (
          /* Student Views */
          studentStep === 'verify' ? (
            <StudentVerification
              onVerified={handleStudentVerified}
              onGoToAdmin={() => setMainView('admin')}
            />
          ) : studentStep === 'waiting' && currentParticipant && currentSession ? (
            <StudentWaitingRoom
              participant={currentParticipant}
              session={currentSession}
              onStartExam={() => setStudentStep('active')}
              onExit={() => {
                StorageService.setActiveParticipantHash(null);
                setStudentStep('verify');
              }}
            />
          ) : studentStep === 'active' && currentParticipant && currentSession ? (
            <LiveExamWorkspace
              participant={currentParticipant}
              session={currentSession}
              onExamCompleted={() => setStudentStep('completed')}
            />
          ) : studentStep === 'completed' && currentParticipant && currentSession ? (
            <ExamCompleted
              participant={currentParticipant}
              session={currentSession}
              onGoHome={() => {
                StorageService.setActiveParticipantHash(null);
                setStudentStep('verify');
              }}
            />
          ) : (
            <StudentVerification
              onVerified={handleStudentVerified}
              onGoToAdmin={() => setMainView('admin')}
            />
          )
        ) : (
          /* Administrator Views */
          !currentUser ? (
            <AdminLogin
              onLoginSuccess={handleAdminLogin}
              onGoToStudent={() => setMainView('student')}
            />
          ) : (
            <div className="flex-1 flex flex-col">
              <AdminNavbar
                currentTab={adminTab}
                onSelectTab={(tab) => setAdminTab(tab)}
                currentUser={currentUser}
                onLogout={handleAdminLogout}
                onGoToStudent={() => setMainView('student')}
              />

              <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
                {adminTab === 'dashboard' && <AdminDashboard onNavigate={setAdminTab} />}
                {adminTab === 'cases' && <AdminCaseManagement />}
                {adminTab === 'sessions' && (
                  <AdminSessionManagement
                    onGoToMonitoring={handleGoToMonitoringFromSession}
                  />
                )}
                {adminTab === 'monitoring' && (
                  <LiveMonitoring initialSessionId={targetMonitoringSessionId} />
                )}
                {adminTab === 'reports' && <AdminReports />}
                {adminTab === 'settings' && <AdminSettings />}
              </div>
            </div>
          )
        )}
      </main>
    </div>
  );
}
