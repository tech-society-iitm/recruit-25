'use client';
import { useState, useRef, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import gsap from 'gsap';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

// Form data constants
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

// Helper function to get team descriptions
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

export default function Home() {
  const [currentStep, setCurrentStep] = useState(0);
  const [formProgress, setFormProgress] = useState(0);
  const formRef = useRef<HTMLDivElement>(null);
  const tabsRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
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
  } = useForm<FormData>({
    defaultValues: {
      domains: [],
      teams: [],
      interviewDates: [],
      interviewTimes: [],
    },
  });

  // Enhanced animations for form elements with Nord theme colors
  useEffect(() => {
    if (formRef.current) {
      gsap.from(formRef.current, { 
        opacity: 0, 
        y: 30, 
        duration: 0.8, 
        ease: 'power3.out' 
      });
    }

    if (headerRef.current) {
      gsap.timeline()
        .from(headerRef.current.querySelector('h1'), {
          opacity: 0,
          y: -20,
          duration: 0.8,
          ease: 'back.out(1.7)'
        })
        .from(headerRef.current.querySelector('p'), {
          opacity: 0,
          y: -10,
          duration: 0.5,
          ease: 'power2.out'
        }, "-=0.4")
        .from(progressRef.current, {
          scaleX: 0,
          duration: 0.6,
          ease: 'power2.inOut'
        }, "-=0.2");
    }
  }, []);

  // Animation for tab changes
  useEffect(() => {
    if (tabsRef.current) {
      const tabPanels = tabsRef.current.querySelectorAll('[data-tab-panel]');
      if (tabPanels[currentStep]) {
        gsap.fromTo(
          tabPanels[currentStep],
          { opacity: 0, y: 15 },
          { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }
        );
      }
    }

    // Animate progress bar
    if (progressRef.current) {
      gsap.to(progressRef.current, {
        width: `${formProgress}%`,
        duration: 0.4,
        ease: 'power1.out'
      });
    }
  }, [currentStep, formProgress]);

  // Close toast after 3 seconds
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

  const onSubmit = async (data: FormData) => {
    try {
      const res = await fetch('/api/recruit', {
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
        showToast("Submission failed. Please try again later.", "error");
      }
    } catch {
      showToast("Submission failed. Please check your connection and try again.", "error");
    }
  };

  const getFieldsToValidateForStep = (step: number): (keyof FormData)[] => {
    switch (step) {
      case 0: return ['email', 'fullName', 'degreeType', 'year', 'house'];
      case 1: return ['domains', 'experience'];
      case 2: return ['teams', 'timeCommitment'];
      case 3: return ['interviewDates', 'interviewTimes'];
      default: return [];
    }
  };

  const nextStep = async () => {
    const fieldsToValidate = getFieldsToValidateForStep(currentStep);
    const isStepValid = await trigger(fieldsToValidate as any);
    
    if (isStepValid) {
      setCurrentStep(Math.min(currentStep + 1, 4));
      setFormProgress(Math.ceil(((currentStep + 1) / 4) * 100));
    } else {
      showToast("Please fill in all required fields", "warning");
    }
  };

  const prevStep = () => {
    setCurrentStep(Math.max(currentStep - 1, 0));
    setFormProgress(Math.ceil(((currentStep - 1) / 4) * 100));
  };

  const steps = ["Basic Info", "Expertise", "Teams & Commitment", "Interview", "Review & Submit"];

  return (
    <div className="min-h-screen py-8 px-4">
      <div ref={formRef} className="w-full max-w-4xl mx-auto relative z-10">
        {/* Toast notification */}
        <AnimatePresence>
          {toast && (
            <motion.div 
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              className={cn(
                "toast",
                toast.type === "success" && "toast-success",
                toast.type === "error" && "toast-error",
                toast.type === "warning" && "toast-warning"
              )}
            >
              {toast.message}
            </motion.div>
          )}
        </AnimatePresence>

        <div className="form-card">
          {/* Form Header */}
          <div ref={headerRef} className="form-header">
            <h1 className="form-title">
              Tech Society Recruitment Form
            </h1>
            <p className="form-subtitle">
              Join our innovative community of tech enthusiasts
            </p>
            
            {/* Progress bar */}
            <div className="progress-container">
              <motion.div 
                ref={progressRef}
                className="progress-bar" 
                initial={{ width: 0 }}
                animate={{ width: `${formProgress}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </div>

          {/* Step indicators */}
          <div className="step-indicator p-4 border-b border-nord3">
            {steps.map((step, index) => (
              <div key={step} className="flex flex-col items-center">
                <div 
                  className={cn(
                    "step-dot",
                    currentStep === index && "step-dot-active",
                    currentStep > index && "step-dot-completed",
                    currentStep < index && "step-dot-inactive"
                  )}
                >
                  {currentStep > index ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    index + 1
                  )}
                </div>
                <span className="text-xs mt-2 hidden sm:block text-nord4">{step}</span>
                {index < steps.length - 1 && (
                  <div className="hidden sm:block absolute h-px w-full" style={{
                    left: `calc(${(index + 0.5) * 100 / steps.length}%)`,
                    right: `calc(${(index + 1.5) * 100 / steps.length}%)`,
                    top: '20px',
                    width: `calc(${100 / steps.length}%)`
                  }}>
                    <div className={cn(
                      "step-line",
                      currentStep > index && "step-line-active"
                    )} />
                  </div>
                )}
              </div>
            ))}
          </div>

          <form onSubmit={handleSubmit(onSubmit)}>
            <div ref={tabsRef} className="p-6">
              {/* Step 1: Basic Information */}
              <div 
                data-tab-panel
                className={cn("space-y-6", currentStep === 0 ? "block" : "hidden")}
              >
                <div className="flex items-center">
                  <h2 className="text-xl font-semibold text-nord6">Personal Information</h2>
                  <div className="h-px bg-nord3 flex-grow ml-4"></div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="input-label">
                      Email <span className="text-nord11">*</span>
                    </label>
                    <input 
                      type="email" 
                      placeholder="email-iitm@ds.study.iitm.ac.in" 
                      className={cn(
                        "w-full px-4 py-2 rounded-lg transition-colors text-black",
                        errors.email && "border-nord11"
                      )}
                      {...register('email', { 
                        required: "Email is required", 
                        pattern: { 
                          value: /.+@ds\.study\.iitm\.ac\.in$/, 
                          message: "Must be a valid IITM DS email" 
                        } 
                      })}
                    />
                    {errors.email && (
                      <p className="input-error">{errors.email.message}</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="input-label">
                      Full Name <span className="text-nord11">*</span>
                    </label>
                    <input 
                      placeholder="Your name" 
                      className={cn(
                        "w-full px-4 py-2 rounded-lg transition-colors",
                        errors.fullName && "border-nord11"
                      )}
                      {...register('fullName', { required: "Name is required" })}
                    />
                    {errors.fullName && (
                      <p className="input-error">{errors.fullName.message}</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="input-label">
                      House <span className="text-nord11">*</span>
                    </label>
                    <select 
                      className={cn(
                        "w-full px-4 py-2 rounded-lg transition-colors",
                        errors.house && "border-nord11"
                      )}
                      {...register('house', { required: "House is required" })}
                    >
                      <option value="">Select your house</option>
                      {HOUSES.map((house) => (
                        <option key={house} value={house}>{house}</option>
                      ))}
                    </select>
                    {errors.house && (
                      <p className="input-error">{errors.house.message}</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="input-label">
                      LinkedIn Profile / Portfolio
                    </label>
                    <input 
                      placeholder="linkedin.com/in/username" 
                      className="w-full px-4 py-2 rounded-lg transition-colors"
                      {...register('linkedin')} 
                    />
                  </div>
                </div>
                
                <div>
                  <label className="input-label mb-2">
                    Degree Type <span className="text-nord11">*</span>
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {DEGREE_TYPES.map((type) => (
                      <label 
                        key={type} 
                        className={cn(
                          "card-selection",
                          watch('degreeType') === type 
                            ? "card-selection-active" 
                            : "card-selection-inactive"
                        )}
                      >
                        <input
                          type="radio"
                          value={type}
                          className="sr-only"
                          {...register('degreeType', { required: "Degree type is required" })}
                        />
                        <span className="block text-center">{type}</span>
                      </label>
                    ))}
                  </div>
                  {errors.degreeType && (
                    <p className="input-error">{errors.degreeType.message}</p>
                  )}
                </div>
                
                <div>
                  <label className="input-label mb-2">
                    Year of Study <span className="text-nord11">*</span>
                  </label>
                  <div className="flex flex-wrap gap-4">
                    {YEARS.map((year) => (
                      <label key={year} className="flex items-center space-x-2">
                        <input
                          type="radio"
                          value={year}
                          className="w-4 h-4"
                          {...register('year', { required: "Year is required" })}
                        />
                        <span className="text-nord5">{year}</span>
                      </label>
                    ))}
                  </div>
                  {errors.year && (
                    <p className="input-error">{errors.year.message}</p>
                  )}
                </div>
                
                <div className="flex justify-end mt-8">
                  <motion.button 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    type="button"
                    onClick={nextStep}
                    className="btn-primary"
                  >
                    Next <span className="ml-1">→</span>
                  </motion.button>
                </div>
              </div>

              {/* Step 2: Expertise */}
              <div 
                data-tab-panel
                className={cn("space-y-6", currentStep === 1 ? "block" : "hidden")}
              >
                <div className="flex items-center">
                  <h2 className="text-xl font-semibold text-nord6">Technical Expertise</h2>
                  <div className="h-px bg-nord3 flex-grow ml-4"></div>
                </div>
                
                <div className="space-y-6">
                  <div>
                    <label className="input-label mb-2">
                      Domains of Interest <span className="text-nord11">*</span>
                    </label>
                    <p className="text-sm text-nord4 mb-3">Select all domains you're interested in</p>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                      {DOMAINS.map((domain) => (
                        <label 
                          key={domain} 
                          className={cn(
                            "card-selection flex items-start",
                            watch('domains')?.includes(domain) 
                              ? "card-selection-active" 
                              : "card-selection-inactive"
                          )}
                        >
                          <input
                            type="checkbox"
                            value={domain}
                            className="mt-1 mr-3"
                            {...register('domains', { required: "Select at least one domain" })}
                          />
                          <span className="text-nord5">{domain}</span>
                          {watch('domains')?.includes(domain) && (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className="absolute top-2 right-2 w-2 h-2 bg-nord8 rounded-full"
                            />
                          )}
                        </label>
                      ))}
                    </div>
                    {errors.domains && (
                      <p className="input-error">{errors.domains.message}</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="input-label">
                      Why these domains?
                    </label>
                    <textarea 
                      placeholder="What excites you about these domains? Share your thoughts..."
                      className="w-full px-4 py-2 rounded-lg min-h-[120px]"
                      {...register('domainWhy')}
                    />
                  </div>
                  
                  <div>
                    <label className="input-label">
                      Technical Experience <span className="text-nord11">*</span>
                    </label>
                    <textarea 
                      placeholder="Share your relevant technical experience, projects, or achievements..."
                      className={cn(
                        "w-full px-4 py-2 rounded-lg min-h-[150px]",
                        errors.experience && "border-nord11"
                      )}
                      {...register('experience', { 
                        required: "Please share your technical experience",
                        minLength: { value: 100, message: "Please provide at least 100 characters" }
                      })}
                    />
                    {errors.experience && (
                      <p className="input-error">{errors.experience.message}</p>
                    )}
                    <p className="text-sm text-nord4 mt-1">
                      {watch('experience')?.length || 0}/100 characters minimum
                    </p>
                  </div>
                </div>
                
                <div className="flex justify-between mt-8">
                  <motion.button 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    type="button"
                    onClick={prevStep}
                    className="btn-secondary"
                  >
                    <span className="mr-1">←</span> Back
                  </motion.button>
                  <motion.button 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    type="button"
                    onClick={nextStep}
                    className="btn-primary"
                  >
                    Next <span className="ml-1">→</span>
                  </motion.button>
                </div>
              </div>
              
              {/* Step 3: Teams & Commitment */}
              <div 
                data-tab-panel
                className={cn("space-y-6", currentStep === 2 ? "block" : "hidden")}
              >
                <div className="flex items-center">
                  <h2 className="text-xl font-semibold text-nord6">Teams & Commitment</h2>
                  <div className="h-px bg-nord3 flex-grow ml-4"></div>
                </div>
                
                <div className="space-y-6">
                  <div>
                    <label className="input-label mb-2">
                      Preferred Teams <span className="text-nord11">*</span>
                    </label>
                    <p className="text-sm text-nord4 mb-3">Select the teams you'd like to join</p>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                      {TEAMS.map((team) => (
                        <label 
                          key={team} 
                          className={cn(
                            "card-selection",
                            watch('teams')?.includes(team) 
                              ? "card-selection-active" 
                              : "card-selection-inactive"
                          )}
                        >
                          <div className="flex items-start">
                            <input
                              type="checkbox"
                              value={team}
                              className="mt-1 mr-3"
                              {...register('teams', { required: "Select at least one team" })}
                            />
                            <div>
                              <p className="text-nord6 font-medium">{team}</p>
                              <p className="text-sm text-nord4">{getTeamDescription(team)}</p>
                            </div>
                          </div>
                          {watch('teams')?.includes(team) && (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className="absolute top-2 right-2 w-2 h-2 bg-nord8 rounded-full"
                            />
                          )}
                        </label>
                      ))}
                    </div>
                    {errors.teams && (
                      <p className="input-error">{errors.teams.message}</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="input-label">
                      Why these teams?
                    </label>
                    <textarea 
                      placeholder="What motivates you to join these teams? What can you contribute?"
                      className="w-full px-4 py-2 rounded-lg min-h-[120px]"
                      {...register('teamWhy')}
                    />
                  </div>
                  
                  <div>
                    <label className="input-label mb-2">
                      Time Commitment <span className="text-nord11">*</span>
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                      {TIME_COMMITMENTS.map((commitment) => (
                        <label
                          key={commitment}
                          className={cn(
                            "card-selection",
                            watch('timeCommitment') === commitment 
                              ? "card-selection-active" 
                              : "card-selection-inactive"
                          )}
                        >
                          <input
                            type="radio"
                            value={commitment}
                            className="sr-only"
                            {...register('timeCommitment', { required: "Time commitment is required" })}
                          />
                          <span className="block text-center">{commitment}</span>
                          {watch('timeCommitment') === commitment && (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className="absolute top-2 right-2 w-2 h-2 bg-nord8 rounded-full"
                            />
                          )}
                        </label>
                      ))}
                    </div>
                    {errors.timeCommitment && (
                      <p className="input-error">{errors.timeCommitment.message}</p>
                    )}
                  </div>
                </div>
                
                <div className="flex justify-between mt-8">
                  <motion.button 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    type="button"
                    onClick={prevStep}
                    className="btn-secondary"
                  >
                    <span className="mr-1">←</span> Back
                  </motion.button>
                  <motion.button 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    type="button"
                    onClick={nextStep}
                    className="btn-primary"
                  >
                    Next <span className="ml-1">→</span>
                  </motion.button>
                </div>
              </div>
              
              {/* Step 4: Interview Preferences */}
              <div 
                data-tab-panel
                className={cn("space-y-6", currentStep === 3 ? "block" : "hidden")}
              >
                <div className="flex items-center">
                  <h2 className="text-xl font-semibold text-nord6">Interview Availability</h2>
                  <div className="h-px bg-nord3 flex-grow ml-4"></div>
                </div>
                
                <div className="space-y-6">
                  <div>
                    <label className="input-label mb-2">
                      Available Dates <span className="text-nord11">*</span>
                    </label>
                    <p className="text-sm text-nord4 mb-3">Select all dates you're available</p>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                      {INTERVIEW_DATES.map((date) => (
                        <label
                          key={date}
                          className={cn(
                            "card-selection",
                            watch('interviewDates')?.includes(date) 
                              ? "card-selection-active" 
                              : "card-selection-inactive"
                          )}
                        >
                          <input
                            type="checkbox"
                            value={date}
                            className="sr-only"
                            {...register('interviewDates', { required: "Select at least one date" })}
                          />
                          <span className="block text-center">{date}</span>
                          {watch('interviewDates')?.includes(date) && (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className="absolute top-2 right-2 w-2 h-2 bg-nord8 rounded-full"
                            />
                          )}
                        </label>
                      ))}
                    </div>
                    {errors.interviewDates && (
                      <p className="input-error">{errors.interviewDates.message}</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="input-label mb-2">
                      Preferred Time Slots <span className="text-nord11">*</span>
                    </label>
                    <p className="text-sm text-nord4 mb-3">Select all time slots that work for you</p>
                    
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {INTERVIEW_TIMES.map((time) => (
                        <label
                          key={time}
                          className={cn(
                            "card-selection",
                            watch('interviewTimes')?.includes(time) 
                              ? "card-selection-active" 
                              : "card-selection-inactive"
                          )}
                        >
                          <input
                            type="checkbox"
                            value={time}
                            className="sr-only"
                            {...register('interviewTimes', { required: "Select at least one time" })}
                          />
                          <span className="block text-center">{time}</span>
                          {watch('interviewTimes')?.includes(time) && (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className="absolute top-2 right-2 w-2 h-2 bg-nord8 rounded-full"
                            />
                          )}
                        </label>
                      ))}
                    </div>
                    {errors.interviewTimes && (
                      <p className="input-error">{errors.interviewTimes.message}</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="input-label">
                      Additional Information
                    </label>
                    <textarea 
                      placeholder="Any additional information you'd like to share..."
                      className="w-full px-4 py-2 rounded-lg min-h-[120px]"
                      {...register('additionalInfo')}
                    />
                  </div>
                </div>
                
                <div className="flex justify-between mt-8">
                  <motion.button 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    type="button"
                    onClick={prevStep}
                    className="btn-secondary"
                  >
                    <span className="mr-1">←</span> Back
                  </motion.button>
                  <motion.button 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    type="button"
                    onClick={nextStep}
                    className="btn-primary"
                  >
                    Review <span className="ml-1">→</span>
                  </motion.button>
                </div>
              </div>
              
              {/* Step 5: Review & Submit */}
              <div 
                data-tab-panel
                className={cn("space-y-6", currentStep === 4 ? "block" : "hidden")}
              >
                <div className="flex items-center">
                  <h2 className="text-xl font-semibold text-nord6">Review Your Application</h2>
                  <div className="h-px bg-nord3 flex-grow ml-4"></div>
                </div>
                
                <p className="text-nord5">
                  Please review your information before submitting. You cannot edit your application after submission.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-nord2/50 p-4 rounded-lg border border-nord3"
                  >
                    <h3 className="text-md font-semibold text-nord8 mb-3">Personal Information</h3>
                    <div className="space-y-2">
                      <p><span className="text-nord4">Name:</span> {watch('fullName') || '-'}</p>
                      <p><span className="text-nord4">Email:</span> {watch('email') || '-'}</p>
                      <p><span className="text-nord4">Degree:</span> {watch('degreeType') || '-'}</p>
                      <p><span className="text-nord4">Year:</span> {watch('year') || '-'}</p>
                      <p><span className="text-nord4">House:</span> {watch('house') || '-'}</p>
                    </div>
                  </motion.div>
                  
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-nord2/50 p-4 rounded-lg border border-nord3"
                  >
                    <h3 className="text-md font-semibold text-nord8 mb-3">Teams & Commitment</h3>
                    <div className="space-y-2">
                      <div className="space-y-1">
                        <p className="text-nord4">Teams:</p>
                        <div className="flex flex-wrap gap-2">
                          {watch('teams')?.map((team) => (
                            <span key={team} className="bg-nord9/30 text-nord6 px-2 py-1 rounded text-sm">
                              {team}
                            </span>
                          )) || '-'}
                        </div>
                      </div>
                      <p><span className="text-nord4">Commitment:</span> {watch('timeCommitment') || '-'}</p>
                    </div>
                  </motion.div>
                  
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="bg-nord2/50 p-4 rounded-lg border border-nord3"
                  >
                    <h3 className="text-md font-semibold text-nord8 mb-3">Technical Expertise</h3>
                    <div className="space-y-2">
                      <div className="space-y-1">
                        <p className="text-nord4">Domains:</p>
                        <div className="flex flex-wrap gap-2">
                          {watch('domains')?.map((domain) => (
                            <span key={domain} className="bg-nord10/30 text-nord6 px-2 py-1 rounded text-sm">
                              {domain}
                            </span>
                          )) || '-'}
                        </div>
                      </div>
                      <div>
                        <p className="text-nord4">Experience:</p>
                        <p className="text-sm text-nord5 mt-1">
                          {watch('experience') ? 
                            `${watch('experience').substring(0, 100)}${watch('experience').length > 100 ? '...' : ''}` 
                            : '-'}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                  
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="bg-nord2/50 p-4 rounded-lg border border-nord3"
                  >
                    <h3 className="text-md font-semibold text-nord8 mb-3">Interview Availability</h3>
                    <div className="space-y-2">
                      <div className="space-y-1">
                        <p className="text-nord4">Available Dates:</p>
                        <div className="flex flex-wrap gap-2">
                          {watch('interviewDates')?.map((date) => (
                            <span key={date} className="bg-nord14/30 text-nord6 px-2 py-1 rounded text-sm">
                              {date}
                            </span>
                          )) || '-'}
                        </div>
                      </div>
                      <div className="space-y-1">
                        <p className="text-nord4">Time Slots:</p>
                        <div className="flex flex-wrap gap-2">
                          {watch('interviewTimes')?.map((time) => (
                            <span key={time} className="bg-nord7/30 text-nord6 px-2 py-1 rounded text-sm">
                              {time}
                            </span>
                          )) || '-'}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </div>
                
                <div className="flex justify-between mt-8">
                  <motion.button 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    type="button"
                    onClick={prevStep}
                    className="btn-secondary"
                  >
                    <span className="mr-1">←</span> Back
                  </motion.button>
                  <motion.button 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    type="submit"
                    disabled={isSubmitting}
                    className={cn(
                      "bg-nord14 text-nord0 px-6 py-2 rounded-lg shadow-md hover:bg-nord14/90 focus:outline-none focus:ring-2 focus:ring-nord14 focus:ring-offset-2 focus:ring-offset-nord1 transition-colors",
                      "disabled:opacity-50 disabled:cursor-not-allowed"
                    )}
                  >
                    {isSubmitting ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 inline-block" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                        Submitting...
                      </>
                    ) : (
                      'Submit Application'
                    )}
                  </motion.button>
                </div>
              </div>
            </div>
          </form>
          
          <div className="text-center text-xs text-nord4 p-4 border-t border-nord3">
            Technical Society Recruitment Form &copy; {new Date().getFullYear()}. 
            This form is for Indian Institute of Technology Madras students only.
          </div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute top-20 right-8 w-64 h-64 bg-nord10/5 rounded-full blur-3xl -z-10"></div>
        <div className="absolute bottom-20 left-8 w-64 h-64 bg-nord8/5 rounded-full blur-3xl -z-10"></div>
      </div>
    </div>
  );
}
