import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Upload, AlertCircle, ArrowLeft, Lock, Eye, EyeOff } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Checkbox } from './ui/checkbox';
import { Alert, AlertDescription } from './ui/alert';
import { ReportsService, CategoriesService } from '../lib/storage';

export default function ReportForm() {
  const navigate = useNavigate();
  const [isAnonymous, setIsAnonymous] = useState(true);
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [reporterName, setReporterName] = useState('');
  const [reporterEmail, setReporterEmail] = useState('');
  const [files, setFiles] = useState<FileList | null>(null);

  const categories = [
    { value: 'plagiarisme', label: 'Plagiarisme', color: 'bg-red-100 text-red-700' },
    { value: 'ai-abuse', label: 'Penyalahgunaan AI', color: 'bg-orange-100 text-orange-700' },
    { value: 'wifi-hacking', label: 'Hacking WiFi Kampus', color: 'bg-yellow-100 text-yellow-700' },
    { value: 'illegal-access', label: 'Akses Ilegal ke Sistem', color: 'bg-pink-100 text-pink-700' },
    { value: 'data-breach', label: 'Penyebaran Data Pribadi', color: 'bg-purple-100 text-purple-700' },
    { value: 'cyberbullying', label: 'Cyberbullying', color: 'bg-blue-100 text-blue-700' }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Create report using localStorage service
    const report = ReportsService.create({
      category,
      description,
      isAnonymous,
      reporterName: isAnonymous ? undefined : reporterName,
      reporterEmail: isAnonymous ? undefined : reporterEmail,
    });
    // Increment category report count
    CategoriesService.incrementReportCount(category);
    // Store report ID for success page
    localStorage.setItem('lastReportId', report.id);
    navigate('/sukses');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Header */}
      <div className="bg-white border-b shadow-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Button variant="ghost" onClick={() => navigate('/')} className="mb-4">
            <ArrowLeft className="size-4 mr-2" />
            Kembali
          </Button>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-800 rounded-lg flex items-center justify-center">
              <Shield className="size-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl text-gray-900">Form Pelaporan Pelanggaran</h1>
              <p className="text-gray-500">Laporkan pelanggaran etika teknologi dengan aman</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Privacy Alert */}
        <Alert className="mb-8 bg-blue-50 border-blue-200">
          <Lock className="size-5 text-blue-600" />
          <AlertDescription className="text-blue-900">
            <strong>Kerahasiaan Terjamin:</strong> Laporan Anda akan ditangani dengan penuh kerahasiaan.
            Data pribadi (jika Anda memberikannya) hanya dapat diakses oleh tim reviewer yang berwenang
            dan tidak akan dipublikasikan.
          </AlertDescription>
        </Alert>

        <Card className="p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Anonymous Toggle */}
            <div className="bg-gray-50 p-6 rounded-lg border-2 border-dashed border-gray-300">
              <div className="flex items-start gap-3">
                <Checkbox
                  id="anonymous"
                  checked={isAnonymous}
                  onCheckedChange={(checked) => setIsAnonymous(checked as boolean)}
                  className="mt-1"
                />
                <div className="flex-1">
                  <Label htmlFor="anonymous" className="cursor-pointer flex items-center gap-2">
                    {isAnonymous ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                    <span>Laporkan secara anonim</span>
                  </Label>
                  <p className="text-sm text-gray-500 mt-1">
                    {isAnonymous
                      ? 'Identitas Anda akan sepenuhnya dirahasiakan. Anda dapat melacak laporan dengan ID yang akan diberikan.'
                      : 'Dengan memberikan identitas, reviewer dapat menghubungi Anda untuk klarifikasi lebih lanjut.'}
                  </p>
                </div>
              </div>
            </div>

            {/* Reporter Identity (if not anonymous) */}
            {!isAnonymous && (
              <div className="space-y-4 p-6 bg-blue-50 rounded-lg">
                <h3 className="text-gray-900">Identitas Pelapor (Opsional)</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Nama Lengkap</Label>
                    <Input
                      id="name"
                      placeholder="Nama Anda"
                      value={reporterName}
                      onChange={(e) => setReporterName(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email / NIM</Label>
                    <Input
                      id="email"
                      placeholder="email@university.ac.id atau NIM"
                      value={reporterEmail}
                      onChange={(e) => setReporterEmail(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Category Selection */}
            <div>
              <Label htmlFor="category">Kategori Pelanggaran *</Label>
              <Select value={category} onValueChange={setCategory} required>
                <SelectTrigger id="category">
                  <SelectValue placeholder="Pilih kategori pelanggaran" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat.value} value={cat.value}>
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-1 rounded text-xs ${cat.color}`}>
                          {cat.label}
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-sm text-gray-500 mt-1">
                Pilih kategori yang paling sesuai dengan pelanggaran yang ingin dilaporkan
              </p>
            </div>

            {/* Description */}
            <div>
              <Label htmlFor="description">Deskripsi Lengkap Pelanggaran *</Label>
              <Textarea
                id="description"
                placeholder="Jelaskan pelanggaran yang terjadi secara detail:&#10;- Apa yang terjadi?&#10;- Kapan kejadiannya?&#10;- Siapa yang terlibat?&#10;- Bukti atau saksi yang ada?&#10;- Dampak yang ditimbulkan?"
                rows={10}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                className="resize-none"
              />
              <p className="text-sm text-gray-500 mt-1">
                Semakin detail deskripsi Anda, semakin mudah bagi reviewer untuk menindaklanjuti
              </p>
            </div>

            {/* File Upload */}
            <div>
              <Label htmlFor="evidence">Unggah Bukti (Opsional)</Label>
              <div className="mt-2 border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors">
                <Upload className="size-12 text-gray-400 mx-auto mb-4" />
                <Input
                  id="evidence"
                  type="file"
                  multiple
                  accept="image/*,.pdf,.doc,.docx"
                  onChange={(e) => setFiles(e.target.files)}
                  className="hidden"
                />
                <Label htmlFor="evidence" className="cursor-pointer">
                  <span className="text-blue-600 hover:text-blue-700">Klik untuk memilih file</span>
                  <span className="text-gray-500"> atau drag & drop</span>
                </Label>
                <p className="text-xs text-gray-500 mt-2">
                  Format: JPG, PNG, PDF, DOC (Max 10MB per file)
                </p>
                {files && files.length > 0 && (
                  <div className="mt-4 text-sm text-gray-700">
                    {files.length} file terpilih
                  </div>
                )}
              </div>
            </div>

            {/* Important Notes */}
            <Alert className="bg-amber-50 border-amber-200">
              <AlertCircle className="size-5 text-amber-600" />
              <AlertDescription className="text-amber-900">
                <strong>Penting:</strong> Pastikan laporan yang Anda buat berdasarkan fakta dan bukan fitnah.
                Laporan palsu dapat dikenakan sanksi sesuai peraturan akademik.
              </AlertDescription>
            </Alert>

            {/* Submit Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={() => navigate('/')}
              >
                Batal
              </Button>
              <Button
                type="submit"
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                disabled={!category || !description}
              >
                <Shield className="size-4 mr-2" />
                Kirim Laporan
              </Button>
            </div>
          </form>
        </Card>

        {/* Help Section */}
        <Card className="mt-8 p-6 bg-gray-50">
          <h3 className="text-gray-900 mb-4">Butuh Bantuan?</h3>
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-700 mb-1">📧 Email:</p>
              <p className="text-blue-600">etika@university.ac.id</p>
            </div>
            <div>
              <p className="text-gray-700 mb-1">📞 Hotline:</p>
              <p className="text-blue-600">0800-ETIKA-001</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
