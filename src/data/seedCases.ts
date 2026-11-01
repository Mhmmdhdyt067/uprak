import { ProblemCase } from '../types';

export const INITIAL_PROBLEM_CASES: ProblemCase[] = [
  {
    id: 'case-01',
    title: 'Perkalian Matriks 2D Ordo N x N',
    slug: 'perkalian-matriks-2d-ordo-n-x-n',
    synopsis: 'Hitung hasil perkalian dua matriks persegi berordo N x N yang dibaca baris per baris.',
    description: `Diberikan sebuah bilangan bulat positif N (1 <= N <= 10) yang menyatakan ordo matriks persegi.
Diikuti dengan N baris pertama yang berisi elemen-elemen matriks A, kemudian N baris berikutnya yang berisi elemen-elemen matriks B.
Tugas Anda adalah menghitung matriks hasil perkalian C = A x B sesuai kaidah aljabar linear.`,
    instructions: 'Gunakan array atau vector 2D dalam C++. Baca input dari std::cin dan cetak elemen matriks hasil ke std::cout dengan spasi antar kolom dan newline antar baris.',
    input_format: `Baris 1: Bilangan bulat N.
N baris berikutnya: Elemen-elemen matriks A (N integer per baris, dipisahkan spasi).
N baris berikutnya: Elemen-elemen matriks B (N integer per baris, dipisahkan spasi).`,
    output_format: 'N baris yang merepresentasikan elemen-elemen matriks C, setiap elemen dipisahkan spasi tunggal tanpa spasi di ujung baris.',
    example_input: `2
1 2
3 4
2 0
1 2`,
    example_output: `4 4
10 8`,
    difficulty: 'medium',
    estimated_duration_minutes: 40,
    max_score: 50,
    status: 'published',
    created_at: '2026-10-15T08:00:00Z',
    updated_at: '2026-10-15T08:00:00Z',
    reference_solution: {
      id: 'ref-01',
      problem_case_id: 'case-01',
      language: 'cpp17',
      code: `#include <iostream>
#include <vector>

using namespace std;

int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);
    
    int n;
    if (!(cin >> n)) return 0;
    
    vector<vector<int>> a(n, vector<int>(n));
    vector<vector<int>> b(n, vector<int>(n));
    vector<vector<int>> c(n, vector<int>(n, 0));
    
    for (int i = 0; i < n; i++) {
        for (int j = 0; j < n; j++) {
            cin >> a[i][j];
        }
    }
    
    for (int i = 0; i < n; i++) {
        for (int j = 0; j < n; j++) {
            cin >> b[i][j];
        }
    }
    
    for (int i = 0; i < n; i++) {
        for (int j = 0; j < n; j++) {
            for (int k = 0; k < n; k++) {
                c[i][j] += a[i][k] * b[k][j];
            }
        }
    }
    
    for (int i = 0; i < n; i++) {
        for (int j = 0; j < n; j++) {
            cout << c[i][j] << (j == n - 1 ? "" : " ");
        }
        cout << "\\n";
    }
    
    return 0;
}`,
      is_valid: true,
      last_validated_at: '2026-10-15T08:05:00Z',
    },
    test_cases: [
      {
        id: 'tc-01-1',
        problem_case_id: 'case-01',
        name: 'Matriks 2x2 Dasar (Example)',
        input: `2\n1 2\n3 4\n2 0\n1 2`,
        expected_output: `4 4\n10 8`,
        test_type: 'positive',
        comparison_mode: 'normalized',
        visibility: 'public',
        weight: 15,
        order: 1,
      },
      {
        id: 'tc-01-2',
        problem_case_id: 'case-01',
        name: 'Perkalian dengan Matriks Identitas',
        input: `2\n5 9\n2 4\n1 0\n0 1`,
        expected_output: `5 9\n2 4`,
        test_type: 'positive',
        comparison_mode: 'normalized',
        visibility: 'public',
        weight: 15,
        order: 2,
      },
      {
        id: 'tc-01-3',
        problem_case_id: 'case-01',
        name: 'Matriks 3x3 Nol & Bilangan Negatif',
        input: `3\n1 -1 0\n2 0 1\n0 3 -2\n1 0 0\n0 1 0\n0 0 1`,
        expected_output: `1 -1 0\n2 0 1\n0 3 -2`,
        test_type: 'edge_case',
        comparison_mode: 'normalized',
        visibility: 'hidden',
        weight: 20,
        order: 3,
      },
    ],
  },
  {
    id: 'case-02',
    title: 'Verifikasi Bilangan Prima & Faktorisasi',
    slug: 'verifikasi-bilangan-prima-dan-faktorisasi',
    synopsis: 'Tentukan apakah bilangan bulat adalah bilangan prima. Jika bukan, cetak pembagi terkecilnya selain 1.',
    description: `Diberikan bilangan bulat T yang menyatakan banyaknya kasus uji.
Setiap kasus uji terdiri dari sebuah bilangan bulat N (2 <= N <= 10^7).
Untuk setiap kasus uji:
- Jika N adalah bilangan prima, cetak 'PRIMA'.
- Jika N bukan bilangan prima (komposit), cetak 'KOMPOSIT' diikuti spasi dan faktor pembagi terkecil dari N yang lebih besar dari 1.`,
    instructions: 'Gunakan algoritma faktorisasi prima efisien O(sqrt(N)) agar tidak mengalami Time Limit Exceeded.',
    input_format: `Baris 1: Integer T (1 <= T <= 100).
T baris berikutnya: Bilangan bulat N.`,
    output_format: "Untuk setiap kasus uji, cetak satu baris 'PRIMA' atau 'KOMPOSIT <faktor>'.",
    example_input: `3\n7\n12\n2`,
    example_output: `PRIMA\nKOMPOSIT 2\nPRIMA`,
    difficulty: 'easy',
    estimated_duration_minutes: 25,
    max_score: 50,
    status: 'published',
    created_at: '2026-10-15T08:00:00Z',
    updated_at: '2026-10-15T08:00:00Z',
    reference_solution: {
      id: 'ref-02',
      problem_case_id: 'case-02',
      language: 'cpp17',
      code: `#include <iostream>

using namespace std;

void checkPrime() {
    long long n;
    if (!(cin >> n)) return;
    for (long long i = 2; i * i <= n; i++) {
        if (n % i == 0) {
            cout << "KOMPOSIT " << i << "\\n";
            return;
        }
    }
    cout << "PRIMA\\n";
}

int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);
    int t;
    if (cin >> t) {
        while (t--) {
            checkPrime();
        }
    }
    return 0;
}`,
      is_valid: true,
      last_validated_at: '2026-10-15T08:10:00Z',
    },
    test_cases: [
      {
        id: 'tc-02-1',
        problem_case_id: 'case-02',
        name: 'Uji Sampel',
        input: `3\n7\n12\n2`,
        expected_output: `PRIMA\nKOMPOSIT 2\nPRIMA`,
        test_type: 'positive',
        comparison_mode: 'normalized',
        visibility: 'public',
        weight: 15,
        order: 1,
      },
      {
        id: 'tc-02-2',
        problem_case_id: 'case-02',
        name: 'Bilangan Kuadrat Komposit Ganjil',
        input: `2\n9\n25`,
        expected_output: `KOMPOSIT 3\nKOMPOSIT 5`,
        test_type: 'boundary',
        comparison_mode: 'normalized',
        visibility: 'public',
        weight: 15,
        order: 2,
      },
      {
        id: 'tc-02-3',
        problem_case_id: 'case-02',
        name: 'Prima Besar & Komposit Berfaktor Prima Besar',
        input: `2\n999983\n999982`,
        expected_output: `PRIMA\nKOMPOSIT 2`,
        test_type: 'edge_case',
        comparison_mode: 'normalized',
        visibility: 'hidden',
        weight: 20,
        order: 3,
      },
    ],
  },
  {
    id: 'case-03',
    title: 'Pembalikan Kata Dalam Kalimat (Reverse Words)',
    slug: 'pembalikan-kata-dalam-kalimat',
    synopsis: 'Balikkan setiap kata dalam kalimat tunggal tanpa mengubah urutan kata aslinya.',
    description: `Diberikan sebuah baris teks yang terdiri dari beberapa kata yang dipisahkan oleh satu spasi.
Tugas Anda adalah membalikkan susunan huruf dari setiap kata secara individual (contoh: 'kopi' menjadi 'ipok'), dengan tetap mempertahankan posisi urutan kata tersebut di dalam kalimat.`,
    instructions: 'Gunakan std::stringstream atau pembacaan string bertahap untuk membalikkan karakter tiap kata (misal dengan std::reverse).',
    input_format: 'Satu baris string S yang terdiri dari huruf kecil dan spasi.',
    output_format: 'Satu baris hasil pembalikan huruf pada setiap kata, dipisahkan oleh satu spasi.',
    example_input: 'praktikum algoritma cplusplus',
    example_output: 'muktikarp amtirogla sulpsulpc',
    difficulty: 'easy',
    estimated_duration_minutes: 20,
    max_score: 50,
    status: 'published',
    created_at: '2026-10-15T08:00:00Z',
    updated_at: '2026-10-15T08:00:00Z',
    reference_solution: {
      id: 'ref-03',
      problem_case_id: 'case-03',
      language: 'cpp17',
      code: `#include <iostream>
#include <string>
#include <sstream>
#include <algorithm>
#include <vector>

using namespace std;

int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);
    
    string line;
    if (getline(cin, line)) {
        stringstream ss(line);
        string word;
        vector<string> words;
        while (ss >> word) {
            reverse(word.begin(), word.end());
            words.push_back(word);
        }
        for (size_t i = 0; i < words.size(); i++) {
            cout << words[i] << (i + 1 == words.size() ? "" : " ");
        }
        cout << "\\n";
    }
    return 0;
}`,
      is_valid: true,
      last_validated_at: '2026-10-15T08:15:00Z',
    },
    test_cases: [
      {
        id: 'tc-03-1',
        problem_case_id: 'case-03',
        name: 'Tiga Kata Normal',
        input: 'praktikum algoritma cplusplus',
        expected_output: 'muktikarp amtirogla sulpsulpc',
        test_type: 'positive',
        comparison_mode: 'normalized',
        visibility: 'public',
        weight: 15,
        order: 1,
      },
      {
        id: 'tc-03-2',
        problem_case_id: 'case-03',
        name: 'Satu Kata Palindrom',
        input: 'katak',
        expected_output: 'katak',
        test_type: 'boundary',
        comparison_mode: 'normalized',
        visibility: 'public',
        weight: 15,
        order: 2,
      },
      {
        id: 'tc-03-3',
        problem_case_id: 'case-03',
        name: 'Banyak Kata Campuran',
        input: 'belajar struktur data dan pemrograman komputer',
        expected_output: 'rajaleb rutkurts atad nad namargormep retupmok',
        test_type: 'edge_case',
        comparison_mode: 'normalized',
        visibility: 'hidden',
        weight: 20,
        order: 3,
      },
    ],
  },
  {
    id: 'case-04',
    title: 'Pencarian Biner dan Frekuensi Elemen',
    slug: 'pencarian-biner-dan-frekuensi-elemen',
    synopsis: 'Cari berapa kali sebuah nilai target muncul di dalam array terurut berukuran besar.',
    description: `Diberikan sebuah array bilangan bulat A berukuran N yang sudah terurut secara menaik (non-decreasing).
Kemudian diberikan Q pertanyaan (queries), di mana setiap pertanyaan memuat sebuah nilai target X.
Untuk setiap pertanyaan, cetak banyaknya kemunculan angka X di dalam array A.`,
    instructions: 'Gunakan binary search, lower_bound, atau upper_bound dari <algorithm> untuk mencapai kompleksitas O(Q log N).',
    input_format: `Baris 1: Dua integer N dan Q (1 <= N, Q <= 10^5).
Baris 2: N integer elemen array A terurut.
Baris 3: Q integer nilai target X.`,
    output_format: 'Cetak Q baris, masing-masing berisi frekuensi target X pada array A.',
    example_input: `6 2
1 2 2 2 3 5
2 4`,
    example_output: `3
0`,
    difficulty: 'medium',
    estimated_duration_minutes: 35,
    max_score: 50,
    status: 'published',
    created_at: '2026-10-15T08:00:00Z',
    updated_at: '2026-10-15T08:00:00Z',
    reference_solution: {
      id: 'ref-04',
      problem_case_id: 'case-04',
      language: 'cpp17',
      code: `#include <iostream>
#include <vector>
#include <algorithm>

using namespace std;

int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);
    
    int n, q;
    if (cin >> n >> q) {
        vector<int> a(n);
        for (int i = 0; i < n; i++) cin >> a[i];
        while (q--) {
            int x;
            cin >> x;
            auto low = lower_bound(a.begin(), a.end(), x);
            auto up = upper_bound(a.begin(), a.end(), x);
            cout << (up - low) << "\\n";
        }
    }
    return 0;
}`,
      is_valid: true,
      last_validated_at: '2026-10-15T08:20:00Z',
    },
    test_cases: [
      {
        id: 'tc-04-1',
        problem_case_id: 'case-04',
        name: 'Sampel Uji Standar',
        input: `6 2\n1 2 2 2 3 5\n2 4`,
        expected_output: `3\n0`,
        test_type: 'positive',
        comparison_mode: 'normalized',
        visibility: 'public',
        weight: 15,
        order: 1,
      },
      {
        id: 'tc-04-2',
        problem_case_id: 'case-04',
        name: 'Semua Elemen Seragam',
        input: `5 1\n7 7 7 7 7\n7`,
        expected_output: `5`,
        test_type: 'boundary',
        comparison_mode: 'normalized',
        visibility: 'public',
        weight: 15,
        order: 2,
      },
      {
        id: 'tc-04-3',
        problem_case_id: 'case-04',
        name: 'Elemen Tidak Ditemukan & Batas Ujung',
        input: `5 3\n10 20 30 40 50\n5 10 50`,
        expected_output: `0\n1\n1`,
        test_type: 'edge_case',
        comparison_mode: 'normalized',
        visibility: 'hidden',
        weight: 20,
        order: 3,
      },
    ],
  },
  {
    id: 'case-05',
    title: 'Konversi Bilangan Desimal ke Biner & Heksadesimal',
    slug: 'konversi-desimal-ke-biner-dan-heksadesimal',
    synopsis: 'Konversikan bilangan bulat non-negatif ke dalam bentuk biner (basis 2) dan heksadesimal (basis 16).',
    description: `Diberikan sebuah bilangan bulat non-negatif N (0 <= N <= 10^9).
Konversikan bilangan tersebut ke dalam representasi basis 2 (biner) dan basis 16 (heksadesimal dengan huruf kapital A-F).
Cetak representasi biner diikuti spasi dan representasi heksadesimal.`,
    instructions: 'Tangani kasus batas khusus saat N = 0 dengan mencetak "0 0".',
    input_format: 'Satu baris berisi bilangan bulat non-negatif N.',
    output_format: 'Dua string dipisahkan spasi: <Biner> <Heksadesimal>',
    example_input: '255',
    example_output: '11111111 FF',
    difficulty: 'easy',
    estimated_duration_minutes: 20,
    max_score: 50,
    status: 'published',
    created_at: '2026-10-15T08:00:00Z',
    updated_at: '2026-10-15T08:00:00Z',
    reference_solution: {
      id: 'ref-05',
      problem_case_id: 'case-05',
      language: 'cpp17',
      code: `#include <iostream>
#include <string>
#include <algorithm>

using namespace std;

string toBin(long long n) {
    if (n == 0) return "0";
    string s = "";
    while (n > 0) {
        s += (n % 2 == 0 ? '0' : '1');
        n /= 2;
    }
    reverse(s.begin(), s.end());
    return s;
}

string toHex(long long n) {
    if (n == 0) return "0";
    string chars = "0123456789ABCDEF";
    string s = "";
    while (n > 0) {
        s += chars[n % 16];
        n /= 16;
    }
    reverse(s.begin(), s.end());
    return s;
}

int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);
    long long n;
    if (cin >> n) {
        cout << toBin(n) << " " << toHex(n) << "\\n";
    }
    return 0;
}`,
      is_valid: true,
      last_validated_at: '2026-10-15T08:25:00Z',
    },
    test_cases: [
      {
        id: 'tc-05-1',
        problem_case_id: 'case-05',
        name: 'Nilai 255 (Contoh)',
        input: '255',
        expected_output: '11111111 FF',
        test_type: 'positive',
        comparison_mode: 'normalized',
        visibility: 'public',
        weight: 15,
        order: 1,
      },
      {
        id: 'tc-05-2',
        problem_case_id: 'case-05',
        name: 'Boundary Nilai Nol (0)',
        input: '0',
        expected_output: '0 0',
        test_type: 'boundary',
        comparison_mode: 'normalized',
        visibility: 'public',
        weight: 15,
        order: 2,
      },
      {
        id: 'tc-05-3',
        problem_case_id: 'case-05',
        name: 'Bilangan Besar 1048576 (2^20)',
        input: '1048576',
        expected_output: '100000000000000000000 100000',
        test_type: 'edge_case',
        comparison_mode: 'normalized',
        visibility: 'hidden',
        weight: 20,
        order: 3,
      },
    ],
  },
  {
    id: 'case-06',
    title: 'Simulasi Tumpukan Buku (Stack Implementation)',
    slug: 'simulasi-tumpukan-buku-stack',
    synopsis: 'Implementasikan struktur data LIFO (Stack) dengan operasi PUSH, POP, dan TOP.',
    description: `Buatlah program yang mensimulasikan struktur data Stack untuk tumpukan buku dengan kapasitas dinamis.
Diberikan N instruksi yang terdiri dari:
- PUSH X : Masukkan bilangan bulat X ke tumpukan.
- POP : Ambil dan cetak elemen teratas dari tumpukan. Jika tumpukan kosong, cetak 'EMPTY'.
- TOP : Cetak nilai elemen teratas tanpa menghapusnya. Jika tumpukan kosong, cetak 'EMPTY'.`,
    instructions: 'Gunakan std::vector atau std::stack untuk mengimplementasikan mekanisme LIFO.',
    input_format: `Baris 1: Bilangan bulat N (1 <= N <= 1000).
N baris berikutnya: Instruksi berupa PUSH X, POP, atau TOP.`,
    output_format: 'Cetak hasil dari setiap perintah POP dan TOP.',
    example_input: `5
PUSH 10
PUSH 20
TOP
POP
TOP`,
    example_output: `20
20
10`,
    difficulty: 'medium',
    estimated_duration_minutes: 30,
    max_score: 50,
    status: 'published',
    created_at: '2026-10-15T08:00:00Z',
    updated_at: '2026-10-15T08:00:00Z',
    reference_solution: {
      id: 'ref-06',
      problem_case_id: 'case-06',
      language: 'cpp17',
      code: `#include <iostream>
#include <vector>
#include <string>

using namespace std;

int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);
    
    int n;
    if (cin >> n) {
        vector<int> st;
        while (n--) {
            string cmd;
            cin >> cmd;
            if (cmd == "PUSH") {
                int x;
                cin >> x;
                st.push_back(x);
            } else if (cmd == "POP") {
                if (st.empty()) {
                    cout << "EMPTY\\n";
                } else {
                    cout << st.back() << "\\n";
                    st.pop_back();
                }
            } else if (cmd == "TOP") {
                if (st.empty()) {
                    cout << "EMPTY\\n";
                } else {
                    cout << st.back() << "\\n";
                }
            }
        }
    }
    return 0;
}`,
      is_valid: true,
      last_validated_at: '2026-10-15T08:30:00Z',
    },
    test_cases: [
      {
        id: 'tc-06-1',
        problem_case_id: 'case-06',
        name: 'Sekuens Standar',
        input: `5\nPUSH 10\nPUSH 20\nTOP\nPOP\nTOP`,
        expected_output: `20\n20\n10`,
        test_type: 'positive',
        comparison_mode: 'normalized',
        visibility: 'public',
        weight: 15,
        order: 1,
      },
      {
        id: 'tc-06-2',
        problem_case_id: 'case-06',
        name: 'Operasi pada Stack Kosong (Underflow)',
        input: `3\nPOP\nTOP\nPOP`,
        expected_output: `EMPTY\nEMPTY\nEMPTY`,
        test_type: 'error_handling',
        comparison_mode: 'normalized',
        visibility: 'public',
        weight: 15,
        order: 2,
      },
      {
        id: 'tc-06-3',
        problem_case_id: 'case-06',
        name: 'Interleave Banyak Nilai',
        input: `7\nPUSH 5\nPUSH 15\nPOP\nPUSH 25\nPOP\nPOP\nPOP`,
        expected_output: `15\n25\n5\nEMPTY`,
        test_type: 'edge_case',
        comparison_mode: 'normalized',
        visibility: 'hidden',
        weight: 20,
        order: 3,
      },
    ],
  },
  {
    id: 'case-07',
    title: 'Validasi Tanda Kurung Siku dan Kurawal (Bracket Matching)',
    slug: 'validasi-tanda-kurung-siku-dan-kurawal',
    synopsis: 'Periksa keseimbangan dan urutan penutupan pasangan kurung (), [], dan {}.',
    description: `Diberikan sebuah string S yang hanya memuat karakter tanda kurung: '(', ')', '[', ']', '{', '}'.
Sebuah string dikatakan valid apabila:
1. Setiap kurung buka memiliki kurung tutup yang sesuai tipenya.
2. Kurung ditutup dalam urutan yang benar (LIFO).
Cetak 'VALID' jika seimbang, atau 'TIDAK VALID' jika salah satu aturan dilanggar.`,
    instructions: 'Gunakan struktur data stack karakter untuk melacak tanda kurung buka yang belum ditutup.',
    input_format: 'Satu baris string S (1 <= panjang S <= 10^5).',
    output_format: 'Cetak VALID atau TIDAK VALID.',
    example_input: '{[()]}',
    example_output: 'VALID',
    difficulty: 'medium',
    estimated_duration_minutes: 25,
    max_score: 50,
    status: 'published',
    created_at: '2026-10-15T08:00:00Z',
    updated_at: '2026-10-15T08:00:00Z',
    reference_solution: {
      id: 'ref-07',
      problem_case_id: 'case-07',
      language: 'cpp17',
      code: `#include <iostream>
#include <string>
#include <vector>

using namespace std;

int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);
    
    string s;
    if (cin >> s) {
        vector<char> st;
        bool ok = true;
        for (char c : s) {
            if (c == '(' || c == '[' || c == '{') {
                st.push_back(c);
            } else {
                if (st.empty()) {
                    ok = false;
                    break;
                }
                char top = st.back();
                st.pop_back();
                if (c == ')' && top != '(') ok = false;
                if (c == ']' && top != '[') ok = false;
                if (c == '}' && top != '{') ok = false;
                if (!ok) break;
            }
        }
        if (!st.empty()) ok = false;
        cout << (ok ? "VALID" : "TIDAK VALID") << "\\n";
    }
    return 0;
}`,
      is_valid: true,
      last_validated_at: '2026-10-15T08:35:00Z',
    },
    test_cases: [
      {
        id: 'tc-07-1',
        problem_case_id: 'case-07',
        name: 'Kurung Seimbang Berlapis',
        input: '{[()]}',
        expected_output: 'VALID',
        test_type: 'positive',
        comparison_mode: 'normalized',
        visibility: 'public',
        weight: 15,
        order: 1,
      },
      {
        id: 'tc-07-2',
        problem_case_id: 'case-07',
        name: 'Kurung Silang Tak Seimbang',
        input: '([)]',
        expected_output: 'TIDAK VALID',
        test_type: 'negative',
        comparison_mode: 'normalized',
        visibility: 'public',
        weight: 15,
        order: 2,
      },
      {
        id: 'tc-07-3',
        problem_case_id: 'case-07',
        name: 'Kurung Buka Berlebih / Hanya Tutup',
        input: '((())',
        expected_output: 'TIDAK VALID',
        test_type: 'edge_case',
        comparison_mode: 'normalized',
        visibility: 'hidden',
        weight: 20,
        order: 3,
      },
    ],
  },
  {
    id: 'case-08',
    title: 'Pengurutan Nilai Mahasiswa (Custom Multi-field Sort)',
    slug: 'pengurutan-nilai-mahasiswa-multi-field',
    synopsis: 'Urutkan daftar mahasiswa berdasarkan nilai tertinggi, dan jika sama urutkan nama secara alfabetis.',
    description: `Diberikan data N mahasiswa. Setiap data berisi NAMA (string tanpa spasi) dan SKOR (integer 0-100).
Urutkan daftar mahasiswa dengan aturan:
1. Skor tertinggi berada di posisi teratas (descending).
2. Jika ada skor yang bernilai sama, urutkan nama secara alfabetis A-Z (ascending).`,
    instructions: 'Gunakan struct Mahasiswa dan custom comparator function dengan std::sort().',
    input_format: `Baris 1: Integer N (1 <= N <= 1000).
N baris berikutnya: NAMA SKOR`,
    output_format: 'N baris terurut dengan format NAMA SKOR.',
    example_input: `3
BUDI 85
ANDI 90
CITRA 85`,
    example_output: `ANDI 90
BUDI 85
CITRA 85`,
    difficulty: 'hard',
    estimated_duration_minutes: 45,
    max_score: 50,
    status: 'published',
    created_at: '2026-10-15T08:00:00Z',
    updated_at: '2026-10-15T08:00:00Z',
    reference_solution: {
      id: 'ref-08',
      problem_case_id: 'case-08',
      language: 'cpp17',
      code: `#include <iostream>
#include <vector>
#include <string>
#include <algorithm>

using namespace std;

struct Mahasiswa {
    string nama;
    int skor;
};

bool cmp(const Mahasiswa &a, const Mahasiswa &b) {
    if (a.skor != b.skor) {
        return a.skor > b.skor;
    }
    return a.nama < b.nama;
}

int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);
    
    int n;
    if (cin >> n) {
        vector<Mahasiswa> list(n);
        for (int i = 0; i < n; i++) {
            cin >> list[i].nama >> list[i].skor;
        }
        sort(list.begin(), list.end(), cmp);
        for (const auto &m : list) {
            cout << m.nama << " " << m.skor << "\\n";
        }
    }
    return 0;
}`,
      is_valid: true,
      last_validated_at: '2026-10-15T08:40:00Z',
    },
    test_cases: [
      {
        id: 'tc-08-1',
        problem_case_id: 'case-08',
        name: 'Tiga Mahasiswa Berbeda (Example)',
        input: `3\nBUDI 85\nANDI 90\nCITRA 85`,
        expected_output: `ANDI 90\nBUDI 85\nCITRA 85`,
        test_type: 'positive',
        comparison_mode: 'normalized',
        visibility: 'public',
        weight: 15,
        order: 1,
      },
      {
        id: 'tc-08-2',
        problem_case_id: 'case-08',
        name: 'Semua Nilai Sama (Tie-breaker Alphabetical)',
        input: `4\nZAKI 100\nBAYU 100\nADIT 100\nCACA 100`,
        expected_output: `ADIT 100\nBAYU 100\nCACA 100\nZAKI 100`,
        test_type: 'boundary',
        comparison_mode: 'normalized',
        visibility: 'public',
        weight: 15,
        order: 2,
      },
      {
        id: 'tc-08-3',
        problem_case_id: 'case-08',
        name: 'Kombinasi Nilai Unik dan Nilai Kembar',
        input: `5\nEKO 70\nDENI 85\nFAJAR 70\nGITA 95\nHERU 85`,
        expected_output: `GITA 95\nDENI 85\nHERU 85\nEKO 70\nFAJAR 70`,
        test_type: 'edge_case',
        comparison_mode: 'normalized',
        visibility: 'hidden',
        weight: 20,
        order: 3,
      },
    ],
  },
  {
    id: 'case-09',
    title: 'Jumlah Subarray Maksimum (Kadane Algorithm)',
    slug: 'jumlah-subarray-maksimum-kadane',
    synopsis: 'Temukan jumlah elemen contiguous subarray terbesar dalam larik satu dimensi integer.',
    description: `Diberikan sebuah array A yang memuat N bilangan bulat (dapat bernilai positif, nol, atau negatif).
Sebuah subarray adalah urutan elemen-elemen bersebelahan yang berurutan.
Hitunglah jumlah elemen maksimum yang dapat dihasilkan dari salah satu contiguous subarray non-kosong.`,
    instructions: 'Gunakan Algoritma Kadane dengan kompleksitas O(N) agar optimal terhadap memori dan waktu.',
    input_format: `Baris 1: Integer N (1 <= N <= 10^5).
Baris 2: N integer elemen array A dipisahkan spasi (-10^4 <= A[i] <= 10^4).`,
    output_format: 'Satu bilangan bulat yang menyatakan jumlah maksimum subarray.',
    example_input: `8
-2 -3 4 -1 -2 1 5 -3`,
    example_output: '7',
    difficulty: 'hard',
    estimated_duration_minutes: 40,
    max_score: 50,
    status: 'published',
    created_at: '2026-10-15T08:00:00Z',
    updated_at: '2026-10-15T08:00:00Z',
    reference_solution: {
      id: 'ref-09',
      problem_case_id: 'case-09',
      language: 'cpp17',
      code: `#include <iostream>
#include <vector>
#include <algorithm>

using namespace std;

int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);
    
    int n;
    if (cin >> n) {
        vector<long long> a(n);
        for (int i = 0; i < n; i++) cin >> a[i];
        
        long long max_so_far = a[0];
        long long curr_max = a[0];
        
        for (int i = 1; i < n; i++) {
            curr_max = max(a[i], curr_max + a[i]);
            max_so_far = max(max_so_far, curr_max);
        }
        cout << max_so_far << "\\n";
    }
    return 0;
}`,
      is_valid: true,
      last_validated_at: '2026-10-15T08:45:00Z',
    },
    test_cases: [
      {
        id: 'tc-09-1',
        problem_case_id: 'case-09',
        name: 'Campuran Positif dan Negatif',
        input: `8\n-2 -3 4 -1 -2 1 5 -3`,
        expected_output: '7',
        test_type: 'positive',
        comparison_mode: 'normalized',
        visibility: 'public',
        weight: 15,
        order: 1,
      },
      {
        id: 'tc-09-2',
        problem_case_id: 'case-09',
        name: 'Semua Elemen Negatif',
        input: `4\n-10 -5 -20 -8`,
        expected_output: '-5',
        test_type: 'boundary',
        comparison_mode: 'normalized',
        visibility: 'public',
        weight: 15,
        order: 2,
      },
      {
        id: 'tc-09-3',
        problem_case_id: 'case-09',
        name: 'Array Tunggal Positif & Nol',
        input: `5\n0 3 0 5 0`,
        expected_output: '8',
        test_type: 'edge_case',
        comparison_mode: 'normalized',
        visibility: 'hidden',
        weight: 20,
        order: 3,
      },
    ],
  },
  {
    id: 'case-10',
    title: 'Pola Jam Pasir Bintang (Pattern Printing)',
    slug: 'pola-jam-pasir-bintang',
    synopsis: 'Cetak pola geometris jam pasir simetris menggunakan karakter asterisk (*) berdasarkan ukuran N ganjil.',
    description: `Diberikan sebuah bilangan ganjil N (3 <= N <= 19).
Cetak pola jam pasir simetris dengan:
- Bagian atas segitiga terbalik dari N bintang hingga 1 bintang di tengah.
- Bagian bawah segitiga tegak dari 3 bintang hingga N bintang.
- Setiap spasi di sebelah kiri disesuaikan dengan posisi tengah.`,
    instructions: 'Gunakan nested loop atau pembentukan string dengan spasi padding di sebelah kiri.',
    input_format: 'Satu baris berisi bilangan bulat ganjil N.',
    output_format: 'Pola jam pasir bintang.',
    example_input: '5',
    example_output: `*****\n ***\n  *\n ***\n*****`,
    difficulty: 'easy',
    estimated_duration_minutes: 25,
    max_score: 50,
    status: 'published',
    created_at: '2026-10-15T08:00:00Z',
    updated_at: '2026-10-15T08:00:00Z',
    reference_solution: {
      id: 'ref-10',
      problem_case_id: 'case-10',
      language: 'cpp17',
      code: `#include <iostream>
#include <string>

using namespace std;

int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);
    
    int n;
    if (cin >> n) {
        int half = n / 2;
        for (int i = 0; i < half; i++) {
            cout << string(i, ' ') << string(n - 2 * i, '*') << "\\n";
        }
        cout << string(half, ' ') << "*" << "\\n";
        for (int i = half - 1; i >= 0; i--) {
            cout << string(i, ' ') << string(n - 2 * i, '*') << "\\n";
        }
    }
    return 0;
}`,
      is_valid: true,
      last_validated_at: '2026-10-15T08:50:00Z',
    },
    test_cases: [
      {
        id: 'tc-10-1',
        problem_case_id: 'case-10',
        name: 'Ukuran N=5 (Contoh)',
        input: '5',
        expected_output: `*****\n ***\n  *\n ***\n*****`,
        test_type: 'positive',
        comparison_mode: 'normalized',
        visibility: 'public',
        weight: 15,
        order: 1,
      },
      {
        id: 'tc-10-2',
        problem_case_id: 'case-10',
        name: 'Ukuran Minimum N=3',
        input: '3',
        expected_output: `***\n *\n***`,
        test_type: 'boundary',
        comparison_mode: 'normalized',
        visibility: 'public',
        weight: 15,
        order: 2,
      },
      {
        id: 'tc-10-3',
        problem_case_id: 'case-10',
        name: 'Ukuran Lebih Besar N=7',
        input: '7',
        expected_output: `*******\n *****\n  ***\n   *\n  ***\n *****\n*******`,
        test_type: 'edge_case',
        comparison_mode: 'normalized',
        visibility: 'hidden',
        weight: 20,
        order: 3,
      },
    ],
  },
  {
    id: 'case-11',
    title: 'Penghitung Frekuensi Vokal dan Konsonan',
    slug: 'penghitung-frekuensi-vokal-dan-konsonan',
    synopsis: 'Hitung total kemunculan huruf vokal dan konsonan dalam kalimat, mengabaikan angka dan tanda baca.',
    description: `Diberikan sebuah kalimat yang memuat kombinasi huruf kapital, huruf kecil, angka, spasi, dan simbol.
Hitung banyaknya huruf vokal (A, I, U, E, O case-insensitive) dan huruf konsonan (huruf alfabet selain vokal).
Karakter angka dan simbol tanda baca TIDAK dihitung sebagai konsonan.`,
    instructions: 'Gunakan std::tolower() dan std::isalpha() dari header <cctype>.',
    input_format: 'Satu baris teks kalimat S (panjang <= 500 karakter).',
    output_format: 'Satu baris dengan format: VOKAL: <jumlah>, KONSONAN: <jumlah>',
    example_input: 'Halo Dunia 2026!',
    example_output: 'VOKAL: 5, KONSONAN: 4',
    difficulty: 'easy',
    estimated_duration_minutes: 20,
    max_score: 50,
    status: 'published',
    created_at: '2026-10-15T08:00:00Z',
    updated_at: '2026-10-15T08:00:00Z',
    reference_solution: {
      id: 'ref-11',
      problem_case_id: 'case-11',
      language: 'cpp17',
      code: `#include <iostream>
#include <string>
#include <cctype>

using namespace std;

int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);
    
    string s;
    if (getline(cin, s)) {
        int v = 0, k = 0;
        for (char c : s) {
            if (isalpha(c)) {
                char low = tolower(c);
                if (low == 'a' || low == 'i' || low == 'u' || low == 'e' || low == 'o') {
                    v++;
                } else {
                    k++;
                }
            }
        }
        cout << "VOKAL: " << v << ", KONSONAN: " << k << "\\n";
    }
    return 0;
}`,
      is_valid: true,
      last_validated_at: '2026-10-15T08:55:00Z',
    },
    test_cases: [
      {
        id: 'tc-11-1',
        problem_case_id: 'case-11',
        name: 'Teks Campuran Angka & Simbol',
        input: 'Halo Dunia 2026!',
        expected_output: 'VOKAL: 5, KONSONAN: 4',
        test_type: 'positive',
        comparison_mode: 'normalized',
        visibility: 'public',
        weight: 15,
        order: 1,
      },
      {
        id: 'tc-11-2',
        problem_case_id: 'case-11',
        name: 'Hanya Simbol dan Spasi',
        input: '12345 @#$% ^&*()',
        expected_output: 'VOKAL: 0, KONSONAN: 0',
        test_type: 'boundary',
        comparison_mode: 'normalized',
        visibility: 'public',
        weight: 15,
        order: 2,
      },
      {
        id: 'tc-11-3',
        problem_case_id: 'case-11',
        name: 'Huruf Kapital Lengkap A-Z',
        input: 'THE QUICK BROWN FOX JUMPS OVER THE LAZY DOG',
        expected_output: 'VOKAL: 11, KONSONAN: 24',
        test_type: 'edge_case',
        comparison_mode: 'normalized',
        visibility: 'hidden',
        weight: 20,
        order: 3,
      },
    ],
  },
  {
    id: 'case-12',
    title: 'Simulasi Gerak Robot Grid (Coordinate Simulation)',
    slug: 'simulasi-gerak-robot-grid',
    synopsis: 'Hitung koordinat akhir (X, Y) robot setelah membaca serangkaian karakter perintah pergerakan mata angin.',
    description: `Sebuah robot awalnya berada pada titik asal koordinat Kartesius (0, 0).
Robot dapat menerima serangkaian string instruksi satu karakter:
- 'U' (Up) : Menambah koordinat Y sebesar 1
- 'D' (Down) : Mengurangi koordinat Y sebesar 1
- 'R' (Right) : Menambah koordinat X sebesar 1
- 'L' (Left) : Mengurangi koordinat X sebesar 1
Tentukan koordinat akhir robot setelah seluruh urutan instruksi dijalankan.`,
    instructions: 'Iterasi string perintah dan akumulasikan pergeseran koordinat X dan Y.',
    input_format: 'Satu baris string perintah huruf kapital S (1 <= panjang S <= 10^5).',
    output_format: 'Cetak dua bilangan bulat X Y dipisahkan spasi.',
    example_input: 'UURRDDL',
    example_output: '1 0',
    difficulty: 'easy',
    estimated_duration_minutes: 20,
    max_score: 50,
    status: 'published',
    created_at: '2026-10-15T08:00:00Z',
    updated_at: '2026-10-15T08:00:00Z',
    reference_solution: {
      id: 'ref-12',
      problem_case_id: 'case-12',
      language: 'cpp17',
      code: `#include <iostream>
#include <string>

using namespace std;

int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);
    
    string s;
    if (cin >> s) {
        long long x = 0, y = 0;
        for (char c : s) {
            if (c == 'U') y++;
            else if (c == 'D') y--;
            else if (c == 'R') x++;
            else if (c == 'L') x--;
        }
        cout << x << " " << y << "\\n";
    }
    return 0;
}`,
      is_valid: true,
      last_validated_at: '2026-10-15T09:00:00Z',
    },
    test_cases: [
      {
        id: 'tc-12-1',
        problem_case_id: 'case-12',
        name: 'Perintah Campuran (Example)',
        input: 'UURRDDL',
        expected_output: '1 0',
        test_type: 'positive',
        comparison_mode: 'normalized',
        visibility: 'public',
        weight: 15,
        order: 1,
      },
      {
        id: 'tc-12-2',
        problem_case_id: 'case-12',
        name: 'Kembali ke Titik Awal (Loop)',
        input: 'UDRLUDLR',
        expected_output: '0 0',
        test_type: 'boundary',
        comparison_mode: 'normalized',
        visibility: 'public',
        weight: 15,
        order: 2,
      },
      {
        id: 'tc-12-3',
        problem_case_id: 'case-12',
        name: 'Perpindahan Jauh ke Kuadran III (Negatif)',
        input: 'DDDLLLLDDLL',
        expected_output: '-6 -5',
        test_type: 'edge_case',
        comparison_mode: 'normalized',
        visibility: 'hidden',
        weight: 20,
        order: 3,
      },
    ],
  },
];
