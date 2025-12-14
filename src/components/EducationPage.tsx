import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, ArrowLeft, BookOpen, Award, CheckCircle, Lock, Brain, Database, Users, AlertTriangle } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Progress } from './ui/progress';
import { toast } from 'sonner';

export default function EducationPage() {
  const navigate = useNavigate();
  const [quizAnswers, setQuizAnswers] = useState<Record<number, string>>({});
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [score, setScore] = useState(0);

  const articles = [
    {
      id: 1,
      title: 'Plagiarisme: Ancaman Integritas Akademik',
      icon: '📝',
      category: 'Plagiarisme',
      color: 'bg-red-100 text-red-700',
      duration: '10 menit',
      content: `
        <h3>Apa itu Plagiarisme?</h3>
        <p>Plagiarisme adalah tindakan mengambil karya, ide, atau kata-kata orang lain dan menyajikannya sebagai karya sendiri tanpa memberikan kredit yang sepatutnya kepada sumber aslinya.</p>
        
        <h3>Jenis-jenis Plagiarisme:</h3>
        <ul>
          <li><strong>Plagiarisme Langsung:</strong> Menyalin teks kata per kata tanpa tanda kutip atau sitasi</li>
          <li><strong>Parafrase Tidak Tepat:</strong> Mengubah kata-kata tetapi mempertahankan struktur dan ide tanpa sitasi</li>
          <li><strong>Self-Plagiarism:</strong> Menggunakan kembali karya sendiri yang sudah dipublikasikan tanpa izin</li>
          <li><strong>Plagiarisme Mozaik:</strong> Mencampur kutipan dari berbagai sumber tanpa sitasi yang tepat</li>
        </ul>

        <h3>Konsekuensi Plagiarisme:</h3>
        <ul>
          <li>Sanksi akademik: nilai F, skorsing, atau dikeluarkan</li>
          <li>Reputasi rusak secara permanen</li>
          <li>Masalah hukum terkait hak cipta</li>
          <li>Kehilangan kepercayaan dari komunitas akademik</li>
        </ul>

        <h3>Cara Menghindari Plagiarisme:</h3>
        <ul>
          <li>Selalu berikan sitasi untuk semua sumber yang digunakan</li>
          <li>Gunakan tanda kutip untuk kutipan langsung</li>
          <li>Parafrase dengan benar dan tetap berikan kredit</li>
          <li>Gunakan tools plagiarism checker seperti Turnitin</li>
          <li>Mulai tugas lebih awal untuk menghindari tekanan waktu</li>
        </ul>
      `
    },
    {
      id: 2,
      title: 'Keamanan Siber di Kampus',
      icon: '🛡️',
      category: 'Keamanan',
      color: 'bg-blue-100 text-blue-700',
      duration: '12 menit',
      content: `
        <h3>Mengapa Keamanan Siber Penting di Kampus?</h3>
        <p>Kampus menyimpan banyak data sensitif termasuk informasi pribadi mahasiswa, hasil penelitian, dan data administratif. Pelanggaran keamanan dapat mengakibatkan:</p>
        <ul>
          <li>Pencurian identitas mahasiswa dan staff</li>
          <li>Kehilangan data penelitian berharga</li>
          <li>Gangguan operasional kampus</li>
          <li>Kerugian finansial dan reputasi</li>
        </ul>

        <h3>Ancaman Keamanan Siber di Kampus:</h3>
        <ul>
          <li><strong>Phishing:</strong> Email atau website palsu untuk mencuri kredensial</li>
          <li><strong>Malware:</strong> Virus, ransomware, atau spyware</li>
          <li><strong>WiFi Hacking:</strong> Akses tidak sah ke jaringan kampus</li>
          <li><strong>Social Engineering:</strong> Manipulasi psikologis untuk mendapat informasi</li>
          <li><strong>DDoS Attacks:</strong> Serangan untuk melumpuhkan sistem</li>
        </ul>

        <h3>Best Practices Keamanan:</h3>
        <ul>
          <li>Gunakan password yang kuat dan unik</li>
          <li>Aktifkan two-factor authentication (2FA)</li>
          <li>Jangan bagikan kredensial login Anda</li>
          <li>Update software dan sistem operasi secara berkala</li>
          <li>Hati-hati dengan email mencurigakan</li>
          <li>Gunakan VPN saat mengakses jaringan publik</li>
          <li>Backup data penting secara regular</li>
        </ul>

        <h3>Pelaporan Insiden:</h3>
        <p>Jika Anda mencurigai adanya pelanggaran keamanan, segera laporkan ke IT Support atau melalui platform ETIKA-CAMPUS.</p>
      `
    },
    {
      id: 3,
      title: 'Etika Penggunaan AI dalam Pembelajaran',
      icon: '🤖',
      category: 'AI & Teknologi',
      color: 'bg-orange-100 text-orange-700',
      duration: '8 menit',
      content: `
        <h3>AI sebagai Alat Bantu Pembelajaran</h3>
        <p>Kecerdasan Buatan seperti ChatGPT, Claude, dan tools AI lainnya dapat menjadi alat bantu pembelajaran yang powerful. Namun, penggunaan yang tidak etis dapat merusak proses belajar.</p>

        <h3>Penggunaan AI yang Etis:</h3>
        <ul>
          <li><strong>Brainstorming Ideas:</strong> Gunakan AI untuk menghasilkan ide awal</li>
          <li><strong>Penjelasan Konsep:</strong> Minta AI menjelaskan konsep yang sulit dipahami</li>
          <li><strong>Proofreading:</strong> Gunakan untuk memeriksa grammar dan struktur</li>
          <li><strong>Research Assistant:</strong> Bantuan mencari sumber atau referensi</li>
          <li><strong>Coding Helper:</strong> Memahami error atau konsep programming</li>
        </ul>

        <h3>Penggunaan AI yang Tidak Etis:</h3>
        <ul>
          <li>Menyerahkan output AI sebagai karya sendiri tanpa modifikasi</li>
          <li>Menggunakan AI untuk mengerjakan seluruh tugas individu</li>
          <li>Tidak mencantumkan bahwa AI digunakan saat diminta disclosure</li>
          <li>Mengandalkan AI tanpa memahami materi</li>
        </ul>

        <h3>Pedoman Penggunaan:</h3>
        <ul>
          <li>Selalu cek kebijakan dosen tentang penggunaan AI</li>
          <li>Jika menggunakan AI, disclosure dan jelaskan bagaimana digunakan</li>
          <li>AI sebagai starting point, bukan finishing point</li>
          <li>Pastikan Anda memahami semua yang Anda submit</li>
          <li>Fokus pada pembelajaran, bukan hanya nilai</li>
        </ul>

        <h3>Masa Depan AI di Pendidikan:</h3>
        <p>Kemampuan menggunakan AI secara etis adalah skill penting untuk masa depan. Belajarlah menggunakan AI sebagai tool untuk meningkatkan produktivitas dan kreativitas, bukan untuk menggantikan proses belajar.</p>
      `
    },
    {
      id: 4,
      title: 'Privasi Data dan Perlindungan Informasi',
      icon: '🔐',
      category: 'Privasi Data',
      color: 'bg-purple-100 text-purple-700',
      duration: '10 menit',
      content: `
        <h3>Pentingnya Privasi Data</h3>
        <p>Data pribadi adalah aset berharga yang harus dilindungi. Di era digital, pelanggaran privasi dapat memiliki konsekuensi serius.</p>

        <h3>Jenis Data Pribadi:</h3>
        <ul>
          <li><strong>Data Identitas:</strong> Nama, NIM, NIK, tanggal lahir</li>
          <li><strong>Data Kontak:</strong> Email, nomor telepon, alamat</li>
          <li><strong>Data Akademik:</strong> Nilai, transkrip, riwayat pendidikan</li>
          <li><strong>Data Finansial:</strong> Informasi pembayaran, rekening bank</li>
          <li><strong>Data Biometrik:</strong> Sidik jari, foto wajah</li>
        </ul>

        <h3>Pelanggaran Privasi Data:</h3>
        <ul>
          <li>Berbagi data pribadi orang lain tanpa izin</li>
          <li>Mengakses database tanpa otorisasi</li>
          <li>Menyebarkan informasi pribadi di media sosial</li>
          <li>Menggunakan data untuk tujuan tidak sah</li>
        </ul>

        <h3>Melindungi Data Pribadi Anda:</h3>
        <ul>
          <li>Berhati-hati dengan informasi yang dibagikan online</li>
          <li>Gunakan privacy settings di media sosial</li>
          <li>Jangan bagikan password atau PIN</li>
          <li>Hati-hati dengan form online yang meminta data pribadi</li>
          <li>Gunakan encryption untuk data sensitif</li>
        </ul>

        <h3>Hak Anda atas Data:</h3>
        <ul>
          <li>Hak untuk mengetahui data apa yang dikumpulkan</li>
          <li>Hak untuk mengakses data pribadi Anda</li>
          <li>Hak untuk mengoreksi data yang tidak akurat</li>
          <li>Hak untuk menghapus data (right to be forgotten)</li>
        </ul>
      `
    }
  ];

  const quizQuestions = [
    {
      id: 1,
      question: 'Apa yang dimaksud dengan plagiarisme?',
      options: [
        'Mengutip sumber dengan benar',
        'Mengambil karya orang lain tanpa memberikan kredit',
        'Menggunakan referensi dalam tugas',
        'Menulis dengan gaya sendiri'
      ],
      correct: 1
    },
    {
      id: 2,
      question: 'Manakah yang merupakan penggunaan AI yang etis dalam pembelajaran?',
      options: [
        'Menyalin seluruh output AI untuk tugas',
        'Menggunakan AI untuk brainstorming ide',
        'Tidak memberitahu dosen bahwa menggunakan AI',
        'Mengandalkan AI tanpa memahami materi'
      ],
      correct: 1
    },
    {
      id: 3,
      question: 'Apa yang harus dilakukan jika menemukan kerentanan keamanan di sistem kampus?',
      options: [
        'Mengeksploitasi untuk keuntungan pribadi',
        'Membagikan di media sosial',
        'Melaporkan ke IT Support atau ETIKA-CAMPUS',
        'Mengabaikannya'
      ],
      correct: 2
    },
    {
      id: 4,
      question: 'Manakah yang BUKAN termasuk data pribadi?',
      options: [
        'Nama dan NIM',
        'Informasi mata kuliah umum',
        'Nomor telepon',
        'Alamat email'
      ],
      correct: 1
    },
    {
      id: 5,
      question: 'Apa yang dimaksud dengan two-factor authentication (2FA)?',
      options: [
        'Menggunakan dua password berbeda',
        'Login dengan dua akun sekaligus',
        'Verifikasi dengan dua langkah untuk keamanan ekstra',
        'Membuat dua backup data'
      ],
      correct: 2
    }
  ];

  const handleQuizSubmit = () => {
    let correctCount = 0;
    quizQuestions.forEach((q) => {
      if (quizAnswers[q.id] === q.correct.toString()) {
        correctCount++;
      }
    });
    const finalScore = (correctCount / quizQuestions.length) * 100;
    setScore(finalScore);
    setQuizCompleted(true);
    
    if (finalScore >= 80) {
      toast.success(`Selamat! Anda mendapat nilai ${finalScore}%`);
    } else {
      toast.error(`Nilai Anda ${finalScore}%. Coba lagi untuk mendapat minimal 80%`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Header */}
      <div className="bg-white border-b shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Button variant="ghost" onClick={() => navigate('/')} className="mb-4">
            <ArrowLeft className="size-4 mr-2" />
            Kembali
          </Button>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-800 rounded-lg flex items-center justify-center">
              <BookOpen className="size-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl text-gray-900">Edukasi Etika Teknologi</h1>
              <p className="text-gray-500">Pelajari prinsip-prinsip etika dalam penggunaan teknologi</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Tabs defaultValue="articles" className="space-y-8">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="articles">
              <BookOpen className="size-4 mr-2" />
              Artikel & Materi
            </TabsTrigger>
            <TabsTrigger value="quiz">
              <Award className="size-4 mr-2" />
              Kuis Pengetahuan
            </TabsTrigger>
          </TabsList>

          {/* Articles Tab */}
          <TabsContent value="articles" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              {articles.map((article) => (
                <Card key={article.id} className="p-6 hover:shadow-lg transition-shadow">
                  <div className="flex items-start justify-between mb-4">
                    <div className="text-4xl">{article.icon}</div>
                    <Badge className={article.color}>{article.category}</Badge>
                  </div>
                  <h3 className="text-xl mb-2 text-gray-900">{article.title}</h3>
                  <p className="text-sm text-gray-500 mb-4">⏱️ {article.duration}</p>
                  
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => {
                      const modal = document.getElementById(`modal-${article.id}`);
                      if (modal) modal.classList.remove('hidden');
                    }}
                  >
                    Baca Artikel
                  </Button>

                  {/* Modal */}
                  <div 
                    id={`modal-${article.id}`}
                    className="hidden fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
                    onClick={(e) => {
                      if (e.target === e.currentTarget) {
                        e.currentTarget.classList.add('hidden');
                      }
                    }}
                  >
                    <Card className="max-w-3xl w-full max-h-[90vh] overflow-y-auto p-8">
                      <div className="flex items-start justify-between mb-6">
                        <div>
                          <div className="flex items-center gap-3 mb-2">
                            <span className="text-4xl">{article.icon}</span>
                            <h2 className="text-2xl text-gray-900">{article.title}</h2>
                          </div>
                          <Badge className={article.color}>{article.category}</Badge>
                        </div>
                        <Button 
                          variant="ghost"
                          onClick={() => {
                            const modal = document.getElementById(`modal-${article.id}`);
                            if (modal) modal.classList.add('hidden');
                          }}
                        >
                          ✕
                        </Button>
                      </div>
                      <div 
                        className="prose max-w-none"
                        dangerouslySetInnerHTML={{ __html: article.content }}
                      />
                    </Card>
                  </div>
                </Card>
              ))}
            </div>

            {/* Additional Resources */}
            <Card className="p-8 bg-gradient-to-br from-blue-50 to-purple-50">
              <h3 className="text-xl mb-4 text-gray-900">Sumber Belajar Tambahan</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="flex items-start gap-3">
                  <BookOpen className="size-5 text-blue-600 mt-1" />
                  <div>
                    <p className="text-gray-900">Pedoman Etika Kampus</p>
                    <p className="text-sm text-gray-600">Dokumen lengkap etika mahasiswa</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Shield className="size-5 text-green-600 mt-1" />
                  <div>
                    <p className="text-gray-900">Kebijakan Keamanan IT</p>
                    <p className="text-sm text-gray-600">Aturan penggunaan infrastruktur IT</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Brain className="size-5 text-purple-600 mt-1" />
                  <div>
                    <p className="text-gray-900">Workshop Etika AI</p>
                    <p className="text-sm text-gray-600">Pelatihan penggunaan AI yang bertanggung jawab</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Users className="size-5 text-orange-600 mt-1" />
                  <div>
                    <p className="text-gray-900">Seminar Cybersecurity</p>
                    <p className="text-sm text-gray-600">Event keamanan siber bulanan</p>
                  </div>
                </div>
              </div>
            </Card>
          </TabsContent>

          {/* Quiz Tab */}
          <TabsContent value="quiz">
            <Card className="p-8">
              <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-2xl text-gray-900">Kuis Pengetahuan Etika Teknologi</h3>
                  {quizCompleted && (
                    <Badge className={score >= 80 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}>
                      Nilai: {score}%
                    </Badge>
                  )}
                </div>
                <p className="text-gray-600 mb-4">Uji pemahaman Anda tentang etika teknologi. Minimal nilai 80% untuk lulus.</p>
                <Progress value={quizCompleted ? 100 : (Object.keys(quizAnswers).length / quizQuestions.length) * 100} />
              </div>

              {!quizCompleted ? (
                <div className="space-y-8">
                  {quizQuestions.map((question, index) => (
                    <div key={question.id} className="pb-6 border-b last:border-b-0">
                      <p className="text-lg mb-4 text-gray-900">
                        {index + 1}. {question.question}
                      </p>
                      <div className="space-y-2">
                        {question.options.map((option, optionIndex) => (
                          <label 
                            key={optionIndex}
                            className="flex items-center gap-3 p-4 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                          >
                            <input 
                              type="radio"
                              name={`question-${question.id}`}
                              value={optionIndex}
                              checked={quizAnswers[question.id] === optionIndex.toString()}
                              onChange={() => setQuizAnswers({...quizAnswers, [question.id]: optionIndex.toString()})}
                              className="w-4 h-4"
                            />
                            <span className="text-gray-700">{option}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  ))}

                  <Button 
                    className="w-full bg-blue-600 text-white"
                    onClick={handleQuizSubmit}
                    disabled={Object.keys(quizAnswers).length !== quizQuestions.length}
                  >
                    <CheckCircle className="size-4 mr-2" />
                    Submit Jawaban
                  </Button>
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className={`w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 ${
                    score >= 80 ? 'bg-green-100' : 'bg-red-100'
                  }`}>
                    {score >= 80 ? (
                      <Award className="size-12 text-green-600" />
                    ) : (
                      <AlertTriangle className="size-12 text-red-600" />
                    )}
                  </div>
                  <h3 className="text-2xl mb-2 text-gray-900">
                    {score >= 80 ? 'Selamat! Anda Lulus!' : 'Belum Lulus'}
                  </h3>
                  <p className="text-xl mb-2 text-gray-700">Nilai Anda: {score}%</p>
                  <p className="text-gray-600 mb-6">
                    {score >= 80 
                      ? 'Anda telah menunjukkan pemahaman yang baik tentang etika teknologi!'
                      : 'Baca kembali materi dan coba lagi untuk mendapat nilai minimal 80%'}
                  </p>
                  <div className="flex gap-4 justify-center">
                    <Button 
                      variant="outline"
                      onClick={() => {
                        setQuizAnswers({});
                        setQuizCompleted(false);
                        setScore(0);
                      }}
                    >
                      Coba Lagi
                    </Button>
                    {score >= 80 && (
                      <Button className="bg-green-600 text-white">
                        <Award className="size-4 mr-2" />
                        Download Sertifikat
                      </Button>
                    )}
                  </div>
                </div>
              )}
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
