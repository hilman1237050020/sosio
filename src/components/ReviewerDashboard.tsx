import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Home, LogOut, Search, Eye, CheckCircle, Clock, AlertTriangle, FileText, User, MessageSquare, RefreshCw, XCircle } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Textarea } from './ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from './ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { ReportsService, CategoriesService, Report, Category } from '../lib/storage';

export default function ReviewerDashboard() {
  const navigate = useNavigate();
  const [reports, setReports] = useState<Report[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [internalNote, setInternalNote] = useState('');
  const [stats, setStats] = useState({ total: 0, pending: 0, investigating: 0, resolved: 0 });

  // Load data
  const loadData = () => {
    const allReports = ReportsService.getAll();
    setReports(allReports);
    setCategories(CategoriesService.getAll());
    setStats({
      total: allReports.length,
      pending: allReports.filter(r => r.status === 'pending').length,
      investigating: allReports.filter(r => r.status === 'investigating').length,
      resolved: allReports.filter(r => r.status === 'resolved').length,
    });
  };

  useEffect(() => {
    loadData();
  }, []);

  const getCategoryInfo = (categoryValue: string) => {
    const cat = categories.find(c => c.value === categoryValue);
    return cat ? { name: cat.name, color: cat.color } : { name: categoryValue, color: 'bg-gray-100 text-gray-700' };
  };

  const getStatusBadge = (status: string) => {
    const config: Record<string, { color: string; label: string }> = {
      pending: { color: 'bg-yellow-100 text-yellow-700', label: 'Pending' },
      investigating: { color: 'bg-orange-100 text-orange-700', label: 'Ditinjau' },
      resolved: { color: 'bg-green-100 text-green-700', label: 'Selesai' },
      rejected: { color: 'bg-red-100 text-red-700', label: 'Ditolak' }
    };
    return config[status] || config.pending;
  };

  const handleStatusChange = (reportId: string, newStatus: Report['status'], notes?: string) => {
    ReportsService.updateStatus(reportId, newStatus, notes);
    loadData();
    if (selectedReport && selectedReport.id === reportId) {
      setSelectedReport(ReportsService.getById(reportId));
    }
  };

  const handleAddNote = (reportId: string) => {
    if (internalNote.trim()) {
      const report = ReportsService.getById(reportId);
      if (report) {
        const existingNotes = report.notes || '';
        const newNote = `[${new Date().toLocaleString('id-ID')}] ${internalNote}`;
        const updatedNotes = existingNotes ? `${existingNotes}\n\n${newNote}` : newNote;
        ReportsService.update(reportId, { notes: updatedNotes });
        setInternalNote('');
        loadData();
        setSelectedReport(ReportsService.getById(reportId));
      }
    }
  };

  const filteredReports = reports.filter(report => {
    const matchesStatus = filterStatus === 'all' || report.status === filterStatus;
    const matchesCategory = filterCategory === 'all' || report.category === filterCategory;
    const matchesSearch = report.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesCategory && matchesSearch;
  });

  const statsData = [
    { label: 'Total Laporan', value: stats.total.toString(), icon: FileText, color: 'bg-blue-100 text-blue-700' },
    { label: 'Pending', value: stats.pending.toString(), icon: Clock, color: 'bg-yellow-100 text-yellow-700' },
    { label: 'Sedang Ditinjau', value: stats.investigating.toString(), icon: AlertTriangle, color: 'bg-orange-100 text-orange-700' },
    { label: 'Selesai', value: stats.resolved.toString(), icon: CheckCircle, color: 'bg-green-100 text-green-700' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 h-full w-64 bg-white border-r p-6 overflow-y-auto">
        <div className="flex items-center gap-2 mb-8">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-800 rounded-lg flex items-center justify-center">
            <Shield className="size-6 text-white" />
          </div>
          <div>
            <h2 className="text-gray-900">ETIKA-CAMPUS</h2>
            <p className="text-xs text-gray-500">Reviewer Dashboard</p>
          </div>
        </div>

        <div className="space-y-2 mb-8">
          <Button variant="default" className="w-full justify-start bg-blue-600 text-white">
            <FileText className="size-4 mr-2" />
            Laporan
          </Button>
          <Button variant="ghost" className="w-full justify-start" onClick={() => navigate('/profil')}>
            <User className="size-4 mr-2" />
            Profil
          </Button>
        </div>

        <div className="pt-4 border-t">
          <div className="bg-blue-50 p-4 rounded-lg mb-4">
            <p className="text-sm text-gray-700 mb-1">Login sebagai:</p>
            <p className="text-blue-700">Reviewer</p>
          </div>
          <Button variant="ghost" className="w-full justify-start" onClick={() => navigate('/')}>
            <Home className="size-4 mr-2" />
            Beranda
          </Button>
          <Button variant="ghost" className="w-full justify-start text-red-600" onClick={() => navigate('/')}>
            <LogOut className="size-4 mr-2" />
            Logout
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="ml-64 p-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl mb-2 text-gray-900">Dashboard Reviewer</h1>
            <p className="text-gray-500">Kelola dan tinjau laporan pelanggaran etika teknologi</p>
          </div>
          <Button variant="outline" onClick={loadData}>
            <RefreshCw className="size-4 mr-2" />
            Refresh
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {statsData.map((stat, index) => (
            <Card key={index} className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 mb-1">{stat.label}</p>
                  <p className="text-3xl text-gray-900">{stat.value}</p>
                </div>
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${stat.color}`}>
                  <stat.icon className="size-6" />
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Filters */}
        <Card className="p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="size-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <Input
                  placeholder="Cari berdasarkan ID atau deskripsi..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="investigating">Sedang Ditinjau</SelectItem>
                <SelectItem value="resolved">Selesai</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterCategory} onValueChange={setFilterCategory}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Kategori" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Kategori</SelectItem>
                {categories.map(cat => (
                  <SelectItem key={cat.id} value={cat.value}>{cat.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </Card>

        {/* Reports Table */}
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="text-left p-4 text-sm text-gray-700">ID Laporan</th>
                  <th className="text-left p-4 text-sm text-gray-700">Kategori</th>
                  <th className="text-left p-4 text-sm text-gray-700">Status</th>
                  <th className="text-left p-4 text-sm text-gray-700">Tanggal</th>
                  <th className="text-left p-4 text-sm text-gray-700">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filteredReports.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-gray-500">
                      Belum ada laporan. Laporan akan muncul di sini setelah ada yang mengirim laporan.
                    </td>
                  </tr>
                ) : (
                  filteredReports.map((report) => (
                    <tr key={report.id} className="border-b hover:bg-gray-50">
                      <td className="p-4">
                        <code className="text-blue-600">{report.id}</code>
                      </td>
                      <td className="p-4">
                        <Badge className={getCategoryInfo(report.category).color}>
                          {getCategoryInfo(report.category).name}
                        </Badge>
                      </td>
                      <td className="p-4">
                        <Badge className={getStatusBadge(report.status).color}>
                          {getStatusBadge(report.status).label}
                        </Badge>
                      </td>
                      <td className="p-4 text-gray-600">{new Date(report.createdAt).toLocaleDateString('id-ID')}</td>
                      <td className="p-4">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => setSelectedReport(report)}
                            >
                              <Eye className="size-4 mr-1" />
                              Detail
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                            <DialogHeader>
                              <DialogTitle>Detail Laporan {report.id}</DialogTitle>
                            </DialogHeader>

                            {selectedReport && (
                              <Tabs defaultValue="info" className="mt-4">
                                <TabsList className="grid w-full grid-cols-2">
                                  <TabsTrigger value="info">Informasi</TabsTrigger>
                                  <TabsTrigger value="notes">Catatan & Aksi</TabsTrigger>
                                </TabsList>

                                <TabsContent value="info" className="space-y-4">
                                  <div className="grid grid-cols-2 gap-4">
                                    <div>
                                      <Label>ID Laporan</Label>
                                      <p className="text-gray-900">{selectedReport.id}</p>
                                    </div>
                                    <div>
                                      <Label>Kategori</Label>
                                      <p><Badge className={getCategoryInfo(selectedReport.category).color}>{getCategoryInfo(selectedReport.category).name}</Badge></p>
                                    </div>
                                    <div>
                                      <Label>Status</Label>
                                      <p><Badge className={getStatusBadge(selectedReport.status).color}>
                                        {getStatusBadge(selectedReport.status).label}
                                      </Badge></p>
                                    </div>
                                    <div>
                                      <Label>Tanggal Laporan</Label>
                                      <p className="text-gray-900">{new Date(selectedReport.createdAt).toLocaleString('id-ID')}</p>
                                    </div>
                                    <div>
                                      <Label>Pelapor</Label>
                                      <p className="text-gray-900">{selectedReport.isAnonymous ? 'Anonim' : (selectedReport.reporterName || 'Tidak disebutkan')}</p>
                                    </div>
                                    <div>
                                      <Label>Email Pelapor</Label>
                                      <p className="text-gray-900">{selectedReport.isAnonymous ? '-' : (selectedReport.reporterEmail || '-')}</p>
                                    </div>
                                  </div>

                                  <div>
                                    <Label>Deskripsi Lengkap</Label>
                                    <p className="text-gray-700 mt-2 whitespace-pre-wrap bg-gray-50 p-4 rounded-lg">{selectedReport.description}</p>
                                  </div>
                                </TabsContent>

                                <TabsContent value="notes" className="space-y-4">
                                  <div>
                                    <Label>Ubah Status</Label>
                                    <div className="flex flex-wrap gap-2 mt-2">
                                      <Button
                                        size="sm"
                                        variant="outline"
                                        className="bg-yellow-50"
                                        onClick={() => handleStatusChange(selectedReport.id, 'pending')}
                                      >
                                        <Clock className="size-4 mr-2" />
                                        Pending
                                      </Button>
                                      <Button
                                        size="sm"
                                        variant="outline"
                                        className="bg-orange-50"
                                        onClick={() => handleStatusChange(selectedReport.id, 'investigating')}
                                      >
                                        <AlertTriangle className="size-4 mr-2" />
                                        Investigating
                                      </Button>
                                      <Button
                                        size="sm"
                                        variant="outline"
                                        className="bg-green-50"
                                        onClick={() => handleStatusChange(selectedReport.id, 'resolved')}
                                      >
                                        <CheckCircle className="size-4 mr-2" />
                                        Resolved
                                      </Button>
                                      <Button
                                        size="sm"
                                        variant="outline"
                                        className="bg-red-50"
                                        onClick={() => handleStatusChange(selectedReport.id, 'rejected')}
                                      >
                                        <XCircle className="size-4 mr-2" />
                                        Rejected
                                      </Button>
                                    </div>
                                  </div>

                                  <div>
                                    <Label>Tambah Catatan</Label>
                                    <Textarea
                                      placeholder="Tulis catatan untuk laporan ini..."
                                      rows={4}
                                      value={internalNote}
                                      onChange={(e) => setInternalNote(e.target.value)}
                                      className="mt-2"
                                    />
                                    <Button
                                      className="mt-2 bg-blue-600 text-white"
                                      onClick={() => handleAddNote(selectedReport.id)}
                                    >
                                      <MessageSquare className="size-4 mr-2" />
                                      Simpan Catatan
                                    </Button>
                                  </div>

                                  {selectedReport.notes && (
                                    <div className="mt-6">
                                      <Label>Riwayat Catatan</Label>
                                      <div className="bg-gray-50 p-4 rounded-lg mt-2 whitespace-pre-wrap text-sm text-gray-700">
                                        {selectedReport.notes}
                                      </div>
                                    </div>
                                  )}
                                </TabsContent>
                              </Tabs>
                            )}
                          </DialogContent>
                        </Dialog>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </main>
    </div>
  );
}
