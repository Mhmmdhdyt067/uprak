import JSZip from 'jszip';

export class ZipExporter {
  public static async downloadProjectZip(onProgress?: (status: string) => void): Promise<void> {
    if (onProgress) onProgress('Mempersiapkan berkas proyek...');

    const zip = new JSZip();

    // List of static and dynamic source files
    const fileEntries: { path: string; fetchUrl?: string; content?: string }[] = [
      { path: 'package.json' },
      { path: 'tsconfig.json' },
      { path: 'vite.config.ts' },
      { path: 'index.html' },
      { path: 'metadata.json' },
      { path: 'server.ts' },
      { path: 'Dockerfile' },
      { path: 'docker-compose.yml' },
      { path: '.dockerignore' },
      { path: 'DEPLOYMENT.md' },
      { path: 'public/.htaccess' },
      { path: 'src/main.tsx' },
      { path: 'src/index.css' },
      { path: 'src/App.tsx' },
      { path: 'src/types/index.ts' },
      { path: 'src/data/seedCases.ts' },
      { path: 'src/services/storage.ts' },
      { path: 'src/services/cppEngine.ts' },
      { path: 'src/services/scoring.ts' },
      { path: 'src/services/realtime.ts' },
      { path: 'src/services/zipExporter.ts' },
      { path: 'src/components/common/Badge.tsx' },
      { path: 'src/components/common/Modal.tsx' },
      { path: 'src/components/editor/CppEditor.tsx' },
      { path: 'src/components/student/StudentVerification.tsx' },
      { path: 'src/components/student/StudentWaitingRoom.tsx' },
      { path: 'src/components/student/LiveExamWorkspace.tsx' },
      { path: 'src/components/student/ProblemPanel.tsx' },
      { path: 'src/components/student/TestCaseResultsPanel.tsx' },
      { path: 'src/components/student/ExamCompleted.tsx' },
      { path: 'src/components/admin/AdminLogin.tsx' },
      { path: 'src/components/admin/AdminNavbar.tsx' },
      { path: 'src/components/admin/AdminDashboard.tsx' },
      { path: 'src/components/admin/AdminCaseManagement.tsx' },
      { path: 'src/components/admin/TestCaseBuilderModal.tsx' },
      { path: 'src/components/admin/ReferenceSolutionModal.tsx' },
      { path: 'src/components/admin/SessionWaitingRoom.tsx' },
      { path: 'src/components/admin/AdminSessionManagement.tsx' },
      { path: 'src/components/admin/LiveMonitoring.tsx' },
      { path: 'src/components/admin/ParticipantDetailModal.tsx' },
      { path: 'src/components/admin/AdminReports.tsx' },
      { path: 'src/components/admin/AdminSettings.tsx' },
    ];

    let count = 0;
    for (const item of fileEntries) {
      count++;
      if (onProgress) {
        onProgress(`Mengemas berkas (${count}/${fileEntries.length}): ${item.path}`);
      }

      try {
        // Fetch file directly from Vite dev/static server
        const response = await fetch(`/${item.path}`);
        if (response.ok) {
          const text = await response.text();
          zip.file(item.path, text);
        }
      } catch (err) {
        console.warn(`Could not fetch ${item.path}, skipping:`, err);
      }
    }

    if (onProgress) onProgress('Mengompresi arsip ZIP...');

    const blob = await zip.generateAsync({
      type: 'blob',
      compression: 'DEFLATE',
      compressionOptions: { level: 9 },
    });

    // Create trigger download
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'practical-coding-examination-system.zip';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    if (onProgress) onProgress('Unduhan selesai!');
  }
}
