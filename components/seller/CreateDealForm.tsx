'use client';

import React, { useState } from 'react';
import {
  Box,
  Typography,
  Stack,
  Paper,
  Button,
  Chip,
  IconButton,
  Checkbox,
  FormControlLabel,
  Radio,
  RadioGroup,
  FormControl,
  FormLabel,
  TextField as MuiTextField,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Tooltip,
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Info as InfoIcon,
  ExpandMore as ExpandMoreIcon,
} from '@mui/icons-material';
import { TextField } from '@/components/forms/TextField';
import { designTokens } from '@/lib/theme/tokens';

export interface DealFormData {
  // Basic Information
  title: string;
  urlSlug: string;
  shortDescription: string;
  fullDescription: string;
  
  // Media & Resources
  coverImageUrl: string;
  videoUrl: string;
  launchUrl: string;
  supportEmail: string;
  
  // Features & Benefits
  features: string[];
  killsList: string[];
  
  // Landing Page Content
  galleryImages: string[];
  faqs: Array<{ question: string; answer: string }>;
  testimonials: Array<{ name: string; text: string; rating: number }>;
  usageStats: {
    activeUsers: string;
    totalSessions: string;
    averageRating: string;
  };
  
  // Pricing Configuration
  oneTimePrice: string;
  setupFee: string;
  pricingModel: 'one_time' | 'subscription';
  monthlySubscriptionPrice: string;
  annualSubscriptionPrice: string;
  
  // Listing Type
  listingType: 'lifetime_deal' | 'marketplace_listing';
  subscriptionInterval?: 'monthly' | 'annual';
  
  // Technical Configuration
  requiresSelfHosting: boolean;
  
  // Deal Type
  dealType: 'lifetime' | 'annual' | 'one-time';
  category: string;
  tags: string[];
}

interface CreateDealFormProps {
  initialData?: Partial<DealFormData>;
  onSubmit: (data: DealFormData, status: 'draft' | 'pending_review') => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

// Auto-expanding textarea component that matches MUI outlined style
interface AutoExpandingTextareaProps {
  label?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  error?: boolean;
  helperText?: string;
  required?: boolean;
  maxLength?: number;
  minRows?: number;
  maxRows?: number;
  placeholder?: string;
}

const AutoExpandingTextarea: React.FC<AutoExpandingTextareaProps> = ({
  label,
  value,
  onChange,
  error = false,
  helperText,
  required = false,
  maxLength,
  minRows = 3,
  maxRows = 15,
  placeholder,
}) => {
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);
  const [isFocused, setIsFocused] = React.useState(false);

  React.useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    // Reset height to calculate new height
    textarea.style.height = 'auto';
    const scrollHeight = textarea.scrollHeight;
    
    // Calculate min and max heights based on line height
    const computedStyle = window.getComputedStyle(textarea);
    const lineHeight = parseFloat(computedStyle.lineHeight) || 20;
    const paddingTop = parseFloat(computedStyle.paddingTop) || 14;
    const paddingBottom = parseFloat(computedStyle.paddingBottom) || 14;
    const borderTop = parseFloat(computedStyle.borderTopWidth) || 0;
    const borderBottom = parseFloat(computedStyle.borderBottomWidth) || 0;
    const padding = paddingTop + paddingBottom + borderTop + borderBottom;
    
    const minHeight = minRows * lineHeight + padding;
    const maxHeight = maxRows * lineHeight + padding;
    
