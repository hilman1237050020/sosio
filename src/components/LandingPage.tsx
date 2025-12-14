import { useNavigate } from 'react-router-dom';
import { Shield, AlertTriangle, BookOpen, LogIn, ChevronRight, Lock, Users, TrendingUp } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';

export default function LandingPage() {
  const navigate = useNavigate();

  const features = [
    {
      icon: Shield,
      title: 'Keamanan & Kerahasiaan',
      description: 'Laporan Anda dijamin aman dan dapat dibuat secara anonim',
      color: 'text-blue-600'
    },
    {
      icon: Users,
      title: 'Tim Reviewer Profesional',
      description: 'Ditangani oleh dosen dan staff yang berpengalaman',
      color: 'text-green-600'
    },
    {
      icon: TrendingUp,
      title: 'Transparansi Proses',
      description: 'Lacak status laporan Anda secara real-time',
      color: 'text-purple-600'
    }
  ];

  const categories = [
    { name: 'Plagiarisme', color: 'bg-red-100 text-red-700', icon: '📝' },
    { name: 'Penyalahgunaan AI', color: 'bg-orange-100 text-orange-700', icon: '🤖' },
    { name: 'Hacking WiFi', color: 'bg-yellow-100 text-yellow-700', icon: '📡' },
    { name: 'Akses Ilegal', color: 'bg-pink-100 text-pink-700', icon: '🔓' },
    { name: 'Penyebaran Data Pribadi', color: 'bg-purple-100 text-purple-700', icon: '🔐' },
    { name: 'Cyberbullying', color: 'bg-blue-100 text-blue-700', icon: '💬' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Navigation */}
      <nav className="bg-white border-b sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-800 rounded-lg flex items-center justify-center">
                <Shield className="size-6 text-white" />
              </div>
              <div>
                <h1 className="text-blue-900">ETIKA-CAMPUS</h1>
                <p className="text-xs text-gray-500">Platform Etika Teknologi</p>
              </div>
            </div>
            <div className="hidden md:flex items-center gap-4">
              <Button variant="ghost" onClick={() => navigate('/edukasi')}>
                <BookOpen className="size-4 mr-2" />
                Panduan Etika
              </Button>
              <Button variant="ghost" onClick={() => navigate('/lacak')}>
                Lacak Laporan
              </Button>
              <Button variant="outline" onClick={() => navigate('/login')}>
                <LogIn className="size-4 mr-2" />
                Login Reviewer
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full mb-6">
            <Shield className="size-4" />
            <span className="text-sm">Platform Resmi Universitas</span>
          </div>
          
          <h2 className="text-5xl mb-6 bg-gradient-to-r from-blue-900 to-blue-600 bg-clip-text text-transparent">
            Bersama Membangun<br />Budaya Etika Teknologi
          </h2>
          
          <p className="text-xl text-gray-600 mb-10">
            Laporkan pelanggaran etika teknologi secara aman dan anonim. 
            Mari ciptakan lingkungan akademik yang profesional dan berintegritas.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="bg-blue-600 hover:bg-blue-700 text-white rounded-full px-8"
              onClick={() => navigate('/lapor')}
            >
              <AlertTriangle className="size-5 mr-2" />
              Laporkan Pelanggaran
              <ChevronRight className="size-5 ml-2" />
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              className="rounded-full px-8"
              onClick={() => navigate('/edukasi')}
            >
              <BookOpen className="size-5 mr-2" />
              Pelajari Etika Teknologi
            </Button>
          </div>

          <div className="mt-8 flex items-center justify-center gap-2 text-sm text-gray-500">
            <Lock className="size-4" />
            <span>100% Aman & Terjamin Kerahasiaannya</span>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h3 className="text-3xl mb-4 text-gray-900">Kategori Pelanggaran</h3>
          <p className="text-gray-600">Berbagai jenis pelanggaran yang dapat dilaporkan</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((category, index) => (
            <Card key={index} className="p-4 hover:shadow-lg transition-shadow cursor-pointer text-center">
              <div className="text-3xl mb-2">{category.icon}</div>
              <div className={`text-xs px-3 py-1 rounded-full inline-block ${category.color}`}>
                {category.name}
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="p-8 text-center hover:shadow-xl transition-shadow">
              <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4 ${feature.color}`}>
                <feature.icon className="size-8" />
              </div>
              <h4 className="text-xl mb-3 text-gray-900">{feature.title}</h4>
              <p className="text-gray-600">{feature.description}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* Why Report Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <h3 className="text-3xl mb-6">Mengapa Etika Teknologi Penting?</h3>
            <p className="text-blue-100 text-lg mb-8">
              Etika teknologi adalah fondasi profesionalisme di dunia informatika. 
              Dengan melaporkan pelanggaran, Anda membantu menjaga standar akademik 
              dan mempersiapkan lulusan yang berintegritas tinggi untuk industri teknologi.
            </p>
            <div className="grid md:grid-cols-3 gap-6 text-center">
              <div>
                <div className="text-4xl mb-2">🎓</div>
                <p>Integritas Akademik</p>
              </div>
              <div>
                <div className="text-4xl mb-2">💼</div>
                <p>Profesionalisme Industri</p>
              </div>
              <div>
                <div className="text-4xl mb-2">🛡️</div>
                <p>Keamanan Digital</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <Card className="bg-gradient-to-br from-gray-50 to-blue-50 p-12 text-center">
          <h3 className="text-3xl mb-4 text-gray-900">Siap Melaporkan Pelanggaran?</h3>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            Laporan Anda akan membantu menciptakan lingkungan kampus yang lebih baik. 
            Proses pelaporan mudah, cepat, dan terjamin kerahasiaannya.
          </p>
          <Button 
            size="lg"
            className="bg-blue-600 hover:bg-blue-700 text-white rounded-full px-8"
            onClick={() => navigate('/lapor')}
          >
            Mulai Laporkan Sekarang
          </Button>
        </Card>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Shield className="size-6 text-blue-400" />
                <span className="text-white">ETIKA-CAMPUS</span>
              </div>
              <p className="text-sm">Platform resmi universitas untuk pelaporan dan edukasi etika teknologi.</p>
            </div>
            <div>
              <h4 className="text-white mb-4">Tautan Cepat</h4>
              <ul className="space-y-2 text-sm">
                <li><button onClick={() => navigate('/lapor')} className="hover:text-blue-400">Laporkan Pelanggaran</button></li>
                <li><button onClick={() => navigate('/lacak')} className="hover:text-blue-400">Lacak Laporan</button></li>
                <li><button onClick={() => navigate('/edukasi')} className="hover:text-blue-400">Panduan Etika</button></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white mb-4">Untuk Reviewer</h4>
              <ul className="space-y-2 text-sm">
                <li><button onClick={() => navigate('/login')} className="hover:text-blue-400">Login Dashboard</button></li>
                <li><button className="hover:text-blue-400">Panduan Reviewer</button></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white mb-4">Kontak</h4>
              <p className="text-sm">Email: etika@university.ac.id</p>
              <p className="text-sm">Hotline: 0800-ETIKA-001</p>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm">
            <p>&copy; 2025 ETIKA-CAMPUS. Platform Etika Teknologi Universitas.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
