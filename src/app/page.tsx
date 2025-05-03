'use client';
import { useState, useRef, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import gsap from 'gsap';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils'; // Assuming you have this utility

// --- Constants (Keep these as they are) ---
const DEGREE_TYPES = ['Standalone Degree', 'Dual Degree', 'Working Professional', 'Intern'];
const YEARS = ['Foundation', 'Diploma', 'Degree'];
const HOUSES = [
  'Wayanad', 'Sundarbans', 'Saranda', 'Pichavaram', 'Nilgiri', 'Namdapha',
  'Nallamala', 'Kaziranga', 'Kanha', 'Gir', 'Corbet', 'Bandipur',
];
const DOMAINS = [
  'Cybersecurity', 'Web Development', 'Web3', 'Competitive Programming', 'AI/ML',
];
const TEAMS = [
  'Content Team', 'Technical Team', 'Outreach Team', 'Sponsorship Team', 'UI/UX',
];
const TIME_COMMITMENTS = [
  'Less than 5 hours/week', '5-10 hours/week', '10-15 hours/week',
  'More than 15 hours/week', 'Only weekends', 'Only weekdays',
];
const INTERVIEW_DATES = [
  'April 30, 2025', 'May 1, 2025', 'May 2, 2025', 'May 3, 2025', 'May 4, 2025', 'May 5, 2025',
];
const INTERVIEW_TIMES = [
  '3:00 PM', '4:00 PM', '5:00 PM', '6:00 PM', '7:00 PM', '8:00 PM', '9:00 PM', '10:00 PM',
];

// --- Helper Function (Keep this as it is) ---
const getTeamDescription = (team: string) => {
  switch (team) {
    case 'Content Team': return 'Creating blogs, documentation, and educational content';
    case 'Technical Team': return 'Building and maintaining tech projects';
    case 'Outreach Team': return 'Managing community relations and partnerships';
    case 'Sponsorship Team': return 'Securing funding and sponsor relationships';
    case 'UI/UX': return 'Designing user interfaces and experiences';
    default: return '';
  }
};

// --- FormData Type (Keep this as it is) ---
type FormData = {
  email: string;
  fullName: string;
  degreeType: string;
  year: string;
  house: string;
  linkedin?: string;
  github?: string;
  domains: string[];
  domainWhy?: string;
  teams: string[];
  teamWhy?: string;
  experience: string;
  motivation?: string;
  timeCommitment: string;
  interviewDates: string[];
  interviewTimes: string[];
  additionalInfo?: string;
};

// --- Tailwind Class Helpers (Example - Adapt or remove if defined elsewhere) ---
// Assumes Nord theme colors are defined in tailwind.config.js
const nord = {
  0: '#2E3440', 1: '#3B4252', 2: '#434C5E', 3: '#4C566A',
  4: '#D8DEE9', 5: '#E5E9F0', 6: '#ECEFF4', 7: '#8FBCBB',
  8: '#88C0D0', 9: '#81A1C1', 10: '#5E81AC', 11: '#BF616A',
  12: '#D08770', 13: '#EBCB8B', 14: '#A3BE8C', 15: '#B48EAD',
};

const baseInputClasses = "block w-full px-4 py-2 rounded-lg bg-nord1 border border-nord3 text-nord6 focus:outline-none focus:ring-2 focus:ring-nord8 focus:border-transparent transition-colors placeholder-nord3";
const labelClasses = "block mb-1.5 text-sm font-medium text-nord4";
const errorClasses = "mt-1 text-xs text-nord11";
const checkboxLabelClasses = "flex items-center p-3 border border-nord3 rounded-lg cursor-pointer hover:bg-nord1 transition-colors duration-150 relative";
const checkboxLabelActiveClasses = "bg-nord1 border-nord8 ring-1 ring-nord8";
const checkboxInputClasses = "h-4 w-4 text-nord8 bg-nord1 border-nord3 rounded focus:ring-nord8 mr-3";
const buttonPrimaryClasses = "inline-flex items-center justify-center px-5 py-2 bg-nord8 hover:bg-nord7 text-nord0 font-semibold rounded-lg shadow-md transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-nord8 focus:ring-offset-2 focus:ring-offset-nord0";
const buttonSecondaryClasses = "inline-flex items-center justify-center px-5 py-2 bg-nord3 hover:bg-nord2 text-nord6 font-semibold rounded-lg shadow-md transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-nord3 focus:ring-offset-2 focus:ring-offset-nord0";
const headingClasses = "text-xl font-semibold text-nord6";
const cardSelectionClasses = "flex items-center p-3 border border-nord3 rounded-lg cursor-pointer hover:bg-nord1/50 transition-colors duration-150 relative";
const cardSelectionActiveClasses = "bg-nord1 border-nord8 ring-1 ring-nord8";
// --- End Tailwind Class Helpers ---


export default function Home() {
  const [currentStep, setCurrentStep] = useState(0);
  const [formProgress, setFormProgress] = useState(0);
  const formRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const [toast, setToast] = useState<{
    message: string;
    type: 'success' | 'error' | 'warning';
    visible: boolean;
  } | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    watch,
    trigger,
    getValues, // Use getValues for Review step display
  } = useForm<FormData>({
    mode: 'onTouched', // Validate on blur
    defaultValues: {
      domains: [],
      teams: [],
      interviewDates: [],
      interviewTimes: [],
      degreeType: "", year: "", house: "", timeCommitment: "", // Ensure defaults for selects
    },
  });

  // --- Hooks (Animations, Toast) ---
  useEffect(() => {
    // Initial form fade-in
    if (formRef.current) {
      gsap.from(formRef.current, { opacity: 0, y: 20, duration: 0.5, ease: 'power1.out' });
    }
  }, []);

  useEffect(() => {
      // Animate form step content transition
      const stepContent = formRef.current?.querySelector(`[data-step="${currentStep}"]`);
      if (stepContent) {
          gsap.fromTo(stepContent, { opacity: 0, y: 15 }, { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out' });
      }

      // Animate progress bar width
      if (progressRef.current) {
          gsap.to(progressRef.current, { width: `${formProgress}%`, duration: 0.4, ease: 'power1.out' });
      }
  }, [currentStep, formProgress]);

  useEffect(() => {
    // Auto-hide toast
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const showToast = (message: string, type: 'success' | 'error' | 'warning') => {
    setToast({ message, type, visible: true });
  };

  // --- Form Logic (Submit, Validation, Navigation) ---
  const onSubmit = async (data: FormData) => {
    try {
      console.log("Submitting Form Data:", data); // For debugging
      const res = await fetch('/api/recruit', { // Ensure this API endpoint exists
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        showToast("Application submitted successfully!", "success");
        reset(); // Clear form
        setCurrentStep(0); // Go back to first step
        setFormProgress(0); // Reset progress
      } else {
         const errorText = await res.text();
         console.error("Submission failed:", res.status, errorText);
         showToast(`Submission failed: ${res.statusText || 'Server Error'}. Please try again.`, "error");
      }
    } catch(error) {
        console.error("Network or other error during submission:", error);
        showToast("Submission failed. Check your connection or console for details.", "error");
    }
  };

  const getFieldsToValidateForStep = (step: number): (keyof FormData)[] => {
    // Define required fields for each step
    switch (step) {
      case 0: return ['email', 'fullName', 'degreeType', 'year', 'house'];
      case 1: return ['domains', 'experience'];
      case 2: return ['teams', 'timeCommitment'];
      case 3: return ['interviewDates', 'interviewTimes'];
      default: return []; // No validation needed for review step itself
    }
  };

  const nextStep = async () => {
    const fieldsToValidate = getFieldsToValidateForStep(currentStep);
    const isStepValid = await trigger(fieldsToValidate); // Validate current step's fields

    if (isStepValid) {
        const next = Math.min(currentStep + 1, steps.length - 1);
        setCurrentStep(next);
        // Update progress: Calculate based on moving *past* the current step
        setFormProgress(Math.ceil(((currentStep + 1) / (steps.length - 1)) * 100));
    } else {
      // Find the first field with an error on the current step
      const firstErrorField = fieldsToValidate.find(field => errors[field]);
      const errorMessage = firstErrorField ? errors[firstErrorField]?.message : "Please fill in all required fields.";
      showToast(errorMessage || "Validation error", "warning");
      // Optional: Focus the first invalid field
      const firstErrorElement = document.querySelector(`[name="${firstErrorField}"]`);
      if (firstErrorElement instanceof HTMLElement) {
        firstErrorElement.focus();
      }
    }
  };

  const prevStep = () => {
      const prev = Math.max(currentStep - 1, 0);
      setCurrentStep(prev);
      // Update progress: Calculate based on the index of the step *being moved to*
      setFormProgress(Math.ceil((prev / (steps.length - 1)) * 100));
  };

  const steps = ["Basic Info", "Expertise", "Teams & Commitment", "Interview", "Review & Submit"];
  const formData = getValues(); // Get current form values for the review step display

  // --- Render Component ---
  return (
    <div className="min-h-screen bg-nord0 text-nord6 py-8 px-4 sm:px-6 lg:px-8">
      <div ref={formRef} className="w-full max-w-7xl mx-auto relative z-10">
        {/* Toast Notification Area */}
        <AnimatePresence>
          {toast && (
            <motion.div
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50, transition: { duration: 0.2 } }}
              className={cn(
                "fixed top-5 right-5 z-[100] p-4 rounded-md shadow-lg text-sm font-medium text-nord0", // High z-index
                 toast.type === "success" && "bg-nord14",
                 toast.type === "error" && "bg-nord11",
                 toast.type === "warning" && "bg-nord13 text-nord1" // Better contrast for warning
              )}
            >
              {toast.message}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Layout: Sidebar + Content */}
        <div className="flex flex-col md:flex-row bg-nord1 rounded-lg shadow-xl overflow-hidden">

          {/* Left Vertical Step Indicator */}
          <aside className="w-full md:w-64 flex-shrink-0 bg-nord2 p-6 border-b md:border-b-0 md:border-r border-nord3">
            <h2 className="text-lg font-semibold text-nord6 mb-6 hidden md:block">Application Steps</h2>
            {/* Steps Navigation */}
            <nav className="flex flex-row md:flex-col md:space-y-4 overflow-x-auto md:overflow-x-visible pb-2 md:pb-0 -mx-4 px-4 md:mx-0 md:px-0">
              {steps.map((step, index) => (
                <div key={step} className="flex items-center space-x-3 md:space-x-0 md:items-start md:space-y-0 flex-shrink-0 mr-4 md:mr-0 relative group">
                   {/* Vertical line connector (desktop only) */}
                   {index < steps.length - 1 && (
                        <div className="hidden md:block absolute left-[14px] top-9 h-[calc(100%-1rem)] w-px bg-nord3" />
                   )}
                  {/* Step Dot and Label */}
                  <div className="flex md:flex-row items-center space-x-3 py-1">
                    <div
                      className={cn(
                        "w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 ease-in-out relative z-10 border",
                        currentStep === index
                          ? "bg-nord8 text-nord0 border-nord8 scale-105 shadow" // Active
                          : currentStep > index
                          ? "bg-nord14 text-nord0 border-nord14" // Completed
                          : "bg-nord3 text-nord5 border-nord4 group-hover:border-nord5" // Inactive
                      )}
                    >
                      {currentStep > index ? (
                        // Checkmark SVG
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path></svg>
                      ) : (
                        index + 1 // Step number
                      )}
                    </div>
                    <span className={cn(
                        "text-sm font-medium transition-colors duration-300 ease-in-out whitespace-nowrap",
                        currentStep === index ? "text-nord8" : "text-nord4 group-hover:text-nord5"
                    )}>
                      {step}
                    </span>
                  </div>
                </div>
              ))}
            </nav>
          </aside>

          {/* Right Content Area (Form) */}
          <main className="flex-grow bg-nord0 p-6 md:p-8 lg:p-10 min-w-0">
            {/* Form Header */}
            <header className="mb-6">
              <h1 className="text-2xl md:text-3xl font-bold text-nord6 mb-1">
                Tech Society Recruitment Form
              </h1>
              <p className="text-nord4 text-sm md:text-base">
                Join our innovative community of tech enthusiasts
              </p>
              {/* Progress bar */}
              <div className="mt-4 w-full bg-nord2 rounded-full h-2 overflow-hidden">
                  <div
                      ref={progressRef}
                      className="bg-nord8 h-2 rounded-full transition-all duration-300 ease-out"
                      style={{ width: `${formProgress}%` }} // Width controlled by state/GSAP
                  />
              </div>
            </header>

            {/* Form Steps Content */}
            <form onSubmit={handleSubmit(onSubmit)} className="mt-6">
                {/* Step 1: Basic Information */}
                <section data-step="0" className={cn("space-y-6", currentStep === 0 ? "block" : "hidden")}>
                    <h2 className={headingClasses}>Personal Information</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
                        {/* Email */}
                        <div>
                            <label htmlFor="email" className={labelClasses}>Email <span className="text-nord11">*</span></label>
                            <input id="email" type="email" placeholder="your-iitm-email@ds.study.iitm.ac.in" className={cn(baseInputClasses, errors.email && "border-nord11 ring-1 ring-nord11")}
                                {...register('email', { 
                                  required: "Email is required", 
                                  pattern: { 
                                    value: /^[a-zA-Z0-9._%+-]+@(ds|es)\.study\.iitm\.ac\.in$/i, 
                                    message: "Must be a valid IITM email (@ds.study.iitm.ac.in or @es.study.iitm.ac.in)" 
                                  } 
                                })}/>
                            {errors.email && <p className={errorClasses}>{errors.email.message}</p>}
                        </div>
                        {/* Full Name */}
                        <div>
                            <label htmlFor="fullName" className={labelClasses}>Full Name <span className="text-nord11">*</span></label>
                            <input id="fullName" placeholder="As per institute records" className={cn(baseInputClasses, errors.fullName && "border-nord11 ring-1 ring-nord11")}
                                {...register('fullName', { required: "Full name is required" })} />
                            {errors.fullName && <p className={errorClasses}>{errors.fullName.message}</p>}
                        </div>
                        {/* Degree Type Dropdown */}
                         <div>
                            <label htmlFor="degreeType" className={labelClasses}>Degree Type <span className="text-nord11">*</span></label>
                            <select id="degreeType" className={cn(baseInputClasses, errors.degreeType && "border-nord11 ring-1 ring-nord11")}
                                {...register('degreeType', { required: "Please select your degree type" })}>
                                <option value="" disabled>Select Degree Type...</option>
                                {DEGREE_TYPES.map(type => <option key={type} value={type}>{type}</option>)}
                            </select>
                            {errors.degreeType && <p className={errorClasses}>{errors.degreeType.message}</p>}
                        </div>
                        {/* Year of Study Dropdown */}
                        <div>
                            <label htmlFor="year" className={labelClasses}>Current Level <span className="text-nord11">*</span></label>
                            <select id="year" className={cn(baseInputClasses, errors.year && "border-nord11 ring-1 ring-nord11")}
                                {...register('year', { required: "Please select your current level" })}>
                                <option value="" disabled>Select Level...</option>
                                {YEARS.map(year => <option key={year} value={year}>{year}</option>)}
                            </select>
                            {errors.year && <p className={errorClasses}>{errors.year.message}</p>}
                        </div>
                        {/* House Dropdown */}
                        <div>
                            <label htmlFor="house" className={labelClasses}>House <span className="text-nord11">*</span></label>
                            <select id="house" className={cn(baseInputClasses, errors.house && "border-nord11 ring-1 ring-nord11")}
                                {...register('house', { required: "Please select your house" })}>
                                <option value="" disabled>Select your house...</option>
                                {HOUSES.map(house => <option key={house} value={house}>{house}</option>)}
                            </select>
                            {errors.house && <p className={errorClasses}>{errors.house.message}</p>}
                        </div>
                        {/* LinkedIn */}
                        <div>
                            <label htmlFor="linkedin" className={labelClasses}>LinkedIn Profile (Optional)</label>
                            <input id="linkedin" type="url" placeholder="https://linkedin.com/in/yourprofile" className={baseInputClasses} {...register('linkedin')} />
                        </div>
                        {/* GitHub */}
                        <div>
                            <label htmlFor="github" className={labelClasses}>GitHub Profile (Optional)</label>
                            <input id="github" type="url" placeholder="https://github.com/yourusername" className={baseInputClasses} {...register('github')} />
                        </div>
                    </div>
                    {/* Navigation */}
                    <div className="flex justify-end pt-4">
                        <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} type="button" onClick={nextStep} className={buttonPrimaryClasses}>
                            Next: Expertise <span aria-hidden="true" className="ml-1 font-sans">→</span>
                        </motion.button>
                    </div>
                </section>

                 {/* Step 2: Expertise */}
                 <section data-step="1" className={cn("space-y-6", currentStep === 1 ? "block" : "hidden")}>
                    <h2 className={headingClasses}>Technical Expertise</h2>
                    {/* Domains Checkboxes */}
                    <div>
                        <label className={labelClasses}>Domains of Interest <span className="text-nord11">*</span></label>
                        <p className="text-sm text-nord4 mb-3">Select all that apply. Choose domains you're genuinely interested in exploring or contributing to.</p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                            {DOMAINS.map((domain) => (
                                <label key={domain} className={cn(checkboxLabelClasses, watch('domains')?.includes(domain) && checkboxLabelActiveClasses)}>
                                    <input type="checkbox" value={domain} className={checkboxInputClasses}
                                        {...register('domains', { required: "Select at least one domain of interest" })} />
                                    <span className="text-nord5 flex-1">{domain}</span>
                                    {watch('domains')?.includes(domain) && (
                                        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-nord8 rounded-full ring-1 ring-nord1"/>
                                    )}
                                </label>
                            ))}
                        </div>
                        {errors.domains && <p className={errorClasses}>{errors.domains.message}</p>}
                    </div>
                    {/* Domain Motivation */}
                    <div>
                        <label htmlFor="domainWhy" className={labelClasses}>Why are you interested in these domains? (Optional)</label>
                        <textarea id="domainWhy" placeholder="Share your passion, projects, or learning goals related to your chosen domains." rows={4} className={cn(baseInputClasses, "min-h-[100px]")} {...register('domainWhy')} />
                    </div>
                    {/* Technical Experience */}
                    <div>
                        <label htmlFor="experience" className={labelClasses}>Relevant Technical Experience <span className="text-nord11">*</span></label>
                        <p className="text-sm text-nord4 mb-2">Describe projects, skills, coursework, or contributions (min. 50 chars).</p>
                        <textarea id="experience" placeholder="Example: Built a web app using React & Node; Contributed to open-source project X; Proficient in Python for data analysis..." rows={5}
                            className={cn(baseInputClasses, "min-h-[120px]", errors.experience && "border-nord11 ring-1 ring-nord11")}
                            {...register('experience', { required: "Please describe your technical experience", minLength: { value: 50, message: "Please provide at least 50 characters" } })} />
                        {errors.experience && <p className={errorClasses}>{errors.experience.message}</p>}
                        <p className="text-xs text-nord4 mt-1 text-right">{watch('experience')?.length || 0}/50 characters minimum</p>
                    </div>
                    {/* Navigation */}
                    <div className="flex justify-between pt-4">
                        <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} type="button" onClick={prevStep} className={buttonSecondaryClasses}>
                            <span aria-hidden="true" className="mr-1 font-sans">←</span> Back
                        </motion.button>
                        <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} type="button" onClick={nextStep} className={buttonPrimaryClasses}>
                            Next: Teams <span aria-hidden="true" className="ml-1 font-sans">→</span>
                        </motion.button>
                    </div>
                 </section>

                 {/* Step 3: Teams & Commitment */}
                 <section data-step="2" className={cn("space-y-6", currentStep === 2 ? "block" : "hidden")}>
                    <h2 className={headingClasses}>Teams & Commitment</h2>
                    {/* Teams Checkboxes */}
                    <div>
                        <label className={labelClasses}>Preferred Teams <span className="text-nord11">*</span></label>
                        <p className="text-sm text-nord4 mb-3">Select teams you're interested in joining. You may be considered for others based on profile.</p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {TEAMS.map((team) => (
                                <label key={team} className={cn(checkboxLabelClasses, watch('teams')?.includes(team) && checkboxLabelActiveClasses, "items-start")}>
                                     <input type="checkbox" value={team} className={cn(checkboxInputClasses, "mt-1")}
                                        {...register('teams', { required: "Select at least one team you'd like to join" })} />
                                    <div className="flex-1">
                                        <p className="font-medium text-nord6">{team}</p>
                                        <p className="text-xs text-nord4">{getTeamDescription(team)}</p>
                                    </div>
                                    {watch('teams')?.includes(team) && (
                                        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-nord8 rounded-full ring-1 ring-nord1"/>
                                    )}
                                </label>
                            ))}
                        </div>
                        {errors.teams && <p className={errorClasses}>{errors.teams.message}</p>}
                    </div>
                    {/* Team Motivation */}
                     <div>
                        <label htmlFor="teamWhy" className={labelClasses}>Why these teams? What can you contribute? (Optional)</label>
                        <textarea id="teamWhy" placeholder="Explain your interest in the selected teams and any relevant skills or ideas you have." rows={4} className={cn(baseInputClasses, "min-h-[100px]")} {...register('teamWhy')} />
                    </div>
                    {/* Society Motivation */}
                    <div>
                        <label htmlFor="motivation" className={labelClasses}>Motivation for Joining Tech Society (Optional)</label>
                        <textarea id="motivation" placeholder="What do you hope to gain or achieve by being part of the society?" rows={4} className={cn(baseInputClasses, "min-h-[100px]")} {...register('motivation')} />
                    </div>
                    {/* Time Commitment Dropdown */}
                     <div>
                        <label htmlFor="timeCommitment" className={labelClasses}>Estimated Weekly Time Commitment <span className="text-nord11">*</span></label>
                         <p className="text-sm text-nord4 mb-2">Be realistic about the time you can dedicate.</p>
                        <select id="timeCommitment" className={cn(baseInputClasses, errors.timeCommitment && "border-nord11 ring-1 ring-nord11")}
                            {...register('timeCommitment', { required: "Please estimate your time commitment" })}>
                            <option value="" disabled>Select approx. hours per week...</option>
                            {TIME_COMMITMENTS.map(time => <option key={time} value={time}>{time}</option>)}
                        </select>
                        {errors.timeCommitment && <p className={errorClasses}>{errors.timeCommitment.message}</p>}
                    </div>
                     {/* Navigation */}
                    <div className="flex justify-between pt-4">
                         <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} type="button" onClick={prevStep} className={buttonSecondaryClasses}>
                             <span aria-hidden="true" className="mr-1 font-sans">←</span> Back
                         </motion.button>
                         <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} type="button" onClick={nextStep} className={buttonPrimaryClasses}>
                            Next: Interview <span aria-hidden="true" className="ml-1 font-sans">→</span>
                        </motion.button>
                     </div>
                 </section>

                {/* Step 4: Interview Preferences */}
                 <section data-step="3" className={cn("space-y-6", currentStep === 3 ? "block" : "hidden")}>
                     <h2 className={headingClasses}>Interview Availability</h2>
                     <p className="text-sm text-nord4">Select ALL dates and time slots (IST) you are available for a short online interview.</p>
                    {/* Available Dates Checkboxes */}
                    <div>
                        <label className={labelClasses}>Available Dates <span className="text-nord11">*</span></label>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                            {INTERVIEW_DATES.map((date) => (
                                <label key={date} className={cn(checkboxLabelClasses, watch('interviewDates')?.includes(date) && checkboxLabelActiveClasses, "justify-center text-center")}>
                                    <input type="checkbox" value={date} className="sr-only peer" // Hide input, use peer
                                        {...register('interviewDates', { required: "Select at least one available date" })} />
                                    <span className="text-nord5 peer-checked:text-nord8">{date}</span>
                                    {/* Checkmark visible when checked */}
                                     <motion.div
                                        className="absolute top-1 right-1 w-3 h-3 bg-nord8 rounded-full opacity-0 peer-checked:opacity-100 transition-opacity"
                                        initial={{ scale: 0 }} animate={{ scale: watch('interviewDates')?.includes(date) ? 1 : 0 }}
                                      />
                                </label>
                            ))}
                        </div>
                        {errors.interviewDates && <p className={errorClasses}>{errors.interviewDates.message}</p>}
                    </div>
                    {/* Available Times Checkboxes */}
                     <div>
                        <label className={labelClasses}>Preferred Time Slots (IST) <span className="text-nord11">*</span></label>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                            {INTERVIEW_TIMES.map((time) => (
                                <label key={time} className={cn(checkboxLabelClasses, watch('interviewTimes')?.includes(time) && checkboxLabelActiveClasses, "justify-center text-center")}>
                                    <input type="checkbox" value={time} className="sr-only peer"
                                        {...register('interviewTimes', { required: "Select at least one preferred time slot" })} />
                                     <span className="text-nord5 peer-checked:text-nord8">{time}</span>
                                     <motion.div
                                        className="absolute top-1 right-1 w-3 h-3 bg-nord8 rounded-full opacity-0 peer-checked:opacity-100 transition-opacity"
                                        initial={{ scale: 0 }} animate={{ scale: watch('interviewTimes')?.includes(time) ? 1 : 0 }}
                                      />
                                </label>
                            ))}
                        </div>
                        {errors.interviewTimes && <p className={errorClasses}>{errors.interviewTimes.message}</p>}
                    </div>
                    {/* Additional Info */}
                     <div>
                        <label htmlFor="additionalInfo" className={labelClasses}>Additional Information / Constraints (Optional)</label>
                        <textarea id="additionalInfo" placeholder="Anything else we should know regarding your availability or application?" rows={4} className={cn(baseInputClasses, "min-h-[100px]")} {...register('additionalInfo')} />
                    </div>
                    {/* Navigation */}
                     <div className="flex justify-between pt-4">
                        <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} type="button" onClick={prevStep} className={buttonSecondaryClasses}>
                             <span aria-hidden="true" className="mr-1 font-sans">←</span> Back
                        </motion.button>
                         <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} type="button" onClick={nextStep} className={buttonPrimaryClasses}>
                            Review Application <span aria-hidden="true" className="ml-1 font-sans">→</span>
                        </motion.button>
                     </div>
                 </section>

                {/* Step 5: Review & Submit */}
                <section data-step="4" className={cn("space-y-6", currentStep === 4 ? "block" : "hidden")}>
                    <h2 className={headingClasses}>Review Your Application</h2>
                    <p className="text-nord5 text-sm">Please review your information carefully. Expand each section to check your answers before submitting.</p>

                    {/* Review Sections - Using <details> for expand/collapse */}
                    <div className="space-y-4">
                        {/* Section: Personal Info */}
                        <motion.details
                           className="bg-nord1 p-4 rounded-lg border border-nord3 overflow-hidden group"
                           initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                        >
                            <summary className="flex justify-between items-center cursor-pointer list-none group">
                                <h3 className="text-md font-semibold text-nord8">Personal Information</h3>
                                <span className="text-nord4 transition-transform duration-200 group-open:rotate-90">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" /></svg>
                                </span>
                            </summary>
                            <div className="mt-4">
                                <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2 text-sm">
                                    <div className="sm:col-span-1"><dt className="text-nord4">Name:</dt><dd className="text-nord6 break-words">{formData.fullName || '-'}</dd></div>
                                    <div className="sm:col-span-1"><dt className="text-nord4">Email:</dt><dd className="text-nord6 break-words">{formData.email || '-'}</dd></div>
                                    <div className="sm:col-span-1"><dt className="text-nord4">Degree:</dt><dd className="text-nord6">{formData.degreeType || '-'}</dd></div>
                                    <div className="sm:col-span-1"><dt className="text-nord4">Level:</dt><dd className="text-nord6">{formData.year || '-'}</dd></div>
                                    <div className="sm:col-span-1"><dt className="text-nord4">House:</dt><dd className="text-nord6">{formData.house || '-'}</dd></div>
                                    <div className="sm:col-span-1"><dt className="text-nord4">LinkedIn:</dt><dd className="text-nord6 break-words">{formData.linkedin || '-'}</dd></div>
                                    <div className="sm:col-span-1"><dt className="text-nord4">GitHub:</dt><dd className="text-nord6 break-words">{formData.github || '-'}</dd></div>
                                </dl>
                            </div>
                        </motion.details>

                         {/* Section: Technical Expertise */}
                         <motion.details
                            className="bg-nord1 p-4 rounded-lg border border-nord3 overflow-hidden group"
                            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                         >
                             <summary className="flex justify-between items-center cursor-pointer list-none group">
                                 <h3 className="text-md font-semibold text-nord8">Technical Expertise</h3>
                                 <span className="text-nord4 transition-transform duration-200 group-open:rotate-90">
                                     <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" /></svg>
                                 </span>
                             </summary>
                            <div className="mt-4">
                                <dl className="space-y-3 text-sm">
                                    <div>
                                        <dt className="text-nord4 mb-1">Domains of Interest:</dt>
                                        <dd className="flex flex-wrap gap-1.5">
                                            {formData.domains?.length > 0
                                                ? formData.domains.map(d => <span key={d} className="bg-nord9/20 text-nord9 px-2 py-0.5 rounded text-xs font-medium">{d}</span>)
                                                : <span className="text-nord4 italic text-xs">- Not specified -</span>}
                                        </dd>
                                    </div>
                                     <div>
                                        <dt className="text-nord4 mb-1">Domain Motivation:</dt>
                                        <dd className="text-nord6 whitespace-pre-wrap text-xs leading-relaxed">{formData.domainWhy || <span className="text-nord4 italic">- Not specified -</span>}</dd>
                                     </div>
                                     <div>
                                        <dt className="text-nord4 mb-1">Experience:</dt>
                                        <dd className="text-nord6 whitespace-pre-wrap text-xs leading-relaxed">{formData.experience || <span className="text-nord4 italic">- Not specified -</span>}</dd>
                                    </div>
                                </dl>
                            </div>
                         </motion.details>

                        {/* Section: Teams & Commitment */}
                        <motion.details
                            className="bg-nord1 p-4 rounded-lg border border-nord3 overflow-hidden group"
                            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
                        >
                            <summary className="flex justify-between items-center cursor-pointer list-none group">
                                <h3 className="text-md font-semibold text-nord8">Teams & Commitment</h3>
                                <span className="text-nord4 transition-transform duration-200 group-open:rotate-90">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" /></svg>
                                </span>
                            </summary>
                             <div className="mt-4">
                                <dl className="space-y-3 text-sm">
                                    <div>
                                        <dt className="text-nord4 mb-1">Preferred Teams:</dt>
                                        <dd className="flex flex-wrap gap-1.5">
                                            {formData.teams?.length > 0
                                                ? formData.teams.map(t => <span key={t} className="bg-nord10/20 text-nord10 px-2 py-0.5 rounded text-xs font-medium">{t}</span>)
                                                : <span className="text-nord4 italic text-xs">- Not specified -</span>}
                                        </dd>
                                    </div>
                                    <div>
                                        <dt className="text-nord4 mb-1">Team Motivation:</dt>
                                        <dd className="text-nord6 whitespace-pre-wrap text-xs leading-relaxed">{formData.teamWhy || <span className="text-nord4 italic">- Not specified -</span>}</dd>
                                     </div>
                                     <div>
                                        <dt className="text-nord4 mb-1">Society Motivation:</dt>
                                        <dd className="text-nord6 whitespace-pre-wrap text-xs leading-relaxed">{formData.motivation || <span className="text-nord4 italic">- Not specified -</span>}</dd>
                                     </div>
                                    <div>
                                        <dt className="text-nord4">Time Commitment:</dt>
                                        <dd className="text-nord6">{formData.timeCommitment || <span className="text-nord4 italic">- Not specified -</span>}</dd>
                                    </div>
                                </dl>
                            </div>
                        </motion.details>

                        {/* Section: Interview Availability */}
                         <motion.details
                            className="bg-nord1 p-4 rounded-lg border border-nord3 overflow-hidden group"
                            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
                        >
                            <summary className="flex justify-between items-center cursor-pointer list-none group">
                                <h3 className="text-md font-semibold text-nord8">Interview Availability</h3>
                                <span className="text-nord4 transition-transform duration-200 group-open:rotate-90">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" /></svg>
                                </span>
                            </summary>
                             <div className="mt-4">
                                <dl className="space-y-3 text-sm">
                                    <div>
                                        <dt className="text-nord4 mb-1">Available Dates:</dt>
                                        <dd className="flex flex-wrap gap-1.5">
                                             {formData.interviewDates?.length > 0
                                                ? formData.interviewDates.map(d => <span key={d} className="bg-nord14/20 text-nord14 px-2 py-0.5 rounded text-xs font-medium">{d}</span>)
                                                : <span className="text-nord4 italic text-xs">- Not specified -</span>}
                                        </dd>
                                    </div>
                                    <div>
                                        <dt className="text-nord4 mb-1">Preferred Times (IST):</dt>
                                        <dd className="flex flex-wrap gap-1.5">
                                             {formData.interviewTimes?.length > 0
                                                ? formData.interviewTimes.map(t => <span key={t} className="bg-nord7/25 text-nord7 px-2 py-0.5 rounded text-xs font-medium">{t}</span>)
                                                : <span className="text-nord4 italic text-xs">- Not specified -</span>}
                                        </dd>
                                    </div>
                                     <div>
                                        <dt className="text-nord4 mb-1">Additional Information:</dt>
                                        <dd className="text-nord6 whitespace-pre-wrap text-xs leading-relaxed">{formData.additionalInfo || <span className="text-nord4 italic">- Not specified -</span>}</dd>
                                     </div>
                                </dl>
                            </div>
                         </motion.details>
                    </div>

                    {/* Final Navigation/Submit Buttons */}
                    <div className="flex justify-between mt-10 pt-6 border-t border-nord3">
                        <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} type="button" onClick={prevStep} className={buttonSecondaryClasses}>
                            <span aria-hidden="true" className="mr-1 font-sans">←</span> Go Back & Edit
                        </motion.button>
                        <motion.button
                            whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                            type="submit"
                            disabled={isSubmitting}
                            className={cn(
                                buttonPrimaryClasses, "bg-nord14 hover:bg-nord14/80", // Green for submit
                                "disabled:opacity-60 disabled:cursor-not-allowed disabled:bg-nord3" // Disabled state
                            )}
                        >
                            {isSubmitting ? (
                                // Loading Spinner
                                <span className='flex items-center'>
                                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-nord0" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Submitting...
                                </span>
                            ) : 'Confirm & Submit Application'}
                        </motion.button>
                    </div>
                </section>
            </form>

             {/* Footer inside the main content area */}
             <footer className="text-center text-xs text-nord4 mt-8 pt-4 border-t border-nord3">
                 Tech Society Recruitment Form © {new Date().getFullYear()}.
                 For Indian Institute of Technology Madras students only.
             </footer>

          </main> {/* End Right Content Area */}
        </div> {/* End Main Layout Flex */}
      </div> {/* End Max Width Container */}
    </div> // End Page Container
  );
}