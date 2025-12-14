import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { CheckCircle, Copy, Home, Search, Download } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { toast } from 'sonner';

export default function SuccessPage() {
  const navigate = useNavigate();
  const [reportId, setReportId] = useState('');

  useEffect(() => {
    const id = localStorage.getItem('lastReportId') || 'ETK-' + Math.random().toString(36).substr(2, 9).toUpperCase();
    setReportId(id);
  }, []);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(reportId);
    toast.success('ID Laporan berhasil disalin!');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white flex items-center justify-center p-4">
      <Card className="max-w-2xl w-full p-12 text-center">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="size-12 text-green-600" />
        </div>

        <h1 className="text-3xl mb-4 text-gray-900">Laporan Berhasil Dikirim!</h1>
        
        <p className="text-gray-600 mb-8">
          Terima kasih telah melaporkan pelanggaran. Laporan Anda akan segera ditinjau 
          oleh tim reviewer kami. Berikut adalah ID laporan Anda:
        </p>

        <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-6 mb-8">
          <p className="text-sm text-gray-600 mb-2">ID Laporan Anda</p>
          <div className="flex items-center justify-center gap-3">
            <code className="text-2xl text-blue-600 tracking-wider">
              {reportId}
            </code>
            <Button
              size="sm"
              variant="outline"
              onClick={copyToClipboard}
            >
              <Copy className="size-4" />
            </Button>
          </div>
          <p className="text-xs text-gray-500 mt-3">
            Simpan ID ini untuk melacak status laporan Anda
          </p>
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-8 text-left">
          <h4 className="text-amber-900 mb-2">⚠️ Penting:</h4>
          <ul className="text-sm text-amber-800 space-y-1">
            <li>• Simpan ID laporan ini dengan baik</li>
            <li>• Gunakan ID untuk melacak status laporan Anda</li>
            <li>• Laporan akan ditinjau dalam 1-3 hari kerja</li>
            <li>• Anda akan mendapat update melalui sistem tracking</li>
          </ul>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <Button 
            className="flex-1"
            variant="outline"
            onClick={() => navigate('/lacak')}
          >
            <Search className="size-4 mr-2" />
            Lacak Status Laporan
          </Button>
          <Button 
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
            onClick={() => navigate('/')}
          >
            <Home className="size-4 mr-2" />
            Kembali ke Beranda
          </Button>
        </div>

        <div className="mt-8 pt-8 border-t">
          <p className="text-sm text-gray-500">
            Butuh bantuan? Hubungi kami di{' '}
            <span className="text-blue-600">etika@university.ac.id</span>
          </p>
        </div>
      </Card>
    </div>
  );
}
