'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { set } from 'date-fns';

export default function EditClientProfile() {
  const searchParams = useSearchParams();
  const auth_id = searchParams.get('user_ID');
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const [fname, setFname] = useState('');
  const [lname, setLname] = useState('');
  const [email, setEmail] = useState('');
  const [department, setDepartment] = useState('');
  const [phone, setPhone] = useState('');
  const [role] = useState('');
  const [rank, setRank] = useState('');
  const [instructorOffice, setInstructorOffice] = useState('');
  const [nickname, setNickname] = useState('');
  const [idnumber, setIdnumber] = useState<string | undefined>(undefined);

  const [originalFname, setOriginalFname] = useState('');
  const [originalLname, setOriginalLname] = useState('');
  const [originalIdnumber, setOriginalIdnumber] = useState('');
  const [originalEmail, setOriginalEmail] = useState('');
  const [originalDepartment, setOriginalDepartment] = useState('');
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

        setOriginalFname(user.first_name || 'User');
        setFname(user.first_name || 'User');
        setOriginalLname(user.last_name || 'OO');
        setLname(user.last_name || 'OO');
        if (user.role === 'Instructor') {
          setOriginalIdnumber(user.instructor_id || '20XX-XXXXX');
          setIdnumber(user.instructor_id || '20XX-XXXXX');
        } else if (user.role === 'Student') {
          setOriginalIdnumber(user.student_num || '20XX-XXXXX');
          setIdnumber(user.student_num || '20XX-XXXXX');
        }
        setOriginalNickname(user.nickname || 'Isko');
        setNickname(user.nickname || 'Isko');
        setOriginalEmail(user.email || 'example@email.com');
        setEmail(user.email || '');
        setOriginalDepartment(user.dept || 'Department');
        setDepartment(user.dept || 'Department');
        setOriginalPhone(user.phone || '09123456789');
        setPhone(user.phone || '09123456789');
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
      instructor_office?: number;
      dept?: string;
      nickname?: string;
      phone?: string;
    } = {};
    if (fname !== originalFname) updates.first_name = fname;
    if (lname !== originalLname) updates.last_name = lname;
    if (idnumber !== originalIdnumber) updates.id_number = idnumber;
    if (email !== originalEmail) updates.email = email;
    if (department !== originalDepartment) updates.dept = department;
    if (nickname !== originalNickname) updates.nickname = nickname;
    if (phone !== originalPhone) updates.phone = phone;

    if (user.role === 'Instructor') {
      if (instructorOffice !== originalInstructorOffice) {
        updates.instructor_office = parseInt(instructorOffice, 10);
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
      setOriginalFname(fname || '');
      setOriginalLname(lname || '');
      setOriginalIdnumber(idnumber || '');
      setOriginalEmail(email || '');
      setOriginalDepartment(department || '');
      setOriginalNickname(nickname || '');
      setOriginalPhone(phone || '');

      if (user.role === 'Instructor') {
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
              <Input id="firstName" value={fname || ''} onChange={e => setFname(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input id="lastName" value={lname || ''} onChange={e => setLname(e.target.value)} />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="idnumber">
                {role === 'Instructor' ? 'Instructor ID' : 'Student Number'}
              </Label>
              <Input id="idnumber" value={idnumber || ''} onChange={e => setIdnumber(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="nickname">Nickname</Label>
              <Input id="nickname" value={nickname || ''} onChange={e => setNickname(e.target.value)} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                type="tel"
                value={phone || ''}
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
              defaultValue={department || ''}
              onChange={e => setDepartment(e.target.value)}
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
