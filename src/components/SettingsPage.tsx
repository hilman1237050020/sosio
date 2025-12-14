import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, ArrowLeft, User, Lock, Bell, Save, CheckCircle, AlertCircle } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Switch } from './ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Alert, AlertDescription } from './ui/alert';
import { ReviewersService, UserSettingsService, UserSettings, Reviewer } from '../lib/storage';

export default function SettingsPage() {
  const navigate = useNavigate();

  // Profile data
  const [profile, setProfile] = useState<Reviewer | null>(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  // Password settings
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Notification settings
  const [settings, setSettings] = useState<UserSettings | null>(null);

  // Feedback messages
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    // Load profile
    const currentReviewerData = localStorage.getItem('currentReviewer');
    if (currentReviewerData) {
      const reviewer = JSON.parse(currentReviewerData);
      setProfile(reviewer);
      setName(reviewer.name || '');
      setEmail(reviewer.email || '');
      setPhone((reviewer as any).phone || '');
    } else {
      // Fallback to first reviewer
      const reviewers = ReviewersService.getAll();
      if (reviewers.length > 0) {
        setProfile(reviewers[0]);
        setName(reviewers[0].name);
        setEmail(reviewers[0].email);
        setPhone((reviewers[0] as any).phone || '');
      }
    }

    // Load settings
    setSettings(UserSettingsService.getSettings());
  };

  const showSuccess = (message: string) => {
    setSuccessMessage(message);
    setErrorMessage('');
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const showError = (message: string) => {
    setErrorMessage(message);
    setSuccessMessage('');
    setTimeout(() => setErrorMessage(''), 3000);
  };

  const handleSaveAccount = () => {
    if (!profile) return;

    // Update reviewer in localStorage
    const updated = ReviewersService.update(profile.id, {
      name,
      email,
    });

    if (updated) {
      // Also update the phone in the local data
      const reviewers = JSON.parse(localStorage.getItem('sosio_reviewers') || '[]');
      const index = reviewers.findIndex((r: any) => r.id === profile.id);
      if (index !== -1) {
        reviewers[index].phone = phone;
        localStorage.setItem('sosio_reviewers', JSON.stringify(reviewers));
      }

      // Update currentReviewer
      const updatedProfile = { ...profile, name, email, phone };
      localStorage.setItem('currentReviewer', JSON.stringify(updatedProfile));
      setProfile(updatedProfile as any);

      showSuccess('Informasi akun berhasil diperbarui!');
    } else {
      showError('Gagal menyimpan perubahan');
    }
  };

  const handleChangePassword = () => {
    if (!profile) return;

    if (newPassword !== confirmPassword) {
      showError('Password baru tidak cocok!');
      return;
    }

    if (newPassword.length < 6) {
      showError('Password minimal 6 karakter!');
      return;
    }

    // Verify current password and update
    const reviewers = JSON.parse(localStorage.getItem('sosio_reviewers') || '[]');
    const index = reviewers.findIndex((r: any) => r.id === profile.id);

    if (index !== -1 && reviewers[index].password === currentPassword) {
      reviewers[index].password = newPassword;
      localStorage.setItem('sosio_reviewers', JSON.stringify(reviewers));

      showSuccess('Password berhasil diubah!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } else {
      showError('Password saat ini salah!');
    }
  };

  const handleSaveNotifications = () => {
    if (!settings) return;
    UserSettingsService.saveSettings(settings);
    showSuccess('Pengaturan notifikasi berhasil disimpan!');
  };

  const updateSetting = (key: keyof UserSettings, value: any) => {
    if (!settings) return;
    setSettings({ ...settings, [key]: value });
  };

  if (!profile || !settings) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center">
        <Card className="p-8 text-center">
          <p className="text-gray-600 mb-4">Memuat data...</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Header */}
      <div className="bg-white border-b shadow-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Button variant="ghost" onClick={() => navigate(-1)} className="mb-4">
            <ArrowLeft className="size-4 mr-2" />
            Kembali
          </Button>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-800 rounded-lg flex items-center justify-center">
              <Shield className="size-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl text-gray-900">Pengaturan</h1>
              <p className="text-gray-500">Kelola preferensi akun Anda</p>
            </div>
          </div>
        </div>
      </div>

      {/* Success/Error Messages */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {successMessage && (
          <Alert className="mb-4 bg-green-50 border-green-200">
            <CheckCircle className="size-4 text-green-600" />
            <AlertDescription className="text-green-700">{successMessage}</AlertDescription>
          </Alert>
        )}
        {errorMessage && (
          <Alert className="mb-4 bg-red-50 border-red-200">
            <AlertCircle className="size-4 text-red-600" />
            <AlertDescription className="text-red-700">{errorMessage}</AlertDescription>
          </Alert>
        )}
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Tabs defaultValue="account" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="account">
              <User className="size-4 mr-2" />
              Akun
            </TabsTrigger>
            <TabsTrigger value="security">
              <Lock className="size-4 mr-2" />
              Keamanan
            </TabsTrigger>
            <TabsTrigger value="notifications">
              <Bell className="size-4 mr-2" />
              Notifikasi
            </TabsTrigger>
          </TabsList>

          {/* Account Tab */}
          <TabsContent value="account">
            <Card className="p-8">
              <h3 className="text-xl mb-6 text-gray-900">Informasi Akun</h3>
              <div className="space-y-6">
                <div>
                  <Label htmlFor="name">Nama Lengkap</Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <p className="text-sm text-gray-500 mt-1">Email universitas resmi</p>
                </div>
                <div>
                  <Label htmlFor="phone">Nomor Telepon</Label>
                  <Input
                    id="phone"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>
                <div>
                  <Label>Role</Label>
                  <Input value="Reviewer" disabled />
                  <p className="text-sm text-gray-500 mt-1">Hubungi admin untuk mengubah role</p>
                </div>

                <Button
                  className="bg-blue-600 text-white"
                  onClick={handleSaveAccount}
                >
                  <Save className="size-4 mr-2" />
                  Simpan Perubahan
                </Button>
              </div>
            </Card>
          </TabsContent>

          {/* Security Tab */}
          <TabsContent value="security">
            <Card className="p-8">
              <h3 className="text-xl mb-6 text-gray-900">Keamanan & Password</h3>
              <div className="space-y-6">
                <div>
                  <Label htmlFor="currentPassword">Password Saat Ini</Label>
                  <Input
                    id="currentPassword"
                    type="password"
                    placeholder="••••••••"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="newPassword">Password Baru</Label>
                  <Input
                    id="newPassword"
                    type="password"
                    placeholder="••••••••"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                  <p className="text-sm text-gray-500 mt-1">Minimal 6 karakter</p>
                </div>
                <div>
                  <Label htmlFor="confirmPassword">Konfirmasi Password Baru</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </div>

                <Button
                  className="bg-blue-600 text-white"
                  onClick={handleChangePassword}
                >
                  <Lock className="size-4 mr-2" />
                  Ubah Password
                </Button>
              </div>

              <div className="mt-8 pt-8 border-t">
                <h4 className="text-lg mb-4 text-gray-900">Autentikasi Dua Faktor</h4>
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="text-gray-900 mb-1">Two-Factor Authentication (2FA)</p>
                    <p className="text-sm text-gray-600">Tambahan keamanan untuk akun Anda</p>
                  </div>
                  <Switch
                    checked={settings.twoFactorEnabled}
                    onCheckedChange={(checked) => {
                      updateSetting('twoFactorEnabled', checked);
                      UserSettingsService.saveSettings({ twoFactorEnabled: checked });
                      showSuccess('Pengaturan 2FA berhasil disimpan!');
                    }}
                  />
                </div>
              </div>
            </Card>
          </TabsContent>

          {/* Notifications Tab */}
          <TabsContent value="notifications">
            <Card className="p-8">
              <h3 className="text-xl mb-6 text-gray-900">Preferensi Notifikasi</h3>
              <div className="space-y-6">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="text-gray-900 mb-1">Email Notifications</p>
                    <p className="text-sm text-gray-600">Terima notifikasi melalui email</p>
                  </div>
                  <Switch
                    checked={settings.emailNotif}
                    onCheckedChange={(checked) => updateSetting('emailNotif', checked)}
                  />
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="text-gray-900 mb-1">Kasus Baru Ditugaskan</p>
                    <p className="text-sm text-gray-600">Notifikasi saat ada kasus baru untuk Anda</p>
                  </div>
                  <Switch
                    checked={settings.newCaseNotif}
                    onCheckedChange={(checked) => updateSetting('newCaseNotif', checked)}
                  />
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="text-gray-900 mb-1">Update Status Kasus</p>
                    <p className="text-sm text-gray-600">Notifikasi perubahan status pada kasus Anda</p>
                  </div>
                  <Switch
                    checked={settings.statusUpdateNotif}
                    onCheckedChange={(checked) => updateSetting('statusUpdateNotif', checked)}
                  />
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="text-gray-900 mb-1">Laporan Mingguan</p>
                    <p className="text-sm text-gray-600">Ringkasan aktivitas setiap minggu</p>
                  </div>
                  <Switch
                    checked={settings.weeklyReport}
                    onCheckedChange={(checked) => updateSetting('weeklyReport', checked)}
                  />
                </div>

                <Button
                  className="bg-blue-600 text-white"
                  onClick={handleSaveNotifications}
                >
                  <Save className="size-4 mr-2" />
                  Simpan Preferensi
                </Button>
              </div>

              <div className="mt-8 pt-8 border-t">
                <h4 className="text-lg mb-4 text-gray-900">Quiet Hours</h4>
                <p className="text-sm text-gray-600 mb-4">
                  Atur waktu dimana Anda tidak ingin menerima notifikasi
                </p>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label>Mulai</Label>
                    <Input
                      type="time"
                      value={settings.quietHoursStart}
                      onChange={(e) => updateSetting('quietHoursStart', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label>Selesai</Label>
                    <Input
                      type="time"
                      value={settings.quietHoursEnd}
                      onChange={(e) => updateSetting('quietHoursEnd', e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