    // Set height within bounds
    const newHeight = Math.max(minHeight, Math.min(maxHeight, scrollHeight));
    textarea.style.height = `${newHeight}px`;
    textarea.style.overflowY = scrollHeight > maxHeight ? 'auto' : 'hidden';
  }, [value, minRows, maxRows]);

  return (
    <Box>
      {label && (
        <Typography
          variant="caption"
          sx={{
            mb: 1,
            display: 'block',
            color: error ? 'error.main' : 'text.secondary',
          }}
        >
          {label} {required && '*'}
        </Typography>
      )}
      <Box
        sx={(theme) => ({
          position: 'relative',
          width: '100%',
          '& textarea': {
            width: '100%',
            minHeight: 'auto',
            padding: '14px',
            fontFamily: theme.typography.fontFamily,
            fontSize: '1rem',
            lineHeight: 1.5,
            color: theme.palette.text.primary,
            backgroundColor: designTokens.colors.surface.subtle,
            border: `1px solid ${
              error 
                ? theme.palette.error.main 
                : isFocused 
                  ? theme.palette.primary.main 
                  : 'rgba(0, 0, 0, 0.23)'
            }`,
            borderRadius: '4px',
            resize: 'vertical',
            overflowY: 'auto',
            overflowX: 'hidden',
            outline: 'none',
            transition: 'border-color 200ms cubic-bezier(0.0, 0, 0.2, 1) 0ms',
            boxSizing: 'border-box',
            display: 'block',
            wordWrap: 'break-word',
            whiteSpace: 'pre-wrap',
            '&:hover:not(:focus)': {
              borderColor: error ? theme.palette.error.main : 'rgba(0, 0, 0, 0.87)',
            },
            '&:focus': {
              borderColor: error ? theme.palette.error.main : theme.palette.primary.main,
            },
            '&::placeholder': {
              color: theme.palette.text.disabled,
              opacity: 1,
            },
            '&:disabled': {
              backgroundColor: theme.palette.action.disabledBackground,
              color: theme.palette.action.disabled,
              cursor: 'not-allowed',
              borderColor: theme.palette.action.disabled,
            },
          },
        })}
      >
        <textarea
          ref={textareaRef}
          value={value}
          onChange={onChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          maxLength={maxLength}
          required={required}
          rows={minRows}
        />
      </Box>
      {helperText && (
        <Typography
          variant="caption"
          sx={{
            mt: 0.5,
            display: 'block',
            color: error ? 'error.main' : 'text.secondary',
          }}
        >
          {helperText}
        </Typography>
      )}
    </Box>
  );
};

