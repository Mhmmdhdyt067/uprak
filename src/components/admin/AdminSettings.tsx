import React, { useState } from 'react';
import { StorageService } from '../../services/storage';
import { ZipExporter } from '../../services/zipExporter';
import { SystemSettings } from '../../types';
import { Settings, Save, RotateCcw, ShieldCheck, Check, Server, Building, Download, FolderDown } from 'lucide-react';

export const AdminSettings: React.FC = () => {
  const [settings, setSettings] = useState<SystemSettings>(StorageService.getSettings());
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    StorageService.saveSettings(settings);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const handleResetDatabase = () => {
    if (
      confirm(
        'PERINGATAN: Seluruh sesi ujian dan data praktikan akan direset ke kondisi awal (12 studi kasus tetap utuh). Lanjutkan?'
      )
    ) {
      StorageService.resetToDefaults();
      setSettings(StorageService.getSettings());
      alert('Database sistem berhasil direset ke kondisi awal.');
      window.location.reload();
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <div>
          <span className="text-xs uppercase font-mono tracking-wider text-blue-400 font-semibold">
            Konfigurasi Sistem
          </span>
          <h1 className="text-2xl font-bold text-white tracking-tight mt-1">
            Pengaturan Compiler Sandbox & Akademik
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Atur integrasi compiler Judge0, preferensi sandbox eksekusi C++, dan identitas institusi.
          </p>
        </div>

        {savedSuccess && (
          <div className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-semibold animate-in fade-in">
            <Check className="w-4 h-4" />
            <span>Pengaturan Berhasil Disimpan!</span>
          </div>
        )}
      </div>

      <form onSubmit={handleSave} className="space-y-6 text-xs">
        {/* Judge0 Sandbox Settings */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex items-center space-x-2.5 pb-3 border-b border-slate-800">
            <Server className="w-5 h-5 text-blue-400" />
            <div>
              <h3 className="text-sm font-bold text-white">
                Konfigurasi Compiler Sandbox (Judge0)
              </h3>
              <p className="text-slate-400 text-[11px]">
                Endpoint API eksekusi kode C++17 (GCC 9.2.0)
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-300 mb-1">
                Judge0 API Endpoint URL:
              </label>
              <input
                type="text"
                value={settings.judge0_url}
                onChange={(e) => setSettings({ ...settings, judge0_url: e.target.value })}
                placeholder="https://judge0-ce.p.rapidapi.com"
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 font-mono text-xs focus:outline-hidden focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1">
                RapidAPI Host (Jika menggunakan RapidAPI):
              </label>
              <input
                type="text"
                value={settings.judge0_host}
                onChange={(e) => setSettings({ ...settings, judge0_host: e.target.value })}
                placeholder="judge0-ce.p.rapidapi.com"
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 font-mono text-xs focus:outline-hidden focus:border-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-300 mb-1">
              RapidAPI Key (Opsional):
            </label>
            <input
              type="password"
              value={settings.judge0_api_key}
              onChange={(e) => setSettings({ ...settings, judge0_api_key: e.target.value })}
              placeholder="Masukkan API Key Judge0 jika menggunakan external gateway..."
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 font-mono text-xs focus:outline-hidden focus:border-blue-500"
            />
          </div>

          {/* Simulate Sandbox Toggle */}
          <div className="p-4 bg-slate-950/70 border border-slate-800 rounded-xl flex items-center justify-between">
            <div className="space-y-0.5 max-w-lg">
              <span className="font-bold text-slate-200 text-xs block">
                Mode Sandbox Simulasi Cepat (Embedded C++ Engine)
              </span>
              <p className="text-slate-400 text-[11px] leading-relaxed">
                Saat diaktifkan, pengujian kode C++ berjalan instan di runtime sandbox lokal
                tanpa kuota / latensi API eksternal. Direkomendasikan untuk stabilitas lab.
              </p>
            </div>

            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.judge0_simulate}
                onChange={(e) => setSettings({ ...settings, judge0_simulate: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-800 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
        </div>

        {/* Academic Profile Settings */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex items-center space-x-2.5 pb-3 border-b border-slate-800">
            <Building className="w-5 h-5 text-blue-400" />
            <div>
              <h3 className="text-sm font-bold text-white">
                Profil Akademik & Berita Acara
              </h3>
              <p className="text-slate-400 text-[11px]">
                Informasi untuk kop laporan resmi ujian praktikum
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-300 mb-1">
                Nama Fakultas / Institusi:
              </label>
              <input
                type="text"
                value={settings.institution_name}
                onChange={(e) => setSettings({ ...settings, institution_name: e.target.value })}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 text-xs focus:outline-hidden focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1">
                Mata Kuliah Praktikum:
              </label>
              <input
                type="text"
                value={settings.course_name}
                onChange={(e) => setSettings({ ...settings, course_name: e.target.value })}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 text-xs focus:outline-hidden focus:border-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-300 mb-1">
                Tahun Ajaran / Semester:
              </label>
              <input
                type="text"
                value={settings.academic_year}
                onChange={(e) => setSettings({ ...settings, academic_year: e.target.value })}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 text-xs focus:outline-hidden focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1">
                Dosen / Koordinator Praktikum:
              </label>
              <input
                type="text"
                value={settings.coordinator_name}
                onChange={(e) => setSettings({ ...settings, coordinator_name: e.target.value })}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 text-xs focus:outline-hidden focus:border-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Export Source Code Section */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-3">
          <div className="flex items-center space-x-2.5 pb-2 border-b border-slate-800">
            <FolderDown className="w-5 h-5 text-emerald-400" />
            <div>
              <h3 className="text-sm font-bold text-white">
                Ekspor & Unduh Source Code Proyek
              </h3>
              <p className="text-slate-400 text-[11px]">
                Kemasi seluruh kode sumber, konfigurasi Docker, migrasi database, dan dokumentasi ke file .ZIP
              </p>
            </div>
          </div>

          <p className="text-slate-300 text-xs leading-relaxed">
            Gunakan berkas ZIP ini untuk mengunggah proyek ke VPS, hosting cPanel, atau repositori GitHub pribadi Anda.
          </p>

          <button
            type="button"
            onClick={async () => {
              try {
                await ZipExporter.downloadProjectZip();
              } catch (e) {
                alert('Gagal mengunduh file zip.');
              }
            }}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs shadow-md transition cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Unduh Arsip Source Code Lengkap (.ZIP)</span>
          </button>
        </div>

        {/* Buttons */}
        <div className="flex items-center justify-between pt-2">
          <button
            type="button"
            onClick={handleResetDatabase}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-rose-950/40 hover:bg-rose-900/40 text-rose-300 border border-rose-900/60 font-semibold text-xs transition cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Database & Seed Ulang</span>
          </button>

          <button
            type="submit"
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs shadow-lg shadow-blue-600/30 transition cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Simpan Pengaturan</span>
          </button>
        </div>
      </form>
    </div>
  );
};
