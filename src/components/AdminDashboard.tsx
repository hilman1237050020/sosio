import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Home, LogOut, Users, TrendingUp, Settings, BarChart3, PlusCircle, Edit, Trash2, Eye, RefreshCw } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from './ui/dialog';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { ReportsService, ReviewersService, CategoriesService, Reviewer, Category, initializeStorage } from '../lib/storage';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [reviewers, setReviewers] = useState<Reviewer[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [stats, setStats] = useState({ total: 0, pending: 0, investigating: 0, resolved: 0, rejected: 0 });

  // Form states
  const [newReviewerName, setNewReviewerName] = useState('');
  const [newReviewerEmail, setNewReviewerEmail] = useState('');
  const [newReviewerPassword, setNewReviewerPassword] = useState('');
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategoryIcon, setNewCategoryIcon] = useState('');
  const [newCategoryColor, setNewCategoryColor] = useState('bg-blue-100 text-blue-700');

  // Load data
  const loadData = () => {
    initializeStorage();
    setReviewers(ReviewersService.getAll());
    setCategories(CategoriesService.getAll());
    setStats(ReportsService.getStats());
  };

  useEffect(() => {
    loadData();
  }, []);

  // Generate chart data from actual stats
  const categoryData = categories.map(cat => ({
    name: cat.name,
    value: cat.reportCount,
    color: cat.color.includes('red') ? '#ef4444' :
      cat.color.includes('orange') ? '#f97316' :
        cat.color.includes('yellow') ? '#eab308' :
          cat.color.includes('pink') ? '#ec4899' :
            cat.color.includes('purple') ? '#a855f7' : '#3b82f6'
  }));

  const statusData = [
    { status: 'Pending', count: stats.pending },
    { status: 'Investigating', count: stats.investigating },
    { status: 'Resolved', count: stats.resolved }
  ];

  // Handlers
  const handleAddReviewer = () => {
    if (newReviewerName && newReviewerEmail && newReviewerPassword) {
      ReviewersService.create({
        name: newReviewerName,
        email: newReviewerEmail,
        password: newReviewerPassword,
        status: 'active'
      });
      setNewReviewerName('');
      setNewReviewerEmail('');
      setNewReviewerPassword('');
      loadData();
    }
  };

  const handleDeleteReviewer = (id: string) => {
    ReviewersService.delete(id);
    loadData();
  };

  const handleToggleReviewerStatus = (id: string) => {
    ReviewersService.toggleStatus(id);
    loadData();
  };

  const handleAddCategory = () => {
    if (newCategoryName && newCategoryIcon) {
      CategoriesService.create({
        name: newCategoryName,
        value: newCategoryName.toLowerCase().replace(/\s+/g, '-'),
        icon: newCategoryIcon,
        color: newCategoryColor,
        reportCount: 0
      });
      setNewCategoryName('');
      setNewCategoryIcon('');
      loadData();
    }
  };

  const handleDeleteCategory = (id: string) => {
    CategoriesService.delete(id);
    loadData();
  };

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
            <p className="text-xs text-gray-500">Admin Dashboard</p>
          </div>
        </div>

        <div className="space-y-2 mb-8">
          <Button
            variant={activeTab === 'overview' ? 'default' : 'ghost'}
            className={`w-full justify-start ${activeTab === 'overview' ? 'bg-blue-600 text-white' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            <BarChart3 className="size-4 mr-2" />
            Overview
          </Button>
          <Button
            variant={activeTab === 'reviewers' ? 'default' : 'ghost'}
            className={`w-full justify-start ${activeTab === 'reviewers' ? 'bg-blue-600 text-white' : ''}`}
            onClick={() => setActiveTab('reviewers')}
          >
            <Users className="size-4 mr-2" />
            Reviewers
          </Button>
          <Button
            variant={activeTab === 'categories' ? 'default' : 'ghost'}
            className={`w-full justify-start ${activeTab === 'categories' ? 'bg-blue-600 text-white' : ''}`}
            onClick={() => setActiveTab('categories')}
          >
            <Settings className="size-4 mr-2" />
            Kategori
          </Button>
        </div>

        <div className="pt-4 border-t">
          <div className="bg-blue-50 p-4 rounded-lg mb-4">
            <p className="text-sm text-gray-700 mb-1">Login sebagai:</p>
            <p className="text-blue-700">Admin System</p>
            <p className="text-xs text-gray-500">Administrator</p>
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
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <>
            <div className="mb-8 flex items-center justify-between">
              <div>
                <h1 className="text-3xl mb-2 text-gray-900">Dashboard Administrator</h1>
                <p className="text-gray-500">Kelola sistem dan analisis tren pelanggaran</p>
              </div>
              <Button variant="outline" onClick={loadData}>
                <RefreshCw className="size-4 mr-2" />
                Refresh
              </Button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <Card className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Total Laporan</p>
                    <p className="text-3xl text-gray-900">{stats.total}</p>
                  </div>
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <TrendingUp className="size-6 text-blue-600" />
                  </div>
                </div>
              </Card>
              <Card className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Pending</p>
                    <p className="text-3xl text-gray-900">{stats.pending}</p>
                  </div>
                  <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                    <BarChart3 className="size-6 text-yellow-600" />
                  </div>
                </div>
              </Card>
              <Card className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Reviewers Aktif</p>
                    <p className="text-3xl text-gray-900">{reviewers.filter(r => r.status === 'active').length}</p>
                    <p className="text-xs text-gray-500 mt-1">dari {reviewers.length} total</p>
                  </div>
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <Users className="size-6 text-green-600" />
                  </div>
                </div>
              </Card>
              <Card className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Resolved</p>
                    <p className="text-3xl text-gray-900">{stats.resolved}</p>
                  </div>
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <TrendingUp className="size-6 text-green-600" />
                  </div>
                </div>
              </Card>
            </div>

            {/* Charts */}
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <Card className="p-6">
                <h3 className="text-lg mb-4 text-gray-900">Distribusi Kategori</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </Card>

              <Card className="p-6">
                <h3 className="text-lg mb-4 text-gray-900">Status Laporan</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={statusData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="status" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="count" fill="#3b82f6" />
                  </BarChart>
                </ResponsiveContainer>
              </Card>
            </div>
          </>
        )}

        {/* Reviewers Tab */}
        {activeTab === 'reviewers' && (
          <>
            <div className="mb-8 flex items-center justify-between">
              <div>
                <h1 className="text-3xl mb-2 text-gray-900">Manajemen Reviewer</h1>
                <p className="text-gray-500">Kelola akun dan status reviewer</p>
              </div>
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="bg-blue-600 text-white">
                    <PlusCircle className="size-4 mr-2" />
                    Tambah Reviewer
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Tambah Reviewer Baru</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 mt-4">
                    <div>
                      <Label>Nama Lengkap</Label>
                      <Input
                        placeholder="Dr. Nama Lengkap"
                        value={newReviewerName}
                        onChange={(e) => setNewReviewerName(e.target.value)}
                      />
                    </div>
                    <div>
                      <Label>Email</Label>
                      <Input
                        type="email"
                        placeholder="email@university.ac.id"
                        value={newReviewerEmail}
                        onChange={(e) => setNewReviewerEmail(e.target.value)}
                      />
                    </div>
                    <div>
                      <Label>Password</Label>
                      <Input
                        type="password"
                        placeholder="••••••••"
                        value={newReviewerPassword}
                        onChange={(e) => setNewReviewerPassword(e.target.value)}
                      />
                    </div>
                    <DialogClose asChild>
                      <Button className="w-full bg-blue-600 text-white" onClick={handleAddReviewer}>
                        Tambah Reviewer
                      </Button>
                    </DialogClose>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <Card className="overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="text-left p-4 text-sm text-gray-700">Nama</th>
                    <th className="text-left p-4 text-sm text-gray-700">Email</th>
                    <th className="text-left p-4 text-sm text-gray-700">Kasus Ditangani</th>
                    <th className="text-left p-4 text-sm text-gray-700">Status</th>
                    <th className="text-left p-4 text-sm text-gray-700">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {reviewers.map((reviewer) => (
                    <tr key={reviewer.id} className="border-b hover:bg-gray-50">
                      <td className="p-4 text-gray-900">{reviewer.name}</td>
                      <td className="p-4 text-gray-600">{reviewer.email}</td>
                      <td className="p-4">
                        <Badge className="bg-blue-100 text-blue-700">{reviewer.cases} kasus</Badge>
                      </td>
                      <td className="p-4">
                        <Badge className={reviewer.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}>
                          {reviewer.status === 'active' ? 'Aktif' : 'Non-aktif'}
                        </Badge>
                      </td>
                      <td className="p-4">
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" onClick={() => handleToggleReviewerStatus(reviewer.id)}>
                            <Edit className="size-4" />
                          </Button>
                          <Button size="sm" variant="outline" className="text-red-600" onClick={() => handleDeleteReviewer(reviewer.id)}>
                            <Trash2 className="size-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Card>
          </>
        )}

        {/* Categories Tab */}
        {activeTab === 'categories' && (
          <>
            <div className="mb-8 flex items-center justify-between">
              <div>
                <h1 className="text-3xl mb-2 text-gray-900">Manajemen Kategori</h1>
                <p className="text-gray-500">Kelola kategori pelanggaran</p>
              </div>
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="bg-blue-600 text-white">
                    <PlusCircle className="size-4 mr-2" />
                    Tambah Kategori
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Tambah Kategori Baru</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 mt-4">
                    <div>
                      <Label>Nama Kategori</Label>
                      <Input
                        placeholder="Nama kategori pelanggaran"
                        value={newCategoryName}
                        onChange={(e) => setNewCategoryName(e.target.value)}
                      />
                    </div>
                    <div>
                      <Label>Icon (Emoji)</Label>
                      <Input
                        placeholder="📝"
                        value={newCategoryIcon}
                        onChange={(e) => setNewCategoryIcon(e.target.value)}
                      />
                    </div>
                    <div>
                      <Label>Warna</Label>
                      <Input
                        placeholder="bg-red-100 text-red-700"
                        value={newCategoryColor}
                        onChange={(e) => setNewCategoryColor(e.target.value)}
                      />
                    </div>
                    <DialogClose asChild>
                      <Button className="w-full bg-blue-600 text-white" onClick={handleAddCategory}>
                        Tambah Kategori
                      </Button>
                    </DialogClose>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {categories.map((category) => (
                <Card key={category.id} className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="text-4xl">{category.icon}</div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" className="text-red-600" onClick={() => handleDeleteCategory(category.id)}>
                        <Trash2 className="size-4" />
                      </Button>
                    </div>
                  </div>
                  <h3 className="text-lg mb-2 text-gray-900">{category.name}</h3>
                  <Badge className={category.color}>
                    {category.reportCount} laporan
                  </Badge>
                </Card>
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  );
}
