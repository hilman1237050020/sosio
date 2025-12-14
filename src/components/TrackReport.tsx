import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, ArrowLeft, Shield, Clock, CheckCircle, AlertCircle, User, Calendar, FileText } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { ReportsService, CategoriesService, Report } from '../lib/storage';

export default function TrackReport() {
  const navigate = useNavigate();
  const [reportId, setReportId] = useState('');
  const [searchResult, setSearchResult] = useState<Report | { notFound: true } | null>(null);

  const getCategoryInfo = (categoryValue: string) => {
    const categories = CategoriesService.getAll();
    const cat = categories.find(c => c.value === categoryValue);
    return cat ? { name: cat.name, color: cat.color } : { name: categoryValue, color: 'bg-gray-100 text-gray-700' };
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const report = ReportsService.getById(reportId.toUpperCase());
    if (report) {
      setSearchResult(report);
    } else {
      setSearchResult({ notFound: true });
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { color: string; icon: any; label: string }> = {
      submitted: { color: 'bg-gray-100 text-gray-700', icon: FileText, label: 'Diterima' },
      assigned: { color: 'bg-blue-100 text-blue-700', icon: User, label: 'Ditugaskan' },
      investigating: { color: 'bg-yellow-100 text-yellow-700', icon: Clock, label: 'Ditinjau' },
      resolved: { color: 'bg-green-100 text-green-700', icon: CheckCircle, label: 'Selesai' }
    };

    const config = statusConfig[status] || statusConfig.submitted;
    const Icon = config.icon;

    return (
      <Badge className={config.color}>
        <Icon className="size-3 mr-1" />
        {config.label}
      </Badge>
    );
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
              <Search className="size-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl text-gray-900">Lacak Status Laporan</h1>
              <p className="text-gray-500">Pantau perkembangan laporan Anda secara real-time</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Search Form */}
        <Card className="p-8 mb-8">
          <form onSubmit={handleSearch}>
            <Label htmlFor="reportId" className="text-lg mb-4 block">
              Masukkan ID Laporan Anda
            </Label>
            <div className="flex gap-3">
              <Input
                id="reportId"
                placeholder="ETK-XXXXXXX"
                value={reportId}
                onChange={(e) => setReportId(e.target.value)}
                className="flex-1 text-lg"
                required
              />
              <Button type="submit" size="lg" className="bg-blue-600 hover:bg-blue-700 text-white">
                <Search className="size-5 mr-2" />
                Lacak
              </Button>
            </div>
            <p className="text-sm text-gray-500 mt-3">
              Gunakan ID yang Anda terima saat mengirim laporan (contoh: ETK-ABC123)
            </p>
          </form>
        </Card>

        {/* Search Result */}
        {searchResult && (
          <>
            {'notFound' in searchResult ? (
              <Card className="p-12 text-center">
                <AlertCircle className="size-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl mb-2 text-gray-900">Laporan Tidak Ditemukan</h3>
                <p className="text-gray-600">
                  ID laporan yang Anda masukkan tidak ditemukan. Pastikan ID sudah benar.
                </p>
              </Card>
            ) : (
              <div className="space-y-6">
                {/* Report Summary */}
                <Card className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <h2 className="text-2xl text-gray-900">{searchResult.id}</h2>
                        {getStatusBadge(searchResult.status)}
                      </div>
                      <Badge className={getCategoryInfo(searchResult.category).color}>
                        {getCategoryInfo(searchResult.category).name}
                      </Badge>
                    </div>
                    <Shield className="size-8 text-blue-600" />
                  </div>

                  <div className="grid md:grid-cols-3 gap-4 mt-6">
                    <div className="flex items-start gap-3">
                      <Calendar className="size-5 text-gray-400 mt-0.5" />
                      <div>
                        <p className="text-sm text-gray-500">Tanggal Laporan</p>
                        <p className="text-gray-900">{new Date(searchResult.createdAt).toLocaleDateString('id-ID')}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <User className="size-5 text-gray-400 mt-0.5" />
                      <div>
                        <p className="text-sm text-gray-500">Status</p>
                        <p className="text-gray-900 capitalize">{searchResult.status}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Clock className="size-5 text-gray-400 mt-0.5" />
                      <div>
                        <p className="text-sm text-gray-500">Update Terakhir</p>
                        <p className="text-gray-900">{new Date(searchResult.updatedAt).toLocaleDateString('id-ID')}</p>
                      </div>
                    </div>
                  </div>
                </Card>

                {/* Description */}
                <Card className="p-6">
                  <h3 className="text-xl mb-4 text-gray-900">Deskripsi Laporan</h3>
                  <p className="text-gray-700 whitespace-pre-wrap">{searchResult.description}</p>
                </Card>

                {/* Status Timeline */}
                <Card className="p-6">
                  <h3 className="text-xl mb-6 text-gray-900">Status Proses</h3>
                  <div className="flex items-center justify-between">
                    {['pending', 'investigating', 'resolved'].map((step, index) => {
                      const isCompleted =
                        step === 'pending' ? true :
                          step === 'investigating' ? ['investigating', 'resolved'].includes(searchResult.status) :
                            step === 'resolved' ? searchResult.status === 'resolved' : false;
                      const labels: Record<string, string> = {
                        pending: 'Diterima',
                        investigating: 'Ditinjau',
                        resolved: 'Selesai'
                      };
                      return (
                        <div key={step} className="flex flex-col items-center flex-1">
                          <div className={`w-12 h-12 rounded-full flex items-center justify-center ${isCompleted ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-400'}`}>
                            {isCompleted ? <CheckCircle className="size-6" /> : <Clock className="size-6" />}
                          </div>
                          <p className={`mt-2 text-sm ${isCompleted ? 'text-gray-900' : 'text-gray-400'}`}>{labels[step]}</p>
                          {index < 2 && <div className={`h-1 w-full ${isCompleted ? 'bg-blue-600' : 'bg-gray-200'}`} />}
                        </div>
                      );
                    })}
                  </div>
                </Card>

                {/* Notes */}
                {searchResult.notes && (
                  <Card className="p-6">
                    <h3 className="text-xl mb-4 text-gray-900">Catatan Reviewer</h3>
                    <p className="text-gray-700">{searchResult.notes}</p>
                  </Card>
                )}

                {/* Help Card */}
                <Card className="p-6 bg-blue-50 border-blue-200">
                  <h4 className="text-gray-900 mb-2">Butuh Informasi Lebih Lanjut?</h4>
                  <p className="text-sm text-gray-600 mb-4">
                    Jika Anda memiliki pertanyaan tentang laporan ini atau ingin memberikan informasi tambahan,
                    silakan hubungi tim reviewer.
                  </p>
                  <div className="flex gap-4 text-sm">
                    <div>
                      <p className="text-gray-700">Email:</p>
                      <p className="text-blue-600">etika@university.ac.id</p>
                    </div>
                    <div>
                      <p className="text-gray-700">Hotline:</p>
                      <p className="text-blue-600">0800-ETIKA-001</p>
                    </div>
                  </div>
                </Card>
              </div>
            )}
          </>
        )}

        {/* Demo Hint */}
        {!searchResult && (
          <Card className="p-6 bg-gray-50 text-center">
            <p className="text-gray-600 mb-2">💡 Coba demo dengan ID:</p>
            <code className="text-blue-600 text-lg">ETK-ABC123</code>
          </Card>
        )}
      </div>
    </div>
  );
}
