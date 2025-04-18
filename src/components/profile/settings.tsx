'use client';

import { useState, useEffect } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useSearchParams } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';

export default function Settings({ user_id }: { user_id: string }) {
  const searchParams = useSearchParams();
  const defaultTab = searchParams.get('tab') || 'personal';

  useEffect(() => {
    setActiveTab(defaultTab);
  }, [defaultTab]);

  const [activeTab, setActiveTab] = useState(defaultTab);
  const [fname, setFname] = useState('');
  const [lname, setLname] = useState('');
  const [email, setEmail] = useState('');
  const [department, setDepartment] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState('');
  const [instructorOffice, setInstructorOffice] = useState('');
  const [nickname, setNickname] = useState('');
  const [idnumber, setIdnumber] = useState();
  const [originalNickname, setOriginalNickname] = useState('');
  const [originalPhone, setOriginalPhone] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    const loadUserDetails = async () => {
      try {
        const response = await fetch(`/api/user/${user_id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch user details');
        }
        const data = await response.json();
        const user = data[0];

        if (!user) {
          throw new Error('No user data found');
        }

        setFname(user.first_name || 'User');
        setLname(user.last_name || 'OO');
        setIdnumber(user.student_num || '20XX-XXXXX');
        setNickname(user.nickname || 'Isko');
        setEmail(user.email || 'example@email.com');
        setDepartment(user.dept || 'Department');
        setPhone(data[0].phone || '09123456789');
        setRole(user.role || 'student');
        setOriginalNickname(user.nickname || '');
        setOriginalPhone(user.phone || '');

        if (user.role === 'Instructor') {
          setInstructorOffice(user.instructor_office || '');
        }
        console.log('User role:', user.role);
      } catch (err) {
        console.error('Error loading user details:', err);
        toast({
          title: 'Error',
          description: 'Failed to load user details. Please try again later.',
          variant: 'destructive',
        });
      }
    };

    if (user_id) {
      loadUserDetails();
    }
  }, [user_id, toast]);

  const handleSaveChanges = async () => {
    setIsSaving(true);

    const updates: {
      nickname?: string;
      phone?: string;
    } = {};
    if (nickname !== originalNickname) updates.nickname = nickname;
    if (phone !== originalPhone) updates.phone = phone;

    if (Object.keys(updates).length === 0) {
      toast({
        title: 'Error',
        description: 'No changes to save.',
      });
      setIsSaving(false);
      return;
    }

    try {
      const response = await fetch(`/api/user/update`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      });

      const errorData = await response.json();
      if (!response.ok) {
        throw new Error(errorData.error || 'Failed to update user details');
      }

      toast({
        title: 'Success',
        description: 'Profile updated successfully!',
      });
      setOriginalNickname(nickname || '');
      setOriginalPhone(phone || '');
    } catch (err) {
      console.error('Error updating profile:', err);
      toast({
        title: 'Error',
        description: 'Failed to update profile. Please try again later.',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleChangePassword = async () => {
    try {
      if (!currentPassword || !newPassword || !confirmPassword) {
        toast({
          title: 'Error',
          description: 'Please fill in all fields.',
        });
        return;
      }

      if (newPassword !== confirmPassword) {
        toast({
          title: 'Error',
          description: 'New password and confirmation do not match.',
        });
        return;
      }

      const response = await fetch('/api/user/change-password', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ currentPassword, newPassword, confirmPassword }),
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || 'Failed to update password');
      }

      toast({
        title: 'Success',
        description: 'Password updated successfully!',
      });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      console.error('Error updating password:', err);
      if (err instanceof Error) {
        toast({
          title: 'Error',
          description: err.message,
          variant: 'destructive',
        });
      } else {
        toast({
          title: 'Error',
          description: 'Failed to update password. Please try again later.',
        });
      }
    }
  };

  return (
    <div>
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-3 mb-4">
          <TabsTrigger value="personal">Personal</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="preferences">Preferences</TabsTrigger>
        </TabsList>

        <TabsContent value="personal" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Profile Picture</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-4">
                <Avatar className="h-24 w-24">
                  <AvatarImage src="/placeholder.svg?height=96&width=96" alt="Profile picture" />
                  <AvatarFallback>UO</AvatarFallback>
                </Avatar>
                <div className="space-y-2">
                  <Button variant="outline">Upload New Picture</Button>
                  <p className="text-xs text-muted-foreground">
                    Recommended size: 400x400px. Max file size: 2MB.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input id="firstName" placeholder={fname} disabled />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input id="lastName" placeholder={lname} disabled />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="idnumber">
                    {role === 'Instructor' ? 'Instructor ID' : 'Student Number'}
                  </Label>
                  <Input id="idnumber" placeholder={idnumber} disabled />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input id="email" type="email" placeholder={email} disabled />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="nickname">Nickname</Label>
                  <Input
                    id="nickname"
                    placeholder={nickname}
                    onChange={e => setNickname(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder={phone}
                    onChange={e => {
                      if (/^\d*$/.test(e.target.value)) {
                        setPhone(e.target.value);
                      } else {
                        toast({
                          title: 'Error',
                          description: 'Phone number must only contain numbers.',
                          variant: 'destructive',
                        });
                      }
                    }}
                  />
                </div>
              </div>

              {role === 'Instructor' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="facultyRank">Faculty Rank</Label>
                    <select
                      id="facultyRank"
                      value={department}
                      onChange={e => setDepartment(e.target.value)}
                      className="block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#6b1d1d] transition-colors duration-200"
                      disabled
                    >
                      <option value="" disabled>
                        Select your rank
                      </option>
                      <option value="lecturer">Lecturer</option>
                      <option value="asstprof">Assistant Professor</option>
                      <option value="asscprof">Associate Professor</option>
                      <option value="professor">Professor</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="instructorOffice">Instructor Office</Label>
                    <Input id="instructorOffice" placeholder={instructorOffice} disabled />
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="department">Department</Label>
                <select
                  id="department"
                  defaultValue={department}
                  className="block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#6b1d1d] transition-colors duration-200"
                  disabled
                >
                  <option value="" disabled>
                    Select your department
                  </option>
                  <option value="DMPCS">DMPCS</option>
                  <option value="DSFT">DSFT</option>
                  <option value="DBSES">DBSES</option>
                </select>
              </div>

              <div className="flex justify-end">
                <Button
                  className="bg-[#6b1d1d] hover:bg-[#5a1818]"
                  onClick={handleSaveChanges}
                  disabled={isSaving}
                >
                  {isSaving ? 'Saving...' : 'Save Changes'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Change Password</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="currentPassword">Current Password</Label>
                <Input
                  id="currentPassword"
                  type="password"
                  value={currentPassword}
                  onChange={e => setCurrentPassword(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="newPassword">New Password</Label>
                <Input
                  id="newPassword"
                  type="password"
                  value={newPassword}
                  onChange={e => setNewPassword(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                />
              </div>

              <div className="flex justify-end">
                <Button className="bg-[#6b1d1d] hover:bg-[#5a1818]" onClick={handleChangePassword}>
                  Update Password
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="preferences" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Display Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Dark Mode</p>
                  <p className="text-sm text-muted-foreground">
                    Switch between light and dark themes
                  </p>
                </div>
                <Switch />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
