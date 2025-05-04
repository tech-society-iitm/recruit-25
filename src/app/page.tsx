import {
  ClerkProvider,
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from '@clerk/nextjs'
import Link from 'next/link'

const AuthPage = () => {
  return (
    <ClerkProvider>
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-nord0 to-nord1 p-6">
        <div className="w-full max-w-md bg-nord2 rounded-2xl shadow-xl p-8 text-center">
          <h1 className="text-3xl font-bold mb-2 text-nord6">Tech Society</h1>
          <p className="text-nord4 mb-8">Join our community of tech enthusiasts</p>
          
          <SignedIn>
            <div className="bg-nord1/50 rounded-xl p-6 mb-6 flex flex-col items-center space-y-4">
              <p className="text-nord6 font-medium">You are signed in!</p>
              <UserButton afterSignOutUrl="/" />
              
              {/* Access to recruitment form */}
              <div className="w-full mt-6 pt-6 border-t border-nord3/30">
                <Link href="/recruit" className="inline-flex items-center justify-center w-full px-4 py-3 bg-nord8 hover:bg-nord7 text-white font-medium rounded-xl shadow-md transition duration-200 ease-in-out">
                  Access Recruitment Form
                  <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </Link>
              </div>
            </div>
          </SignedIn>
          
          <SignedOut>
            <div className="bg-nord1/50 rounded-xl p-6 mb-6">
              <p className="text-nord5 mb-6">Please sign in to access the recruitment form</p>
              <div className="space-y-3">
                <div className="inline-flex items-center justify-center w-full px-4 py-3 bg-nord8 hover:bg-nord7 text-white font-medium rounded-xl shadow-md transition duration-200 ease-in-out">
                <SignInButton mode="modal" >
                  Sign In
                </SignInButton>
                </div>
                <div className="inline-flex items-center justify-center w-full px-4 py-3 bg-nord3 hover:bg-nord2 text-nord6 font-medium rounded-xl shadow-md transition duration-200 ease-in-out">
                <SignUpButton mode="modal">
                  Sign Up
                </SignUpButton>
                </div>
              </div>
            </div>
          </SignedOut>
          
          <p className="text-sm text-nord4 mt-8">
            Tech Society · Indian Institute of Technology Madras
          </p>
        </div>
      </div>
    </ClerkProvider>
  )
}

export default AuthPage