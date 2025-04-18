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

export default function Settings({ user_id }: { user_id: string }) {
  const searchParams = useSearchParams();
  const defaultTab = searchParams.get('tab') || 'personal';

  const [activeTab, setActiveTab] = useState(defaultTab);

  const [fname, setFname] = useState('');
  const [lname, setLname] = useState('');
  const [idnumber, setIdnumber] = useState('');
  const [nickname, setNickname] = useState('');
  const [email, setEmail] = useState('');
  const [department, setDepartment] = useState('');
  const [role, setRole] = useState('');
  const [facultyRank, setFacultyRank] = useState('');
  const [instructorOffice, setInstructorOffice] = useState('');

  useEffect(() => {
    const loadUserDetails = async () => {
      try {
        const response = await fetch(`/api/user/${user_id}`);
        const data = await response.json();

        const user = data[0];

        setFname(user.first_name || 'User');
        setLname(user.last_name || 'OO');
        setIdnumber(user.student_num || '20XX-XXXXX');
        setNickname(user.nickname || 'Isko');
        setEmail(user.email || 'example@email.com');
        setDepartment(user.dept || 'Department');
        setRole(user.role || 'student');

        if (user.role === 'Instructor') {
          setFacultyRank(user.faculty_rank || '');
          setInstructorOffice(user.instructor_office || '');
        }
        console.log('User role:', user.role);
      } catch (err) {
        console.error('Internal Server Error:', err);
      }
    };

    loadUserDetails();
  }, [user_id]);

  return (
    <div>
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-3 mb-4">
          <TabsTrigger value="personal">Personal Information</TabsTrigger>
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
                  <Input id="nickname" placeholder={nickname} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input id="phone" type="tel" placeholder="(555) 123-4567" />
                </div>
              </div>

              {role === 'Instructor' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="facultyRank">Faculty Rank</Label>
                    <select
                      id="facultyRank"
                      defaultValue={department}
                      className="block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#6b1d1d] transition-colors duration-200"
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
                    <Input id="instructorOffice" placeholder={instructorOffice} />
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="department">Department</Label>
                <select
                  id="department"
                  defaultValue={department}
                  className="block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#6b1d1d] transition-colors duration-200"
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
                <Button className="bg-[#6b1d1d] hover:bg-[#5a1818]">Save Changes</Button>
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
                <Input id="currentPassword" type="password" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="newPassword">New Password</Label>
                <Input id="newPassword" type="password" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                <Input id="confirmPassword" type="password" />
              </div>

              <div className="flex justify-end">
                <Button className="bg-[#6b1d1d] hover:bg-[#5a1818]">Update Password</Button>
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
