'use client';
import { useState, useRef, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import gsap from 'gsap';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils'; // Assuming you have this utility

// Form data constants (Keep these as they are)
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

// Helper function (Keep this as it is)
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

// FormData type (Keep this as it is)
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
const nord = {
  0: '#2E3440', // darkest grey/blue
  1: '#3B4252', // dark grey/blue
  2: '#434C5E', // grey/blue
  3: '#4C566A', // light grey/blue
  4: '#D8DEE9', // lighter grey
  5: '#E5E9F0', // light grey
  6: '#ECEFF4', // lightest grey / white
  7: '#8FBCBB', // teal
  8: '#88C0D0', // light blue
  9: '#81A1C1', // blue
  10: '#5E81AC', // darker blue
  11: '#BF616A', // red
  12: '#D08770', // orange
  13: '#EBCB8B', // yellow
  14: '#A3BE8C', // green
  15: '#B48EAD', // purple
};

const baseInputClasses = "block w-full px-4 py-2 rounded-lg bg-nord1 border border-nord3 text-nord6 focus:outline-none focus:ring-2 focus:ring-nord8 focus:border-transparent transition-colors placeholder-nord3";
const labelClasses = "block mb-1.5 text-sm font-medium text-nord4";
const errorClasses = "mt-1 text-xs text-nord11";
const checkboxLabelClasses = "flex items-center p-3 border border-nord3 rounded-lg cursor-pointer hover:bg-nord1 transition-colors duration-150";
const checkboxLabelActiveClasses = "bg-nord1 border-nord8 ring-1 ring-nord8";
const checkboxInputClasses = "h-4 w-4 text-nord8 bg-nord1 border-nord3 rounded focus:ring-nord8 mr-3";
const radioCardClasses = "p-3 border border-nord3 rounded-lg cursor-pointer hover:bg-nord1 transition-colors duration-150 text-center";
const radioCardActiveClasses = "bg-nord1 border-nord8 ring-1 ring-nord8";
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
    defaultValues: {
      domains: [],
      teams: [],
      interviewDates: [],
      interviewTimes: [],
      degreeType: "", // Ensure default for select
      year: "",       // Ensure default for select
      house: "",      // Ensure default for select
      timeCommitment: "", // Ensure default for select
    },
  });

  // Animations (Keep or adapt as needed)
  useEffect(() => {
    if (formRef.current) {
      gsap.from(formRef.current, { opacity: 0, y: 20, duration: 0.5, ease: 'power1.out' });
    }
  }, []);

  useEffect(() => {
      // Animate form step content
      const stepContent = formRef.current?.querySelector(`[data-step="${currentStep}"]`);
      if (stepContent) {
          gsap.fromTo(stepContent, { opacity: 0, y: 15 }, { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out' });
      }

      // Animate progress bar
      if (progressRef.current) {
          gsap.to(progressRef.current, { width: `${formProgress}%`, duration: 0.4, ease: 'power1.out' });
      }
  }, [currentStep, formProgress]);


  // Toast logic (Keep as is)
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => {
        setToast(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const showToast = (message: string, type: 'success' | 'error' | 'warning') => {
    setToast({ message, type, visible: true });
  };

  // Submission logic (Keep as is)
  const onSubmit = async (data: FormData) => {
    try {
      console.log("Submitting:", data); // Log data before sending
      const res = await fetch('/api/recruit', { // Make sure this endpoint exists
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        showToast("Application submitted successfully!", "success");
        reset();
        setCurrentStep(0);
        setFormProgress(0);
      } else {
         const errorData = await res.text(); // Get more error details
         console.error("Submission failed:", res.status, errorData);
        showToast(`Submission failed: ${res.statusText || 'Server error'}. Please try again.`, "error");
      }
    } catch(error) {
        console.error("Submission fetch error:", error);
        showToast("Submission failed. Check console for details.", "error");
    }
  };

  // Step validation logic (Keep as is)
  const getFieldsToValidateForStep = (step: number): (keyof FormData)[] => {
    switch (step) {
      case 0: return ['email', 'fullName', 'degreeType', 'year', 'house'];
      case 1: return ['domains', 'experience'];
      case 2: return ['teams', 'timeCommitment'];
      case 3: return ['interviewDates', 'interviewTimes'];
      default: return [];
    }
  };

  // Navigation logic (Keep as is, updates progress)
  const nextStep = async () => {
    const fieldsToValidate = getFieldsToValidateForStep(currentStep);
    const isStepValid = await trigger(fieldsToValidate as any);

    if (isStepValid) {
        const next = Math.min(currentStep + 1, steps.length - 1);
        setCurrentStep(next);
        // Progress: 0% at step 0, 25% after step 0, ..., 100% after step 3 (before review) or on review step
        setFormProgress(Math.ceil(((currentStep + 1) / (steps.length -1)) * 100));
    } else {
      // Find first error
      const stepErrors = getFieldsToValidateForStep(currentStep).find(field => errors[field]);
      showToast(errors[stepErrors!]?.message || "Please fill in all required fields", "warning");
    }
  };

  const prevStep = () => {
      const prev = Math.max(currentStep - 1, 0);
      setCurrentStep(prev);
      // Recalculate progress based on the new 'previous' step index
      setFormProgress(Math.ceil((prev / (steps.length - 1)) * 100));
  };

  const steps = ["Basic Info", "Expertise", "Teams & Commitment", "Interview", "Review & Submit"];
  const formData = getValues(); // Get current form values for review step

  return (
    <div className="min-h-screen bg-nord0 text-nord6 py-8 px-4 sm:px-6 lg:px-8">
      <div ref={formRef} className="w-full max-w-7xl mx-auto relative z-10">
        {/* Toast notification */}
        <AnimatePresence>
          {toast && (
            <motion.div
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50, transition: { duration: 0.2 } }}
              className={cn(
                "fixed top-5 right-5 z-50 p-4 rounded-md shadow-lg text-nord0",
                 toast.type === "success" && "bg-nord14",
                 toast.type === "error" && "bg-nord11",
                 toast.type === "warning" && "bg-nord13"
              )}
            >
              {toast.message}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Layout: Sidebar + Content */}
        <div className="flex flex-col md:flex-row bg-nord1 rounded-lg shadow-xl overflow-hidden">

          {/* Left Vertical Step Indicator */}
          <div className="w-full md:w-64 flex-shrink-0 bg-nord2 p-6 border-b md:border-b-0 md:border-r border-nord3">
            <h2 className="text-lg font-semibold text-nord6 mb-6 hidden md:block">Application Steps</h2>
            <nav className="flex flex-row md:flex-col md:space-y-4 overflow-x-auto md:overflow-x-visible pb-2 md:pb-0">
              {steps.map((step, index) => (
                <div key={step} className="flex items-center space-x-3 md:space-x-0 md:items-start md:space-y-0 flex-shrink-0 mr-4 md:mr-0 relative group">
                   {/* Vertical line connector (desktop only) */}
                   {index < steps.length - 1 && (
                        <div className="hidden md:block absolute left-[14px] top-[35px] h-full w-px bg-nord3 group-last:hidden" />
                   )}

                  <div className="flex md:flex-row items-center space-x-3">
                    <div
                      className={cn(
                        "w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 ease-in-out relative z-10",
                        currentStep === index
                          ? "bg-nord8 text-nord0 scale-110" // Active
                          : currentStep > index
                          ? "bg-nord14 text-nord0" // Completed
                          : "bg-nord3 text-nord5 border border-nord4" // Inactive
                      )}
                    >
                      {currentStep > index ? (
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path></svg>
                      ) : (
                        index + 1
                      )}
                    </div>
                    <span className={cn(
                        "text-sm font-medium transition-colors duration-300 ease-in-out",
                        currentStep === index ? "text-nord8" : "text-nord4 group-hover:text-nord5"
                    )}>
                      {step}
                    </span>
                  </div>
                </div>
              ))}
            </nav>
          </div>

          {/* Right Content Area */}
          <div className="flex-grow bg-nord0 p-6 md:p-8 lg:p-10 min-w-0">
            {/* Form Header */}
            <div className="mb-6">
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
                      style={{ width: '0%' }} // Initial width set by useEffect/GSAP
                  />
              </div>
            </div>

            {/* Form Steps Content */}
            <form onSubmit={handleSubmit(onSubmit)} className="mt-6">
                {/* Step 1: Basic Information */}
                <div data-step="0" className={cn("space-y-6", currentStep === 0 ? "block" : "hidden")}>
                    <h2 className={headingClasses}>Personal Information</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label htmlFor="email" className={labelClasses}>Email <span className="text-nord11">*</span></label>
                            <input id="email" type="email" placeholder="email-iitm@ds.study.iitm.ac.in" className={cn(baseInputClasses, errors.email && "border-nord11 ring-1 ring-nord11")}
                                {...register('email', { required: "Email is required", pattern: { value: /.+@ds\.study\.iitm\.ac\.in$/, message: "Must be a valid IITM DS email" } })} />
                            {errors.email && <p className={errorClasses}>{errors.email.message}</p>}
                        </div>
                        <div>
                            <label htmlFor="fullName" className={labelClasses}>Full Name <span className="text-nord11">*</span></label>
                            <input id="fullName" placeholder="Your name" className={cn(baseInputClasses, errors.fullName && "border-nord11 ring-1 ring-nord11")}
                                {...register('fullName', { required: "Name is required" })} />
                            {errors.fullName && <p className={errorClasses}>{errors.fullName.message}</p>}
                        </div>
                         <div>
                            <label htmlFor="degreeType" className={labelClasses}>Degree Type <span className="text-nord11">*</span></label>
                            <select id="degreeType" className={cn(baseInputClasses, errors.degreeType && "border-nord11 ring-1 ring-nord11")}
                                {...register('degreeType', { required: "Degree type is required" })}>
                                <option value="" disabled>Select Degree Type...</option>
                                {DEGREE_TYPES.map(type => <option key={type} value={type}>{type}</option>)}
                            </select>
                            {errors.degreeType && <p className={errorClasses}>{errors.degreeType.message}</p>}
                        </div>
                        <div>
                            <label htmlFor="year" className={labelClasses}>Year of Study <span className="text-nord11">*</span></label>
                            <select id="year" className={cn(baseInputClasses, errors.year && "border-nord11 ring-1 ring-nord11")}
                                {...register('year', { required: "Year is required" })}>
                                <option value="" disabled>Select Year...</option>
                                {YEARS.map(year => <option key={year} value={year}>{year}</option>)}
                            </select>
                            {errors.year && <p className={errorClasses}>{errors.year.message}</p>}
                        </div>
                        <div>
                            <label htmlFor="house" className={labelClasses}>House <span className="text-nord11">*</span></label>
                            <select id="house" className={cn(baseInputClasses, errors.house && "border-nord11 ring-1 ring-nord11")}
                                {...register('house', { required: "House is required" })}>
                                <option value="" disabled>Select your house...</option>
                                {HOUSES.map(house => <option key={house} value={house}>{house}</option>)}
                            </select>
                            {errors.house && <p className={errorClasses}>{errors.house.message}</p>}
                        </div>
                        <div>
                            <label htmlFor="linkedin" className={labelClasses}>LinkedIn Profile / Portfolio</label>
                            <input id="linkedin" placeholder="linkedin.com/in/username" className={baseInputClasses} {...register('linkedin')} />
                        </div>
                        <div>
                            <label htmlFor="github" className={labelClasses}>GitHub Profile</label>
                            <input id="github" placeholder="github.com/username" className={baseInputClasses} {...register('github')} />
                        </div>
                    </div>
                    <div className="flex justify-end mt-8">
                        <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} type="button" onClick={nextStep} className={buttonPrimaryClasses}>
                            Next <span aria-hidden="true" className="ml-1">→</span>
                        </motion.button>
                    </div>
                </div>

                 {/* Step 2: Expertise */}
                 <div data-step="1" className={cn("space-y-6", currentStep === 1 ? "block" : "hidden")}>
                    <h2 className={headingClasses}>Technical Expertise</h2>
                    <div>
                        <label className={labelClasses}>Domains of Interest <span className="text-nord11">*</span></label>
                        <p className="text-sm text-nord4 mb-3">Select all domains you're interested in.</p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                            {DOMAINS.map((domain) => (
                                <label key={domain} className={cn(cardSelectionClasses, watch('domains')?.includes(domain) && cardSelectionActiveClasses)}>
                                    <input type="checkbox" value={domain} className={checkboxInputClasses}
                                        {...register('domains', { required: "Select at least one domain" })} />
                                    <span className="text-nord5">{domain}</span>
                                    {watch('domains')?.includes(domain) && (
                                        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute top-2 right-2 w-2 h-2 bg-nord8 rounded-full"/>
                                    )}
                                </label>
                            ))}
                        </div>
                        {errors.domains && <p className={errorClasses}>{errors.domains.message}</p>}
                    </div>
                    <div>
                        <label htmlFor="domainWhy" className={labelClasses}>Why these domains?</label>
                        <textarea id="domainWhy" placeholder="What excites you about these domains? Share your thoughts..." rows={4} className={cn(baseInputClasses, "min-h-[100px]")} {...register('domainWhy')} />
                    </div>
                    <div>
                        <label htmlFor="experience" className={labelClasses}>Technical Experience <span className="text-nord11">*</span></label>
                        <textarea id="experience" placeholder="Share relevant technical experience, projects, or achievements..." rows={5}
                            className={cn(baseInputClasses, "min-h-[120px]", errors.experience && "border-nord11 ring-1 ring-nord11")}
                            {...register('experience', { required: "Please share your technical experience", minLength: { value: 50, message: "Please provide at least 50 characters" } })} />
                        {errors.experience && <p className={errorClasses}>{errors.experience.message}</p>}
                        <p className="text-xs text-nord4 mt-1">{watch('experience')?.length || 0}/50 characters minimum</p>
                    </div>
                    <div className="flex justify-between mt-8">
                        <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} type="button" onClick={prevStep} className={buttonSecondaryClasses}>
                            <span aria-hidden="true" className="mr-1">←</span> Back
                        </motion.button>
                        <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} type="button" onClick={nextStep} className={buttonPrimaryClasses}>
                            Next <span aria-hidden="true" className="ml-1">→</span>
                        </motion.button>
                    </div>
                 </div>

                 {/* Step 3: Teams & Commitment */}
                 <div data-step="2" className={cn("space-y-6", currentStep === 2 ? "block" : "hidden")}>
                    <h2 className={headingClasses}>Teams & Commitment</h2>
                    <div>
                        <label className={labelClasses}>Preferred Teams <span className="text-nord11">*</span></label>
                        <p className="text-sm text-nord4 mb-3">Select the teams you'd like to join.</p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                            {TEAMS.map((team) => (
                                <label key={team} className={cn(cardSelectionClasses, watch('teams')?.includes(team) && cardSelectionActiveClasses, "items-start")}>
                                     <input type="checkbox" value={team} className={cn(checkboxInputClasses, "mt-1")}
                                        {...register('teams', { required: "Select at least one team" })} />
                                    <div className="flex-1">
                                        <p className="font-medium text-nord6">{team}</p>
                                        <p className="text-xs text-nord4">{getTeamDescription(team)}</p>
                                    </div>
                                    {watch('teams')?.includes(team) && (
                                        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute top-2 right-2 w-2 h-2 bg-nord8 rounded-full"/>
                                    )}
                                </label>
                            ))}
                        </div>
                        {errors.teams && <p className={errorClasses}>{errors.teams.message}</p>}
                    </div>
                     <div>
                        <label htmlFor="teamWhy" className={labelClasses}>Why these teams?</label>
                        <textarea id="teamWhy" placeholder="What motivates you to join these teams? What can you contribute?" rows={4} className={cn(baseInputClasses, "min-h-[100px]")} {...register('teamWhy')} />
                    </div>
                    <div>
                        <label htmlFor="motivation" className={labelClasses}>Motivation for Joining Tech Society</label>
                        <textarea id="motivation" placeholder="Why do you want to join? What are your goals?" rows={4} className={cn(baseInputClasses, "min-h-[100px]")} {...register('motivation')} />
                    </div>
                     <div>
                        <label htmlFor="timeCommitment" className={labelClasses}>Time Commitment <span className="text-nord11">*</span></label>
                        <select id="timeCommitment" className={cn(baseInputClasses, errors.timeCommitment && "border-nord11 ring-1 ring-nord11")}
                            {...register('timeCommitment', { required: "Time commitment is required" })}>
                            <option value="" disabled>Select commitment level...</option>
                            {TIME_COMMITMENTS.map(time => <option key={time} value={time}>{time}</option>)}
                        </select>
                        {errors.timeCommitment && <p className={errorClasses}>{errors.timeCommitment.message}</p>}
                    </div>
                    <div className="flex justify-between mt-8">
                        <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} type="button" onClick={prevStep} className={buttonSecondaryClasses}>
                            <span aria-hidden="true" className="mr-1">←</span> Back
                        </motion.button>
                        <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} type="button" onClick={nextStep} className={buttonPrimaryClasses}>
                            Next <span aria-hidden="true" className="ml-1">→</span>
                        </motion.button>
                    </div>
                 </div>

                {/* Step 4: Interview Preferences */}
                 <div data-step="3" className={cn("space-y-6", currentStep === 3 ? "block" : "hidden")}>
                     <h2 className={headingClasses}>Interview Availability</h2>
                    <div>
                        <label className={labelClasses}>Available Dates <span className="text-nord11">*</span></label>
                        <p className="text-sm text-nord4 mb-3">Select all dates you're available.</p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                            {INTERVIEW_DATES.map((date) => (
                                <label key={date} className={cn(cardSelectionClasses, watch('interviewDates')?.includes(date) && cardSelectionActiveClasses)}>
                                    <input type="checkbox" value={date} className={checkboxInputClasses}
                                        {...register('interviewDates', { required: "Select at least one date" })} />
                                    <span className="text-nord5">{date}</span>
                                     {watch('interviewDates')?.includes(date) && (
                                        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute top-2 right-2 w-2 h-2 bg-nord8 rounded-full"/>
                                    )}
                                </label>
                            ))}
                        </div>
                        {errors.interviewDates && <p className={errorClasses}>{errors.interviewDates.message}</p>}
                    </div>
                     <div>
                        <label className={labelClasses}>Preferred Time Slots <span className="text-nord11">*</span></label>
                        <p className="text-sm text-nord4 mb-3">Select all time slots that work for you (Timezone: IST).</p>
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                            {INTERVIEW_TIMES.map((time) => (
                                <label key={time} className={cn(cardSelectionClasses, watch('interviewTimes')?.includes(time) && cardSelectionActiveClasses)}>
                                    <input type="checkbox" value={time} className={checkboxInputClasses}
                                        {...register('interviewTimes', { required: "Select at least one time slot" })} />
                                    <span className="text-nord5">{time}</span>
                                     {watch('interviewTimes')?.includes(time) && (
                                        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute top-2 right-2 w-2 h-2 bg-nord8 rounded-full"/>
                                    )}
                                </label>
                            ))}
                        </div>
                        {errors.interviewTimes && <p className={errorClasses}>{errors.interviewTimes.message}</p>}
                    </div>
                     <div>
                        <label htmlFor="additionalInfo" className={labelClasses}>Additional Information</label>
                        <textarea id="additionalInfo" placeholder="Anything else we should know? (e.g., specific unavailability)" rows={4} className={cn(baseInputClasses, "min-h-[100px]")} {...register('additionalInfo')} />
                    </div>
                    <div className="flex justify-between mt-8">
                        <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} type="button" onClick={prevStep} className={buttonSecondaryClasses}>
                            <span aria-hidden="true" className="mr-1">←</span> Back
                        </motion.button>
                        <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} type="button" onClick={nextStep} className={buttonPrimaryClasses}>
                            Review <span aria-hidden="true" className="ml-1">→</span>
                        </motion.button>
                    </div>
                 </div>

                {/* Step 5: Review & Submit */}
                <div data-step="4" className={cn("space-y-6", currentStep === 4 ? "block" : "hidden")}>
                    <h2 className={headingClasses}>Review Your Application</h2>
                    <p className="text-nord5 text-sm">Please review your information carefully before submitting. You cannot edit after submission.</p>

                    {/* Review Sections */}
                    <div className="space-y-6">
                        {/* Section 1: Personal Info */}
                        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                            className="bg-nord1 p-4 rounded-lg border border-nord3">
                            <h3 className="text-md font-semibold text-nord8 mb-3">Personal Information</h3>
                            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2 text-sm">
                                <div className="sm:col-span-1"><dt className="text-nord4">Name:</dt><dd className="text-nord6">{formData.fullName || '-'}</dd></div>
                                <div className="sm:col-span-1"><dt className="text-nord4">Email:</dt><dd className="text-nord6">{formData.email || '-'}</dd></div>
                                <div className="sm:col-span-1"><dt className="text-nord4">Degree:</dt><dd className="text-nord6">{formData.degreeType || '-'}</dd></div>
                                <div className="sm:col-span-1"><dt className="text-nord4">Year:</dt><dd className="text-nord6">{formData.year || '-'}</dd></div>
                                <div className="sm:col-span-1"><dt className="text-nord4">House:</dt><dd className="text-nord6">{formData.house || '-'}</dd></div>
                                <div className="sm:col-span-1"><dt className="text-nord4">LinkedIn:</dt><dd className="text-nord6">{formData.linkedin || '-'}</dd></div>
                                <div className="sm:col-span-1"><dt className="text-nord4">GitHub:</dt><dd className="text-nord6">{formData.github || '-'}</dd></div>
                            </dl>
                        </motion.div>

                         {/* Section 2: Expertise */}
                         <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                            className="bg-nord1 p-4 rounded-lg border border-nord3">
                            <h3 className="text-md font-semibold text-nord8 mb-3">Technical Expertise</h3>
                             <dl className="space-y-3 text-sm">
                                <div>
                                    <dt className="text-nord4 mb-1">Domains of Interest:</dt>
                                    <dd className="flex flex-wrap gap-2">
                                        {formData.domains?.length > 0
                                            ? formData.domains.map(d => <span key={d} className="bg-nord9/30 text-nord6 px-2 py-0.5 rounded text-xs">{d}</span>)
                                            : <span className="text-nord4 italic">-</span>}
                                    </dd>
                                </div>
                                 <div>
                                    <dt className="text-nord4 mb-1">Domain Motivation:</dt>
                                    <dd className="text-nord6 whitespace-pre-wrap">{formData.domainWhy || <span className="text-nord4 italic">-</span>}</dd>
                                 </div>
                                 <div>
                                    <dt className="text-nord4 mb-1">Experience:</dt>
                                    <dd className="text-nord6 whitespace-pre-wrap">{formData.experience || <span className="text-nord4 italic">-</span>}</dd>
                                </div>
                            </dl>
                        </motion.div>

                        {/* Section 3: Teams & Commitment */}
                        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
                            className="bg-nord1 p-4 rounded-lg border border-nord3">
                            <h3 className="text-md font-semibold text-nord8 mb-3">Teams & Commitment</h3>
                            <dl className="space-y-3 text-sm">
                                <div>
                                    <dt className="text-nord4 mb-1">Preferred Teams:</dt>
                                    <dd className="flex flex-wrap gap-2">
                                        {formData.teams?.length > 0
                                            ? formData.teams.map(t => <span key={t} className="bg-nord10/30 text-nord6 px-2 py-0.5 rounded text-xs">{t}</span>)
                                            : <span className="text-nord4 italic">-</span>}
                                    </dd>
                                </div>
                                <div>
                                    <dt className="text-nord4 mb-1">Team Motivation:</dt>
                                    <dd className="text-nord6 whitespace-pre-wrap">{formData.teamWhy || <span className="text-nord4 italic">-</span>}</dd>
                                 </div>
                                 <div>
                                    <dt className="text-nord4 mb-1">Society Motivation:</dt>
                                    <dd className="text-nord6 whitespace-pre-wrap">{formData.motivation || <span className="text-nord4 italic">-</span>}</dd>
                                 </div>
                                <div>
                                    <dt className="text-nord4">Time Commitment:</dt>
                                    <dd className="text-nord6">{formData.timeCommitment || <span className="text-nord4 italic">-</span>}</dd>
                                </div>
                            </dl>
                        </motion.div>

                        {/* Section 4: Interview */}
                        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
                            className="bg-nord1 p-4 rounded-lg border border-nord3">
                            <h3 className="text-md font-semibold text-nord8 mb-3">Interview Availability</h3>
                            <dl className="space-y-3 text-sm">
                                <div>
                                    <dt className="text-nord4 mb-1">Available Dates:</dt>
                                    <dd className="flex flex-wrap gap-2">
                                         {formData.interviewDates?.length > 0
                                            ? formData.interviewDates.map(d => <span key={d} className="bg-nord14/30 text-nord6 px-2 py-0.5 rounded text-xs">{d}</span>)
                                            : <span className="text-nord4 italic">-</span>}
                                    </dd>
                                </div>
                                <div>
                                    <dt className="text-nord4 mb-1">Preferred Times (IST):</dt>
                                    <dd className="flex flex-wrap gap-2">
                                         {formData.interviewTimes?.length > 0
                                            ? formData.interviewTimes.map(t => <span key={t} className="bg-nord7/30 text-nord6 px-2 py-0.5 rounded text-xs">{t}</span>)
                                            : <span className="text-nord4 italic">-</span>}
                                    </dd>
                                </div>
                                 <div>
                                    <dt className="text-nord4 mb-1">Additional Information:</dt>
                                    <dd className="text-nord6 whitespace-pre-wrap">{formData.additionalInfo || <span className="text-nord4 italic">-</span>}</dd>
                                 </div>
                            </dl>
                        </motion.div>
                    </div>

                    {/* Navigation/Submit Buttons */}
                    <div className="flex justify-between mt-10 pt-6 border-t border-nord3">
                        <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} type="button" onClick={prevStep} className={buttonSecondaryClasses}>
                            <span aria-hidden="true" className="mr-1">←</span> Back
                        </motion.button>
                        <motion.button
                            whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                            type="submit"
                            disabled={isSubmitting}
                            className={cn(
                                buttonPrimaryClasses, "bg-nord14 hover:bg-nord14/80",
                                "disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-nord3"
                            )}
                        >
                            {isSubmitting ? (
                                <>
                                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-nord0" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Submitting...
                                </>
                            ) : 'Submit Application'}
                        </motion.button>
                    </div>
                </div>
            </form>

             {/* Footer */}
             <div className="text-center text-xs text-nord4 mt-8 pt-4 border-t border-nord3">
                 Tech Society Recruitment Form © {new Date().getFullYear()}.
                 For Indian Institute of Technology Madras students only.
             </div>

          </div> {/* End Right Content Area */}
        </div> {/* End Main Layout Flex */}
      </div> {/* End Max Width Container */}
    </div> // End Page Container
  );
}