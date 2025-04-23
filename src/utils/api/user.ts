export async function resetUserPassword(userId: string, newPassword: string) {
    try {
      const response = await fetch(`/api/user/reset-password`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId, newPassword }),
      });
  
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || 'Failed to reset password');
      }
  
      return { success: true, message: 'Password reset successfully!' };
    } catch (err: any) {
      console.error('Error resetting password:', err.message);
      return { success: false, message: err.message || 'Failed to reset password' };
    }
  }