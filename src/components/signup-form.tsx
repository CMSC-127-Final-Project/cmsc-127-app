"use client"

import type React from "react"

import { useState } from "react"
import { supabase } from "@/lib/supabase"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Icons } from "@/components/icons"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ChevronLeft, ChevronRight } from "lucide-react"

export default function SignupForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "",
    department: "",
  })
  const [passwordError, setPasswordError] = useState("")

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))

    // Clear password error when either password field changes
    if (name === "password" || name === "confirmPassword") {
      setPasswordError("")
    }
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const validateFirstStep = () => {
    if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
      return false
    }

    if (formData.password !== formData.confirmPassword) {
      setPasswordError("Passwords do not match")
      return false
    }

    return true
  }

  const handleNextStep = () => {
    if (validateFirstStep()) {
      setStep(2)
    }
  }

  const handlePrevStep = () => {
    setStep(1)
  }

  async function onSubmit(event: React.SyntheticEvent) {
    event.preventDefault()

    if (step === 1) {
      handleNextStep()
      return
    }

    if (!formData.role || !formData.department) {
      alert("Please select a role and department")
      return
    }

    setIsLoading(true)

    // 1. Sign up user using Supabase Auth
    const { data, error } = await supabase.auth.signUp({
      email: formData.email,
      password: formData.password,
    })

    if (error) {
      console.error("Error signing up:", error.message)
      alert(error.message)
      setIsLoading(false)
      return
    }

    // 2. Once the user is created, insert additional details into "User" table
    if (data.user) {
      const { error: insertError } = await supabase.from("User").insert({
        auth_id: data.user.id,
        name: formData.name,
        email: formData.email,
        role: formData.role,
        dept: formData.department,
      })

      if (insertError) {
        console.error("Error inserting into User table:", insertError.message)
        alert(insertError.message)
        setIsLoading(false)
        return
      }

      alert("Sign-up successful!")
    }

    setIsLoading(false)
  }

  return (
    <div className="grid gap-6">
      <form onSubmit={onSubmit} className="overflow-hidden">
        <div className="relative" style={{ height: step === 1 ? "auto" : "340px" }}>
          <AnimatePresence initial={false} mode="wait">
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ x: "-100%", opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: "-100%", opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="grid gap-4"
              >
                <div className="grid gap-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    name="name"
                    placeholder="John Doe"
                    type="text"
                    autoCapitalize="none"
                    autoComplete="name"
                    autoCorrect="off"
                    disabled={isLoading}
                    required
                    value={formData.name}
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
                  {passwordError && <p className="text-sm text-red-500">{passwordError}</p>}
                </div>
                <Button type="button" onClick={handleNextStep} disabled={isLoading} className="mt-2">
                  Next <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ x: "100%", opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: "100%", opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="grid gap-4"
              >
                <div className="grid gap-2">
                  <Label htmlFor="role">Role</Label>
                  <Select onValueChange={(value) => handleSelectChange("role", value)} value={formData.role}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Instructor">Instructor</SelectItem>
                      <SelectItem value="Student">Student</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="department">Department</Label>
                  <Select
                    onValueChange={(value) => handleSelectChange("department", value)}
                    value={formData.department}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select your department" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="DMPCS">DMPCS</SelectItem>
                      <SelectItem value="DFST">DFST</SelectItem>
                      <SelectItem value="DBSES">DBSES</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex gap-2 mt-4">
                  <Button type="button" onClick={handlePrevStep} disabled={isLoading} variant="outline">
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
        Already have an account?{" "}
        <Link href="/login" className="underline underline-offset-4 hover:text-primary">
          Sign in
        </Link>
      </div>
    </div>
  )
}