export const CreateDealForm: React.FC<CreateDealFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
  isLoading = false,
}) => {
  const [formData, setFormData] = useState<DealFormData>({
    title: '',
    urlSlug: '',
    shortDescription: '',
    fullDescription: '',
    coverImageUrl: '',
    videoUrl: '',
    launchUrl: '',
    supportEmail: '',
    features: [],
    killsList: [],
    galleryImages: [],
    faqs: [],
    testimonials: [],
    usageStats: {
      activeUsers: '',
      totalSessions: '',
      averageRating: '',
    },
    oneTimePrice: '',
    setupFee: '',
    pricingModel: 'one_time',
    monthlySubscriptionPrice: '',
    annualSubscriptionPrice: '',
    listingType: 'marketplace_listing',
    subscriptionInterval: undefined,
    requiresSelfHosting: false,
    dealType: 'lifetime',
    category: '',
    tags: [],
    ...initialData,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [featureInput, setFeatureInput] = useState('');
  const [killInput, setKillInput] = useState('');
  const [galleryInput, setGalleryInput] = useState('');
  const [tagInput, setTagInput] = useState('');

  // Helper function to generate slug from title
  const generateSlug = (title: string): string => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  // Handle title change and auto-generate slug if needed
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;
    setFormData((prev) => {
      // Only auto-generate slug if urlSlug is empty or matches the previous title's slug
      const shouldAutoGenerate = !prev.urlSlug || prev.urlSlug === generateSlug(prev.title);
      const newUrlSlug = shouldAutoGenerate && !initialData?.urlSlug 
        ? generateSlug(newTitle) 
        : prev.urlSlug;
      return { ...prev, title: newTitle, urlSlug: newUrlSlug };
    });
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'App title is required';
    }
    if (!formData.urlSlug.trim()) {
      newErrors.urlSlug = 'URL slug is required';
    } else if (!/^[a-z0-9-]+$/.test(formData.urlSlug)) {
      newErrors.urlSlug = 'URL slug can only contain lowercase letters, numbers, and hyphens';
    }
    if (!formData.shortDescription.trim()) {
      newErrors.shortDescription = 'Short description is required';
    } else if (formData.shortDescription.length > 200) {
      newErrors.shortDescription = 'Short description must be 200 characters or less';
    }
    if (formData.fullDescription.length > 5000) {
      newErrors.fullDescription = 'Full description must be 5000 characters or less';
    }
    if (!formData.supportEmail.trim()) {
      newErrors.supportEmail = 'Support email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.supportEmail)) {
      newErrors.supportEmail = 'Please enter a valid email address';
    }
    if (formData.pricingModel === 'one_time' && !formData.oneTimePrice) {
      newErrors.oneTimePrice = 'Price is required';
    }
    if (formData.pricingModel === 'subscription') {
      if (!formData.monthlySubscriptionPrice && !formData.annualSubscriptionPrice) {
        newErrors.subscriptionPrices = 'At least one subscription price (monthly or annual) is required';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (status: 'draft' | 'pending_review') => {
    if (!validate()) {
      return;
    }
    await onSubmit(formData, status);
  };

  const addFeature = () => {
    if (featureInput.trim()) {
      setFormData((prev) => ({
        ...prev,
        features: [...prev.features, featureInput.trim()],
      }));
      setFeatureInput('');
    }
  };

  const removeFeature = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index),
    }));
  };

  const addKill = () => {
    if (killInput.trim()) {
      setFormData((prev) => ({
        ...prev,
        killsList: [...prev.killsList, killInput.trim()],
      }));
      setKillInput('');
    }
  };

  const removeKill = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      killsList: prev.killsList.filter((_, i) => i !== index),
    }));
  };

  const addGalleryImage = () => {
    if (galleryInput.trim()) {
      setFormData((prev) => ({
        ...prev,
        galleryImages: [...prev.galleryImages, galleryInput.trim()],
      }));
      setGalleryInput('');
    }
  };

  const updateGalleryImage = (index: number, value: string) => {
    const newImages = [...formData.galleryImages];
    newImages[index] = value;
    setFormData((prev) => ({ ...prev, galleryImages: newImages }));
  };

  const removeGalleryImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      galleryImages: prev.galleryImages.filter((_, i) => i !== index),
    }));
  };

  const addFAQ = () => {
    setFormData((prev) => ({
      ...prev,
      faqs: [...prev.faqs, { question: '', answer: '' }],
    }));
  };

  const updateFAQ = (index: number, field: 'question' | 'answer', value: string) => {
    setFormData((prev) => ({
      ...prev,
      faqs: prev.faqs.map((faq, i) => (i === index ? { ...faq, [field]: value } : faq)),
    }));
  };

  const removeFAQ = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      faqs: prev.faqs.filter((_, i) => i !== index),
    }));
  };

  const addTestimonial = () => {
    setFormData((prev) => ({
      ...prev,
      testimonials: [...prev.testimonials, { name: '', text: '', rating: 5 }],
    }));
  };

  const updateTestimonial = (index: number, field: 'name' | 'text' | 'rating', value: string | number) => {
    setFormData((prev) => ({
      ...prev,
      testimonials: prev.testimonials.map((testimonial, i) =>
        i === index ? { ...testimonial, [field]: value } : testimonial
      ),
    }));
  };

  const removeTestimonial = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      testimonials: prev.testimonials.filter((_, i) => i !== index),
    }));
  };

  const addTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData((prev) => ({ ...prev, tags: [...prev.tags, tagInput.trim()] }));
      setTagInput('');
    }
  };

  const removeTag = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((_, i) => i !== index),
    }));
  };

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', p: { xs: 2, md: 4 } }}>
      <Stack spacing={4}>
        {/* Status Indicator */}
        <Paper sx={{ p: 2, bgcolor: designTokens.colors.surface.elevated }}>
          <Stack direction="row" spacing={2} alignItems="center">
            <InfoIcon sx={{ color: designTokens.colors.action.primary }} />
            <Box>
              <Typography variant="body2" fontWeight={600}>
                Status: {initialData ? 'Editing' : 'Draft'}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {initialData
                  ? 'Update your deal information below'
                  : 'Save your progress as a draft, then submit for review when ready'}
              </Typography>
            </Box>
          </Stack>
        </Paper>

        {/* Section 1: Basic Information */}
        <Accordion defaultExpanded>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="h5" fontWeight={600}>
              Basic Information
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Core details about your app
            </Typography>
            <Stack spacing={3}>
                  <TextField
                    label="App Title"
                    value={formData.title}
                    onChange={handleTitleChange}
                    error={!!errors.title}
                    helperText={errors.title}
                    required
                    fullWidth
                  />
                  <TextField
                    label="URL Slug"
                    value={formData.urlSlug}
                    onChange={(e) => setFormData((prev) => ({ ...prev, urlSlug: e.target.value }))}
                    error={!!errors.urlSlug}
                    helperText={errors.urlSlug || 'Lowercase letters, numbers, and hyphens only'}
                    required
                    fullWidth
                  />
                  <AutoExpandingTextarea
                    label="Short Description"
                    value={formData.shortDescription}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setFormData((prev) => ({ ...prev, shortDescription: e.target.value }))}
                    error={!!errors.shortDescription}
                    helperText={errors.shortDescription || 'This appears in app listings (max 200 characters)'}
                    required
                    maxLength={200}
                    minRows={2}
                    maxRows={6}
                  />
                  <Box>
                    <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mt: 0.5 }}>
                      {formData.shortDescription.length} / 200
                    </Typography>
                  </Box>
                  <AutoExpandingTextarea
                    label="Full Description"
                    value={formData.fullDescription || ''}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setFormData((prev) => ({ ...prev, fullDescription: e.target.value }))}
                    error={!!errors.fullDescription}
                    helperText={errors.fullDescription || 'Full details shown on the app page (max 5000 characters)'}
                    maxLength={5000}
                    minRows={4}
                    maxRows={15}
                  />
                  <Box>
                    <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mt: 0.5 }}>
                      {formData.fullDescription.length} / 5000
                    </Typography>
                  </Box>
                </Stack>
          </AccordionDetails>
        </Accordion>

        {/* Section 2: Pricing Configuration */}
        <Accordion defaultExpanded>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="h5" fontWeight={600}>
              Pricing Configuration
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Set how users can purchase your app. Buyers will receive a validation code immediately after purchase.
            </Typography>
                <Stack spacing={3}>
                  <FormControl>
                    <FormLabel>Payment Model</FormLabel>
                    <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>
                      Choose how buyers pay for your app. This determines how long validation keys stay active.
                    </Typography>
                    <RadioGroup
                      value={formData.pricingModel}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          pricingModel: e.target.value as DealFormData['pricingModel'],
                          subscriptionInterval: undefined,
                          monthlySubscriptionPrice: '',
                          annualSubscriptionPrice: '',
                        }))
                      }
                    >
                      <FormControlLabel 
                        value="one_time" 
                        control={<Radio />} 
                        label={
                          <Box>
                            <Typography variant="body2">One-Time Payment</Typography>
                            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
                              Validation keys stay active forever
                            </Typography>
                          </Box>
                        } 
                      />
                      <FormControlLabel 
                        value="subscription" 
                        control={<Radio />} 
                        label={
                          <Box>
                            <Typography variant="body2">Subscription</Typography>
                            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
                              Validation keys stay active while subscription is active. You can offer monthly, annual, or both.
                            </Typography>
                          </Box>
                        } 
                      />
                    </RadioGroup>
                  </FormControl>

                  {formData.pricingModel === 'one_time' && (
                    <TextField
                      label="One-Time Purchase Price ($)"
                      type="number"
                      value={formData.oneTimePrice}
                      onChange={(e) => setFormData((prev) => ({ ...prev, oneTimePrice: e.target.value }))}
                      error={!!errors.oneTimePrice}
                      helperText={errors.oneTimePrice || 'One-time payment. Buyers receive a validation code that stays active forever.'}
                      fullWidth
                      inputProps={{ min: 0, step: 0.01 }}
                      required
                    />
                  )}

                  {formData.pricingModel === 'subscription' && (
                    <Stack spacing={2}>
                      <TextField
                        label="Monthly Subscription Price ($)"
                        type="number"
                        value={formData.monthlySubscriptionPrice}
                        onChange={(e) =>
                          setFormData((prev) => ({ ...prev, monthlySubscriptionPrice: e.target.value }))
                        }
                        error={!!errors.subscriptionPrices && !formData.monthlySubscriptionPrice && !formData.annualSubscriptionPrice}
                        helperText="Monthly recurring price. Leave blank if not offering monthly."
                        fullWidth
                        inputProps={{ min: 0, step: 0.01 }}
                      />
                      <TextField
                        label="Annual Subscription Price ($)"
                        type="number"
                        value={formData.annualSubscriptionPrice}
                        onChange={(e) =>
                          setFormData((prev) => ({ ...prev, annualSubscriptionPrice: e.target.value }))
                        }
                        error={!!errors.subscriptionPrices && !formData.monthlySubscriptionPrice && !formData.annualSubscriptionPrice}
                        helperText="Annual recurring price. Leave blank if not offering annual."
                        fullWidth
                        inputProps={{ min: 0, step: 0.01 }}
                      />
                    </Stack>
                  )}

                  <TextField
                    label="Setup Service Fee ($) - Optional"
                    type="number"
                    value={formData.setupFee}
                    onChange={(e) => setFormData((prev) => ({ ...prev, setupFee: e.target.value }))}
                    helperText="Optional fee for helping users set up the app on their own server (e.g., $50 for setup assistance)"
                    fullWidth
                    inputProps={{ min: 0, step: 0.01 }}
                  />
                </Stack>
          </AccordionDetails>
        </Accordion>

        {/* Section 3: Additional Details */}
        <Accordion defaultExpanded>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="h5" fontWeight={600}>
              Additional Details
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Media, features, content, and technical configuration
            </Typography>
            <Stack spacing={4}>
                  {/* Media & Resources */}
                  <Box>
                    <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                      Media & Resources
                    </Typography>
                    <Stack spacing={3}>
                      <TextField
                        label="Hero Banner Image (Optional)"
                        value={formData.coverImageUrl}
                        onChange={(e) => setFormData((prev) => ({ ...prev, coverImageUrl: e.target.value }))}
                        placeholder="https://example.com/image.jpg"
                        helperText="Upload or provide URL for main banner image (recommended: 1920x1080)"
                        fullWidth
                      />
                      <TextField
                        label="Video Overview URL (Optional)"
                        value={formData.videoUrl}
                        onChange={(e) => setFormData((prev) => ({ ...prev, videoUrl: e.target.value }))}
                        placeholder="https://www.youtube.com/watch?v=... or https://www.loom.com/share/..."
                        helperText="YouTube or Loom video showcasing your app"
                        fullWidth
                      />
                      <TextField
                        label="App Launch URL (Optional)"
                        value={formData.launchUrl}
                        onChange={(e) => setFormData((prev) => ({ ...prev, launchUrl: e.target.value }))}
                        placeholder="https://myapp.com"
                        helperText="Where users go when they launch your app"
                        fullWidth
                      />
                      <TextField
                        label="Support Email"
                        value={formData.supportEmail}
                        onChange={(e) => setFormData((prev) => ({ ...prev, supportEmail: e.target.value }))}
                        placeholder="support@example.com"
                        error={!!errors.supportEmail}
                        helperText={errors.supportEmail || 'Contact email for user support'}
                        required
                        fullWidth
                        type="email"
                      />
                    </Stack>
                  </Box>

                  <Box sx={{ height: '1px', bgcolor: 'divider' }} />

                  {/* Features & Benefits */}
                  <Box>
                    <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                      Features & Benefits
                    </Typography>
                    <Stack spacing={3}>
                      <Box>
                        <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
                          What&apos;s Included (Features)
                        </Typography>
                        <Typography variant="caption" color="text.secondary" sx={{ mb: 2, display: 'block' }}>
                          Enter each feature on a new line. These will appear with checkmarks on your app page.
                        </Typography>
                        <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
                          <TextField
                            value={featureInput}
                            onChange={(e) => setFeatureInput(e.target.value)}
                            onKeyPress={(e) => {
                              if (e.key === 'Enter') {
                                e.preventDefault();
                                addFeature();
                              }
                            }}
                            placeholder="Drag-and-drop builder"
                            fullWidth
                          />
                          <Button onClick={addFeature} variant="outlined" sx={{ minWidth: 100 }}>
                            Add
                          </Button>
                        </Stack>
                        <Stack direction="row" spacing={1} flexWrap="wrap" gap={1}>
                          {formData.features.map((feature, index) => (
                            <Tooltip key={index} title={feature} arrow>
                              <Chip
                                label={feature}
                                onDelete={() => removeFeature(index)}
                                sx={{ mb: 1, maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis' }}
                              />
                            </Tooltip>
                          ))}
                        </Stack>
                      </Box>
                      <Box>
                        <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
                          What it Kills (Death to SaaS)
                        </Typography>
                        <Typography variant="caption" color="text.secondary" sx={{ mb: 2, display: 'block' }}>
                          Enter each SaaS app this replaces, one per line. These will appear with a strikethrough on your app page.
                        </Typography>
                        <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
                          <TextField
                            value={killInput}
                            onChange={(e) => setKillInput(e.target.value)}
                            onKeyPress={(e) => {
                              if (e.key === 'Enter') {
                                e.preventDefault();
                                addKill();
                              }
                            }}
                            placeholder="Zapier"
                            fullWidth
                          />
                          <Button onClick={addKill} variant="outlined" sx={{ minWidth: 100 }}>
                            Add
                          </Button>
                        </Stack>
                        <Stack direction="row" spacing={1} flexWrap="wrap" gap={1}>
                          {formData.killsList.map((kill, index) => (
                            <Tooltip key={index} title={kill} arrow>
                              <Chip
                                label={kill}
                                onDelete={() => removeKill(index)}
                                sx={{ mb: 1, maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis' }}
                              />
                            </Tooltip>
                          ))}
                        </Stack>
                      </Box>
                    </Stack>
                  </Box>

                  <Box sx={{ height: '1px', bgcolor: 'divider' }} />

                  {/* Landing Page Content */}
                  <Box>
                    <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                      Landing Page Content
                    </Typography>
                    <Stack spacing={3}>
                      {/* Gallery Images */}
                      <Box>
                        <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
                          Gallery Images
                        </Typography>
                        <Typography variant="caption" color="text.secondary" sx={{ mb: 2, display: 'block' }}>
                          Add image URLs to showcase your app in action
                        </Typography>
                        <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
                          <TextField
                            value={galleryInput}
                            onChange={(e) => setGalleryInput(e.target.value)}
                            onKeyPress={(e) => {
                              if (e.key === 'Enter') {
                                e.preventDefault();
                                addGalleryImage();
                              }
                            }}
                            placeholder="https://example.com/image.jpg"
                            fullWidth
                          />
                          <Button onClick={addGalleryImage} variant="outlined" sx={{ minWidth: 100 }}>
                            Add
                          </Button>
                        </Stack>
                        <Stack spacing={1}>
                          {formData.galleryImages.map((url, index) => (
                            <Stack key={index} direction="row" spacing={1} alignItems="center">
                              <TextField
                                value={url}
                                onChange={(e) => updateGalleryImage(index, e.target.value)}
                                fullWidth
                                size="small"
                              />
                              <IconButton onClick={() => removeGalleryImage(index)} size="small" color="error">
                                <DeleteIcon />
                              </IconButton>
                            </Stack>
                          ))}
                        </Stack>
                      </Box>

                      {/* FAQs */}
                      <Box>
                        <Typography variant="body2" fontWeight={500} sx={{ mb: 1 }}>
                          Frequently Asked Questions
                        </Typography>
                        <Button onClick={addFAQ} startIcon={<AddIcon />} variant="outlined" size="small" sx={{ mb: 2 }}>
                          Add FAQ
                        </Button>
                        <Stack spacing={2}>
                          {formData.faqs.map((faq, index) => (
                            <Paper key={index} sx={{ p: 2 }}>
                              <Stack spacing={2}>
                                <Stack direction="row" justifyContent="space-between" alignItems="center">
                                  <Typography variant="caption" fontWeight={500}>
                                    FAQ #{index + 1}
                                  </Typography>
                                  <IconButton onClick={() => removeFAQ(index)} size="small" color="error">
                                    <DeleteIcon />
                                  </IconButton>
                                </Stack>
                                <TextField
                                  label="Question"
                                  value={faq.question}
                                  onChange={(e) => updateFAQ(index, 'question', e.target.value)}
                                  fullWidth
                                />
                                <MuiTextField
                                  label="Answer"
                                  value={faq.answer}
                                  onChange={(e) => updateFAQ(index, 'answer', e.target.value)}
                                  fullWidth
                                  multiline
                                  minRows={3}
                                  maxRows={10}
                                  variant="outlined"
                                  sx={{
                                    '& .MuiInputBase-root': {
                                      alignItems: 'flex-start',
                                    },
                                    '& textarea': {
                                      resize: 'vertical',
                                      overflowY: 'auto',
                                    },
                                  }}
                                />
                              </Stack>
                            </Paper>
                          ))}
                        </Stack>
                      </Box>

                      {/* Testimonials */}
                      <Box>
                        <Typography variant="body2" fontWeight={500} sx={{ mb: 1 }}>
                          Customer Testimonials
                        </Typography>
                        <Button onClick={addTestimonial} startIcon={<AddIcon />} variant="outlined" size="small" sx={{ mb: 2 }}>
                          Add Testimonial
                        </Button>
                        <Stack spacing={2}>
                          {formData.testimonials.map((testimonial, index) => (
                            <Paper key={index} sx={{ p: 2 }}>
                              <Stack spacing={2}>
                                <Stack direction="row" justifyContent="space-between" alignItems="center">
                                  <Typography variant="caption" fontWeight={500}>
                                    Testimonial #{index + 1}
                                  </Typography>
                                  <IconButton onClick={() => removeTestimonial(index)} size="small" color="error">
                                    <DeleteIcon />
                                  </IconButton>
                                </Stack>
                                <TextField
                                  label="Customer Name"
                                  value={testimonial.name}
                                  onChange={(e) => updateTestimonial(index, 'name', e.target.value)}
                                  fullWidth
                                />
                                <MuiTextField
                                  label="Testimonial Text"
                                  value={testimonial.text}
                                  onChange={(e) => updateTestimonial(index, 'text', e.target.value)}
                                  fullWidth
                                  multiline
                                  minRows={3}
                                  maxRows={10}
                                  variant="outlined"
                                  sx={{
                                    '& .MuiInputBase-root': {
                                      alignItems: 'flex-start',
                                    },
                                    '& textarea': {
                                      resize: 'vertical',
                                      overflowY: 'auto',
                                    },
                                  }}
                                />
                                <TextField
                                  label="Rating (1-5)"
                                  type="number"
                                  value={testimonial.rating}
                                  onChange={(e) => updateTestimonial(index, 'rating', parseInt(e.target.value) || 5)}
                                  inputProps={{ min: 1, max: 5, step: 1 }}
                                  fullWidth
                                />
                              </Stack>
                            </Paper>
                          ))}
                        </Stack>
                      </Box>

                      {/* Usage Statistics */}
                      <Box>
                        <Typography variant="body2" sx={{ mb: 2, fontWeight: 500 }}>
                          Usage Statistics
                        </Typography>
                        <Typography variant="caption" color="text.secondary" sx={{ mb: 2, display: 'block' }}>
                          Display social proof metrics on your landing page
                        </Typography>
                        <Stack spacing={2}>
                          <TextField
                            label="Active Users"
                            value={formData.usageStats.activeUsers}
                            onChange={(e) =>
                              setFormData((prev) => ({
                                ...prev,
                                usageStats: { ...prev.usageStats, activeUsers: e.target.value },
                              }))
                            }
                            placeholder="1,000+"
                            helperText="Display format (e.g., '1,000+', '5K+', '10,000+')"
                            fullWidth
                          />
                          <TextField
                            label="Total Sessions"
                            value={formData.usageStats.totalSessions}
                            onChange={(e) =>
                              setFormData((prev) => ({
                                ...prev,
                                usageStats: { ...prev.usageStats, totalSessions: e.target.value },
                              }))
                            }
                            placeholder="50,000+"
                            helperText="Display format (e.g., '50,000+', '100K+')"
                            fullWidth
                          />
                          <TextField
                            label="Average Rating"
                            value={formData.usageStats.averageRating}
                            onChange={(e) =>
                              setFormData((prev) => ({
                                ...prev,
                                usageStats: { ...prev.usageStats, averageRating: e.target.value },
                              }))
                            }
                            placeholder="5.0/5.0"
                            helperText="Display format (e.g., '5.0/5.0', '4.8/5.0')"
                            fullWidth
                          />
                        </Stack>
                      </Box>
                    </Stack>
                  </Box>

                  <Box sx={{ height: '1px', bgcolor: 'divider' }} />

                  {/* Categorization */}
                  <Box>
                    <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                      Categorization
                    </Typography>
                    <Stack spacing={3}>
                      <TextField
                        label="Category (Optional)"
                        value={formData.category}
                        onChange={(e) => setFormData((prev) => ({ ...prev, category: e.target.value }))}
                        placeholder="e.g., Productivity, Development, Analytics"
                        helperText="Category helps buyers find your app"
                        fullWidth
                      />
                      <Box>
                        <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
                          Tags (Optional)
                        </Typography>
                        <Typography variant="caption" color="text.secondary" sx={{ mb: 2, display: 'block' }}>
                          Add tags to help buyers discover your app
                        </Typography>
                        <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
                          <TextField
                            value={tagInput}
                            onChange={(e) => setTagInput(e.target.value)}
                            onKeyPress={(e) => {
                              if (e.key === 'Enter') {
                                e.preventDefault();
                                addTag();
                              }
                            }}
                            placeholder="Enter tag and press Enter"
                            fullWidth
                          />
                          <Button 
                            onClick={addTag} 
                            variant="outlined" 
                            sx={{ minWidth: 100 }}
                          >
                            Add Tag
                          </Button>
                        </Stack>
                        <Stack direction="row" spacing={1} flexWrap="wrap" gap={1}>
                          {formData.tags.map((tag, index) => (
                            <Tooltip key={index} title={tag} arrow>
                              <Chip
                                label={tag}
                                onDelete={() => removeTag(index)}
                                sx={{ mb: 1, maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis' }}
                              />
                            </Tooltip>
                          ))}
                        </Stack>
                      </Box>
                    </Stack>
                  </Box>

                  <Box sx={{ height: '1px', bgcolor: 'divider' }} />

                  {/* Technical Configuration */}
                  <Box>
                    <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                      Technical Configuration
                    </Typography>
                    <Stack spacing={2}>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={formData.requiresSelfHosting}
                            onChange={(e) =>
                              setFormData((prev) => ({ ...prev, requiresSelfHosting: e.target.checked }))
                            }
                          />
                        }
                        label="Requires Self-Hosting"
                      />
                      <Typography variant="caption" color="text.secondary">
                        Users download files instead of accessing a hosted app
                      </Typography>
                    </Stack>
                  </Box>
                </Stack>
          </AccordionDetails>
        </Accordion>

        {/* Form Actions */}
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="flex-end">
          <Button onClick={onCancel} variant="outlined" disabled={isLoading} fullWidth={true} sx={{ xs: { width: '100%' } }}>
            Cancel
          </Button>
          <Button
            onClick={() => handleSubmit('draft')}
            variant="outlined"
            disabled={isLoading}
            fullWidth={true}
            sx={{ xs: { width: '100%' } }}
          >
            Save as Draft
          </Button>
          <Button
            onClick={() => handleSubmit('pending_review')}
            variant="contained"
            disabled={isLoading}
            fullWidth={true}
            sx={{ xs: { width: '100%' } }}
          >
            Submit for Review
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
};

