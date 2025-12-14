import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, LogIn, ArrowLeft, AlertCircle } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Alert, AlertDescription } from './ui/alert';
import { AuthService, ReviewersService } from '../lib/storage';

export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (role === 'admin') {
      // Try to login as admin
      const user = AuthService.login(email, password);
      if (user && user.role === 'admin') {
        navigate('/admin');
      } else {
        // Check default admin credentials
        if (email === 'admin@university.ac.id' && password === 'admin123') {
          navigate('/admin');
        } else {
          setError('Email atau password admin salah');
        }
      }
    } else {
      // Try to login as reviewer
      const reviewers = ReviewersService.getAll();
      const reviewer = reviewers.find(r => r.email === email && r.password === password);
      if (reviewer) {
        localStorage.setItem('currentReviewer', JSON.stringify(reviewer));
        navigate('/reviewer');
      } else {
        // Demo mode - allow any credentials
        if (email && password) {
          navigate('/reviewer');
        } else {
          setError('Email atau password reviewer salah');
        }
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center p-4">
      <Card className="max-w-md w-full p-8">
        <Button variant="ghost" onClick={() => navigate('/')} className="mb-4">
          <ArrowLeft className="size-4 mr-2" />
          Kembali
        </Button>

        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-blue-800 rounded-lg flex items-center justify-center mx-auto mb-4">
            <Shield className="size-8 text-white" />
          </div>
          <h1 className="text-2xl mb-2 text-gray-900">Login Reviewer</h1>
          <p className="text-gray-500">Akses dashboard untuk meninjau laporan</p>
        </div>

        {error && (
          <Alert className="mb-4 bg-red-50 border-red-200">
            <AlertCircle className="size-4 text-red-600" />
            <AlertDescription className="text-red-600">{error}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <Label htmlFor="role">Role</Label>
            <Select value={role} onValueChange={setRole} required>
              <SelectTrigger id="role">
                <SelectValue placeholder="Pilih role Anda" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="reviewer">Reviewer / Dosen</SelectItem>
                <SelectItem value="admin">Administrator</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="email@university.ac.id"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white">
            <LogIn className="size-4 mr-2" />
            Login
          </Button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-500 space-y-1">
          <p><strong>Admin:</strong> admin@university.ac.id / admin123</p>
          <p><strong>Reviewer:</strong> gunakan email reviewer yang terdaftar</p>
        </div>
      </Card>
    </div>
  );
}
