export function LoginForm() {
  return (
    <div className="w-full max-w-md mx-auto p-8 space-y-6 bg-[#1A1A1A] rounded-xl border border-[#2A2A2A]">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-[#EAEAEA]">Welcome Back</h1>
        <p className="mt-2 text-sm text-[#C0C0C0]">
          Sign in to access your account
        </p>
      </div>

      <form className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-[#C0C0C0]">
            Email address
          </label>
          <input
            type="email"
            id="email"
            className="mt-1 block w-full px-3 py-2 border border-[#2A2A2A] bg-[#121212] rounded-md text-[#EAEAEA] focus:outline-none focus:ring-[#00A6B2] focus:border-[#00A6B2]"
            placeholder="you@example.com"
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-[#C0C0C0]">
            Password
          </label>
          <input
            type="password"
            id="password"
            className="mt-1 block w-full px-3 py-2 border border-[#2A2A2A] bg-[#121212] rounded-md text-[#EAEAEA] focus:outline-none focus:ring-[#00A6B2] focus:border-[#00A6B2]"
            placeholder="Enter your password"
          />
          <a href="#" className="mt-2 text-xs text-[#00A6B2] hover:text-[#008A94] text-right block">
            Forgot password?
          </a>
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            id="remember"
            className="h-4 w-4 text-[#00A6B2] focus:ring-[#00A6B2] border-[#2A2A2A] rounded"
          />
          <label htmlFor="remember" className="ml-2 block text-sm text-[#C0C0C0]">
            Remember me
          </label>
        </div>

        <button
          type="submit"
          className="w-full flex justify-center py-2 px-4 rounded-md text-sm font-medium text-white bg-[#00A6B2] hover:bg-[#008A94] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#00A6B2]"
        >
          Sign In
        </button>
      </form>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-[#2A2A2A]"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-[#1A1A1A] text-[#C0C0C0]">
            Or continue with
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <button 
          className="w-full flex items-center justify-center py-2 px-4 border border-[#2A2A2A] rounded-md text-sm font-medium text-[#EAEAEA] bg-[#121212] hover:bg-[#2A2A2A]"
        >
          <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
            {/* Google icon path */}
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.45h3.57c2.08-1.92 3.28-4.74 3.28-8.07z" fill="#4285F4" />
            <path d="M12 23c2.97 0 5.46-1 7.28-2.69l-3.57-2.77c-.99.69-2.26 1.1-3.71 1.1-2.87 0-5.3-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
            <path d="M5.84 14.11c-.22-.69-.35-1.43-.35-2.11s.13-1.42.35-2.11V7.05H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.95l2.66-2.84z" fill="#FBBC05" />
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.46 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.05l3.66 2.84c.86-2.6 3.3-4.51 6.16-4.51z" fill="#EA4335" />
          </svg>
          Google
        </button>
        <button 
          className="w-full flex items-center justify-center py-2 px-4 border border-[#2A2A2A] rounded-md text-sm font-medium text-[#EAEAEA] bg-[#121212] hover:bg-[#2A2A2A]"
        >
          <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
            {/* Apple icon path */}
            <path d="M12 2c-5.523 0-10 4.477-10 10s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm4.707 15.707c-.39.39-1.023.39-1.414 0l-3.293-3.293c-.39-.39-.39-1.023 0-1.414l3.293-3.293c.39-.39 1.023-.39 1.414 0 .39.39.39 1.023 0 1.414L13.414 12l3.293 3.293c.39.39.39 1.023 0 1.414z" fill="#000" />
          </svg>
          Apple
        </button>
      </div>

      <div className="text-center">
        <p className="mt-2 text-sm text-[#C0C0C0]">
          Don't have an account?{" "}
          <a href="#" className="font-medium text-[#00A6B2] hover:text-[#008A94]">
            Sign up
          </a>
        </p>
      </div>
    </div>
  );
}