"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import { sendSupportEmail } from "@/app/api/email"
import { useToast } from "@/hooks/use-toast"

export default function SupportForm() {
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsSubmitting(true)

    const formData = new FormData(event.currentTarget)

    // try {
    //   // await sendSupportEmail(formData)
    //   toast({
    //     title: "Request submitted",
    //     description: "We've received your support request and will respond shortly.",
    //   })
    //   // Reset the form
    //   event.currentTarget.reset()
    // } catch (error) {
    //   toast({
    //     title: "Something went wrong",
    //     description: "Your request couldn't be submitted. Please try again.",
    //     variant: "destructive",
    //   })
    // } finally {
    //   setIsSubmitting(false)
    // }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">

      <div className="space-y-2">
        <Label htmlFor="subject">Subject</Label>
        <Select name="subject" required>
          <SelectTrigger id="subject">
            <SelectValue placeholder="Select a subject" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="general">General Inquiry</SelectItem>
            <SelectItem value="technical">Technical Support</SelectItem>
            <SelectItem value="billing">Billing Question</SelectItem>
            <SelectItem value="feedback">Feedback</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="message">Message</Label>
        <Textarea
          id="message"
          name="message"
          placeholder="Please describe your issue or question in detail"
          className="min-h-[120px]"
          required
        />
      </div>

      <Button type="submit" className="w-full bg-[#7a1a1a] hover:bg-[#5a1313]" disabled={isSubmitting}>
        {isSubmitting ? "Submitting..." : "Submit Request"}
      </Button>
    </form>
  )
}
