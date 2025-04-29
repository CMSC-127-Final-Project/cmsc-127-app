'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { createClient } from '@/utils/supabase/client';
import { User } from '@/utils/types';

export function EditClientProfile() {
  const searchParams = useSearchParams();
  const auth_id = searchParams.get('user_ID');
  const [user, setUser] = useState<User | null>(null);
  const { toast } = useToast();

  const [fname, setFname] = useState('');
  const [lname, setLname] = useState('');
  const [email, setEmail] = useState('');
  const [dept, setDept] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState('');
  const [rank, setRank] = useState('');
  const [instructorOffice, setInstructorOffice] = useState('');
  const [nickname, setNickname] = useState('');
  const [idnumber, setIdnumber] = useState<string | undefined>(undefined);

  const [originalFname, setOriginalFname] = useState('');
  const [originalLname, setOriginalLname] = useState('');
  const [originalIdnumber, setOriginalIdnumber] = useState('');
  const [originalEmail, setOriginalEmail] = useState('');
  const [originalDept, setOriginalDept] = useState('');
  const [originalRank, setOriginalRank] = useState('');
  const [originalInstructorOffice, setOriginalInstructorOffice] = useState('');
  const [originalNickname, setOriginalNickname] = useState('');
  const [originalPhone, setOriginalPhone] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const loadUserDetails = async () => {
      try {
        const response = await fetch(`/api/user/${auth_id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch user details');
        }
        const data = await response.json();
        const user = data[0];

        if (!user) {
          throw new Error('No user data found');
        }

        setUser(user);

        setOriginalFname(user.first_name);
        setFname(user.first_name);
        setOriginalLname(user.last_name);
        setLname(user.last_name);
        setRole(user.role);
        if (user.role === 'Instructor') {
          setOriginalIdnumber(user.instructor_id);
          setIdnumber(user.instructor_id);
        } else if (user.role === 'Student') {
          setOriginalIdnumber(user.student_num);
          setIdnumber(user.student_num);
        }
        setOriginalNickname(user.nickname);
        setNickname(user.nickname);
        setOriginalEmail(user.email);
        setEmail(user.email);
        setOriginalDept(user.dept);
        setDept(user.dept);
        setOriginalPhone(user.phone);
        setPhone(user.phone);
        setOriginalNickname(user.nickname || '');
        setNickname(user.nickname || '');

        if (user.role === 'Instructor') {
          setOriginalInstructorOffice(user.instructor_office || '');
          setInstructorOffice(user.instructor_office || '');
          setOriginalRank(user.instructor_rank || '');
          setRank(user.instructor_rank || '');
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

    if (auth_id) {
      loadUserDetails();
    }
  }, [auth_id, toast]);

  const handleSaveChanges = async () => {
    setIsSaving(true);

    const updates: {
      first_name?: string;
      last_name?: string;
      id_number?: string;
      instructor_rank?: string;
      email?: string;
      instructor_office?: string;
      dept?: string;
      nickname?: string;
      phone?: string;
    } = {};
    if (fname !== originalFname) updates.first_name = fname;
    if (lname !== originalLname) updates.last_name = lname;
    if (idnumber !== originalIdnumber) updates.id_number = idnumber;
    if (email !== originalEmail) updates.email = email;
    if (dept !== originalDept) updates.dept = dept;
    if (nickname !== originalNickname) updates.nickname = nickname;
    if (phone !== originalPhone) updates.phone = phone;

    if (user?.role === 'Instructor') {
      if (instructorOffice !== originalInstructorOffice) {
        updates.instructor_office = instructorOffice;
      }
      if (rank !== originalRank) updates.instructor_rank = rank;
    }

    if (Object.keys(updates).length === 0) {
      toast({
        title: 'Error',
        description: 'No changes to save.',
      });
      setIsSaving(false);
      return;
    }

    try {
      const response = await fetch(`/api/user/update/${auth_id}`, {
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
      setOriginalFname(fname);
      setOriginalLname(lname);
      setOriginalIdnumber(idnumber || '');
      setOriginalEmail(email);
      setOriginalDept(dept);
      setOriginalNickname(nickname);
      setOriginalPhone(phone || '');

      if (user?.role === 'Instructor') {
        setOriginalInstructorOffice(user.instructor_office || '');
        setOriginalRank(user.instructor_rank || '');
      }
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

  return (
    <div className="items-center justify-center">
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
      <Card className="mt-5">
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                placeholder={fname || ''}
                onChange={e => setFname(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                placeholder={lname || ''}
                onChange={e => setLname(e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="idnumber">
                {role === 'Instructor' ? 'Instructor ID' : 'Student Number'}
              </Label>
              <Input
                id="idnumber"
                placeholder={idnumber || ''}
                onChange={e => setIdnumber(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder={email}
                onChange={e => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="nickname">Nickname</Label>
              <Input
                id="nickname"
                placeholder={nickname || ''}
                onChange={e => setNickname(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                type="tel"
                placeholder={phone || ''}
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
                  defaultValue={rank}
                  onChange={e => setRank(e.target.value)}
                  className="block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#6b1d1d] transition-colors duration-200"
                >
                  <option value="" disabled>
                    Select rank
                  </option>
                  <option value="lecturer">Lecturer</option>
                  <option value="asstprof">Assistant Professor</option>
                  <option value="asscprof">Associate Professor</option>
                  <option value="professor">Professor</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="instructorOffice">Instructor Office</Label>
                <Input
                  id="instructorOffice"
                  placeholder={instructorOffice || ''}
                  onChange={e => setInstructorOffice(e.target.value)}
                />
              </div>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="department">Department</Label>
            <select
              id="department"
              defaultValue={dept}
              onChange={e => setDept(e.target.value)}
              className="block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#6b1d1d] transition-colors duration-200"
            >
              <option value="" disabled>
                Select department
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
    </div>
  );
}

export function SetPassword() {
  const searchParams = useSearchParams();
  const auth_id = searchParams.get('user_ID');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleChangePassword = async () => {
    const supabase = createClient();

    const {
      data: { session },
    } = await supabase.auth.getSession();

    try {
      if (!newPassword || !confirmPassword) {
        toast({ title: 'Error', description: 'Please fill in all fields.' });
        return;
      }
      if (newPassword.length < 6) {
        toast({ title: 'Error', description: 'Password must be at least 6 characters.' });
        return;
      }
      if (newPassword !== confirmPassword) {
        toast({ title: 'Error', description: 'Passwords do not match.' });
        return;
      }
      if (!auth_id) {
        toast({ title: 'Error', description: 'User ID is missing.', variant: 'destructive' });
        return;
      }

      setIsLoading(true);

      const response = await fetch(`/api/user/${auth_id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session?.access_token}`,
        },
        body: JSON.stringify({ newPassword }),
      });

      if (!response.ok) throw new Error('Failed to reset password.');

      toast({ title: 'Success', description: 'Password reset successfully!' });
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      toast({
        title: 'Error',
        description: err instanceof Error ? err.message : 'Failed to reset password.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Change Password</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
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
          <Button
            className="bg-[#6b1d1d] hover:bg-[#5a1818]"
            onClick={handleChangePassword}
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? 'Resetting...' : 'Reset Password'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
