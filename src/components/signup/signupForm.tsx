'use client';

import type React from 'react';

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Icons } from '@/components/icons';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';

export default function SignupForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    fname: '',
    lname: '',
    nickname: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: '',
    studentNumber: '',
    instructorID: '',
    facultyRank: '',
    instructorOffice: '',
    department: '',
  });
  const router = useRouter();
  const { toast } = useToast();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const validateFirstStep = () => {
    if (
      !formData.email ||
      !formData.password ||
      !formData.confirmPassword ||
      !formData.fname ||
      !formData.lname
    ) {
      toast({
        title: 'Error',
        description: 'Please fill in all fields.',
        variant: 'destructive',
      });
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      toast({
        title: 'Error',
        description: 'Passwords do not match.',
        variant: 'destructive',
      });
      return false;
    }

    if (formData.password.length < 8) {
      toast({
        title: 'Error',
        description: 'Password must be at least 8 characters long.',
        variant: 'destructive',
      });
      return false;
    }

    return true;
  };

  const handleNextStep = () => {
    if (validateFirstStep()) {
      setStep(2);
    }
  };

  const handlePrevStep = () => {
    setStep(1);
  };

  async function onSubmit(event: React.SyntheticEvent) {
    event.preventDefault();

    if (step === 1) {
      handleNextStep();
      return;
    }

    if (!formData.role || !formData.department) {
      toast({
        title: 'Error',
        description: 'Please fill in all fields.',
        variant: 'destructive',
      });
      return;
    }

    if (formData.role === 'Student' && !formData.studentNumber) {
      toast({
        title: 'Error',
        description: 'Please enter your student number.',
        variant: 'destructive',
      });
      return;
    }

    if (
      formData.role === 'Instructor' &&
      !formData.instructorID &&
      !formData.instructorOffice &&
      !formData.facultyRank
    ) {
      toast({
        title: 'Error',
        description: 'Please fill in all fields.',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const responseError = await response.json();
        throw {
          error: responseError.error,
          status: responseError.status,
          details: responseError.details,
        };
      }

      router.push('/homepage');
    } catch (er) {
      const { error, details, status } = er as {
        error: string;
        status?: number;
        details?: string;
      };
      toast({
        title: `Uh-oh! Something went wrong (code: ${status})`,
        description: `${error}: ${details}`,
        variant: 'destructive',
      });
      setIsLoading(false);
    }
  }

  return (
    <div className="grid gap-6">
      <form onSubmit={onSubmit} className="overflow-hidden">
        <div className="relative" style={{ height: '450px' }}>
          <AnimatePresence initial={false} mode="wait">
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ x: '-100%', opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: '-100%', opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="grid gap-4"
              >
                <div className="flex gap-4">
                  <div className="grid gap-1 flex-1">
                    <Label htmlFor="fname">First Name</Label>
                    <Input
                      id="fname"
                      name="fname"
                      placeholder="John"
                      type="text"
                      autoCapitalize="none"
                      autoComplete="name"
                      autoCorrect="off"
                      disabled={isLoading}
                      value={formData.fname}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="grid gap-1 flex-1">
                    <Label htmlFor="lname">Last Name</Label>
                    <Input
                      id="lname"
                      name="lname"
                      placeholder="Doe"
                      type="text"
                      autoCapitalize="none"
                      autoComplete="name"
                      autoCorrect="off"
                      disabled={isLoading}
                      value={formData.lname}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="nickname">Nickname</Label>
                  <Input
                    id="nickname"
                    name="nickname"
                    placeholder="Please Enter your Nickname"
                    type="text"
                    autoCapitalize="none"
                    autoComplete="off"
                    autoCorrect="off"
                    disabled={isLoading}
                    required
                    value={formData.nickname}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    placeholder="name@example.com"
                    type="email"
                    autoCapitalize="none"
                    autoComplete="email"
                    autoCorrect="off"
                    disabled={isLoading}
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    name="password"
                    placeholder="••••••••"
                    type="password"
                    autoCapitalize="none"
                    autoComplete="new-password"
                    autoCorrect="off"
                    disabled={isLoading}
                    required
                    value={formData.password}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    placeholder="••••••••"
                    type="password"
                    autoCapitalize="none"
                    autoComplete="new-password"
                    autoCorrect="off"
                    disabled={isLoading}
                    required
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                  />
                </div>
                <Button
                  type="button"
                  onClick={handleNextStep}
                  disabled={isLoading}
                  className="mt-2 -color--upmin"
                >
                  Next <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ x: '100%', opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: '100%', opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="grid gap-4"
              >
                <div className="grid gap-2">
                  <Label htmlFor="department">Department</Label>
                  <Select
                    onValueChange={value => handleSelectChange('department', value)}
                    value={formData.department}
                  >
                    <SelectTrigger disabled={isLoading}>
                      <SelectValue placeholder="Select your department" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="DMPCS">DMPCS</SelectItem>
                      <SelectItem value="DFST">DFST</SelectItem>
                      <SelectItem value="DBSES">DBSES</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="role">Role</Label>
                  <Select
                    onValueChange={value => handleSelectChange('role', value)}
                    value={formData.role}
                  >
                    <SelectTrigger disabled={isLoading}>
                      <SelectValue placeholder="Select your role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Instructor">Instructor</SelectItem>
                      <SelectItem value="Student">Student</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {formData.role === 'Student' && (
                  <div className="grid gap-2">
                    <Label htmlFor="studentNumber">Student Number</Label>
                    <Input
                      id="studentNumber"
                      name="studentNumber"
                      placeholder="ex. 2025-12345"
                      type="text"
                      autoCapitalize="none"
                      autoComplete="off"
                      autoCorrect="off"
                      disabled={isLoading}
                      value={formData.studentNumber}
                      onChange={handleInputChange}
                    />
                  </div>
                )}
                {formData.role === 'Instructor' && (
                  <div className="grid gap-2">
                    <Label htmlFor="instructorID">Instructor ID</Label>
                    <Input
                      id="instructorID"
                      name="instructorID"
                      placeholder="Enter your instructor ID"
                      type="text"
                      autoCapitalize="none"
                      autoComplete="off"
                      autoCorrect="off"
                      disabled={isLoading}
                      value={formData.instructorID}
                      onChange={handleInputChange}
                    />
                  </div>
                )}
                {formData.role === 'Instructor' && (
                  <div className="grid gap-2">
                    <Label htmlFor="facultyRank">Faculty Rank</Label>
                    <Select
                      onValueChange={value => handleSelectChange('facultyRank', value)}
                      value={formData.facultyRank}
                    >
                      <SelectTrigger disabled={isLoading}>
                        <SelectValue placeholder="Select your Rank" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Lecturer">Lecturer</SelectItem>
                        <SelectItem value="Assistant Professor">Assistant Professor</SelectItem>
                        <SelectItem value="Associate Professor">Associate Professor</SelectItem>
                        <SelectItem value="Professor">Professor</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}
                {formData.role === 'Instructor' && (
                  <div className="grid gap-2">
                    <Label htmlFor="instructorOffice">Instructor Office</Label>
                    <Input
                      id="instructorOffice"
                      name="instructorOffice"
                      placeholder="Enter your Office Room Number."
                      type="text"
                      autoCapitalize="none"
                      autoComplete="off"
                      autoCorrect="off"
                      disabled={isLoading}
                      value={formData.instructorOffice}
                      onChange={handleInputChange}
                    />
                  </div>
                )}
                <div className="flex gap-2 mt-4">
                  <Button
                    type="button"
                    onClick={handlePrevStep}
                    disabled={isLoading}
                    variant="outline"
                  >
                    <ChevronLeft className="mr-2 h-4 w-4" /> Back
                  </Button>
                  <Button type="submit" disabled={isLoading} className="flex-1">
                    {isLoading && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
                    Sign up
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </form>
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
      </div>
      <div className="text-center text-sm text-muted-foreground">
        Already have an account?{' '}
        <Link href="/login" className="underline underline-offset-4 hover:text-primary">
          Sign in
        </Link>
      </div>
    </div>
  );
}
