'use client';

import React, { useState } from 'react';
import {
  Calendar as CalendarIcon,
  Send,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import { format } from 'date-fns';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { api } from '@/lib/api';

interface CateringInquiryFormProps {
  selectedService?: string;
  selectedEventType?: string;
}

export function CateringInquiryForm({
  selectedService,
  selectedEventType,
}: CateringInquiryFormProps) {
  const [clientName, setClientName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [eventType, setEventType] = useState(selectedEventType || 'Wedding');
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [eventDate, setEventDate] = useState('');
  const [venueLocation, setVenueLocation] = useState('');
  const [venuePostcode, setVenuePostcode] = useState('');
  const [guestCount, setGuestCount] = useState<number | ''>(50);
  const [services, setServices] = useState<string[]>(
    selectedService ? [selectedService] : ['Grazing Table']
  );
  const [budgetRange, setBudgetRange] = useState('£1,500 - £3,000');
  const [dietaryNotes, setDietaryNotes] = useState('');
  const [stylingNotes, setStylingNotes] = useState('');

  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Sync when prop updates from parent buttons
  React.useEffect(() => {
    if (selectedService && !services.includes(selectedService)) {
      setServices((prev) => [...prev, selectedService]);
    }
  }, [selectedService]);

  React.useEffect(() => {
    if (selectedEventType) {
      setEventType(selectedEventType);
    }
  }, [selectedEventType]);

  const toggleService = (svc: string) => {
    if (services.includes(svc)) {
      setServices(services.filter((s) => s !== svc));
    } else {
      setServices([...services, svc]);
    }
  };

  const minSelectableDate = new Date();
  minSelectableDate.setHours(0, 0, 0, 0);
  minSelectableDate.setDate(minSelectableDate.getDate() + 2);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    if (!eventDate) {
      setError('Please select your event date.');
      setSubmitting(false);
      return;
    }

    try {
      await api.post('/catering/inquire', {
        clientName,
        clientEmail,
        clientPhone,
        eventType,
        eventDate,
        venueLocation,
        venuePostcode,
        guestCount: Number(guestCount) || 1,
        services,
        budgetRange,
        dietaryNotes,
        stylingNotes,
      });

      setSubmitted(true);
    } catch (err: any) {
      setError(err?.message || 'Failed to submit catering inquiry. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section
      id="inquiry-form"
      className="py-20 lg:py-28 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto border-b border-gray-200/80 dark:border-white/10"
    >
      <div className="text-center space-y-5 mb-16 lg:mb-20">
        <span className="text-xs font-bold uppercase tracking-widest text-orange-600 dark:text-orange-400">
          Start Your Celebration
        </span>
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 dark:text-white leading-tight">
          Request a Bespoke Catering Quote
        </h2>
        <p className="text-base text-gray-600 dark:text-gray-400 max-w-xl mx-auto leading-relaxed">
          Share your event details below. Minimum 48 hours notice required for all catering orders. For weddings &amp; large galas, please book 2–4 weeks ahead.
        </p>
      </div>

      <Card className="rounded-2xl border border-gray-200/80 dark:border-white/10 bg-white dark:bg-gray-900/60 p-6 sm:p-10 shadow-none">
        {submitted ? (
          <div className="text-center py-12 space-y-5 animate-in fade-in">
            <div className="w-16 h-16 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <div className="space-y-2">
              <h3 className="text-2xl font-extrabold text-gray-900 dark:text-white">
                Inquiry Received Successfully!
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-300 max-w-md mx-auto">
                Thank you, <strong>{clientName}</strong>! We have sent a confirmation email to <strong>{clientEmail}</strong>. Chef Bee is reviewing your vision and will get back to you shortly.
              </p>
            </div>
            <div className="pt-2">
              <Button
                type="button"
                onClick={() => {
                  setSubmitted(false);
                  setClientName('');
                  setClientEmail('');
                  setClientPhone('');
                  setSelectedDate(undefined);
                  setEventDate('');
                  setVenueLocation('');
                  setVenuePostcode('');
                }}
                className="text-xs px-6 h-10 cursor-pointer"
              >
                Submit Another Request
              </Button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-4 rounded-md bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 flex items-center gap-3 text-xs text-red-800 dark:text-red-300 animate-in fade-in">
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                <p className="font-semibold">{error}</p>
              </div>
            )}

            {/* Section 1: Contact Details */}
            <div className="space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500 border-b border-gray-100 dark:border-white/10 pb-2">
                1. Your Contact Information
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="client-name" className="text-xs font-semibold">
                    Full Name *
                  </Label>
                  <Input
                    id="client-name"
                    type="text"
                    required
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    placeholder="e.g. Amina Adeleke"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="client-email" className="text-xs font-semibold">
                    Email Address *
                  </Label>
                  <Input
                    id="client-email"
                    type="email"
                    required
                    value={clientEmail}
                    onChange={(e) => setClientEmail(e.target.value)}
                    placeholder="e.g. amina@example.com"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="client-phone" className="text-xs font-semibold">
                    Phone Number *
                  </Label>
                  <Input
                    id="client-phone"
                    type="tel"
                    required
                    value={clientPhone}
                    onChange={(e) => setClientPhone(e.target.value)}
                    placeholder="+44 7123 456789"
                  />
                </div>
              </div>
            </div>

            {/* Section 2: Event Specifics */}
            <div className="space-y-4 pt-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500 border-b border-gray-100 dark:border-white/10 pb-2">
                2. Event Details
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="event-type" className="text-xs font-semibold">
                    Event Type *
                  </Label>
                  <Select
                    id="event-type"
                    size="md"
                    value={eventType}
                    onChange={(e) => setEventType(e.target.value)}
                  >
                    <option value="Wedding">Wedding / Traditional Engagement</option>
                    <option value="Corporate Event">Corporate Gala / Office Event</option>
                    <option value="Intimate Gathering">Intimate Gathering / Dinner Party</option>
                    <option value="Birthday Celebration">Birthday Celebration</option>
                    <option value="Baby Shower">Baby Shower / Bridal Shower</option>
                    <option value="Eid / Religious Celebration">Eid / Religious Feast</option>
                    <option value="Other">Other Occasion</option>
                  </Select>
                </div>

                {/* Event Date using Shadcn Popover & Calendar */}
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold">
                    Event Date *
                  </Label>
                  <Popover>
                    <PopoverTrigger
                      type="button"
                      className={cn(
                        'w-full flex items-center justify-between px-3 py-2 text-xs rounded border border-gray-200 dark:border-white/15 bg-white dark:bg-gray-900 text-left cursor-pointer h-9',
                        !selectedDate && 'text-gray-400'
                      )}
                    >
                      <span className="flex items-center gap-2">
                        <CalendarIcon className="w-3.5 h-3.5 text-orange-600 shrink-0" />
                        {selectedDate ? (
                          <span className="text-gray-900 dark:text-white font-medium">
                            {format(selectedDate, 'PPP')}
                          </span>
                        ) : (
                          <span>Select event date</span>
                        )}
                      </span>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-2" align="start">
                      <Calendar
                        mode="single"
                        selected={selectedDate}
                        onSelect={(date) => {
                          setSelectedDate(date);
                          if (date) {
                            setEventDate(format(date, 'yyyy-MM-dd'));
                          } else {
                            setEventDate('');
                          }
                        }}
                        disabled={(date) => date < minSelectableDate}
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="guest-count" className="text-xs font-semibold">
                    Estimated Guest Count *
                  </Label>
                  <Input
                    id="guest-count"
                    type="number"
                    min="5"
                    max="1000"
                    required
                    value={guestCount}
                    onChange={(e) => setGuestCount(e.target.value === '' ? '' : Number(e.target.value))}
                    placeholder="e.g. 75"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="venue-location" className="text-xs font-semibold">
                    Venue Name / City *
                  </Label>
                  <Input
                    id="venue-location"
                    type="text"
                    required
                    value={venueLocation}
                    onChange={(e) => setVenueLocation(e.target.value)}
                    placeholder="e.g. Private Residence, Greenwich / The Savoy"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="venue-postcode" className="text-xs font-semibold">
                    Venue Postcode (Optional)
                  </Label>
                  <Input
                    id="venue-postcode"
                    type="text"
                    value={venuePostcode}
                    onChange={(e) => setVenuePostcode(e.target.value.toUpperCase())}
                    placeholder="e.g. SE10 9NN"
                  />
                </div>
              </div>
            </div>

            {/* Section 3: Services & Budget */}
            <div className="space-y-4 pt-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500 border-b border-gray-100 dark:border-white/10 pb-2">
                3. Services &amp; Budget
              </h3>

              <div className="space-y-2">
                <Label className="text-xs font-semibold block">
                  Select Desired Services (Select all that apply)
                </Label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {[
                    'Grazing Table',
                    'Canapés',
                    'Mobile Bar',
                    'Food Bowls',
                    'Full Waitstaff',
                    'Dessert Styling',
                  ].map((svc) => (
                    <button
                      key={svc}
                      type="button"
                      onClick={() => toggleService(svc)}
                      className={`p-3 rounded border text-left text-xs font-semibold transition-all cursor-pointer flex items-center justify-between ${
                        services.includes(svc)
                          ? 'border-orange-500 bg-orange-50/70 dark:bg-orange-950/30 text-orange-900 dark:text-orange-200'
                          : 'border-gray-200 dark:border-white/10 bg-gray-50/50 dark:bg-gray-800/30 text-gray-700 dark:text-gray-300 hover:border-gray-300'
                      }`}
                    >
                      <span>{svc}</span>
                      {services.includes(svc) && (
                        <CheckCircle2 className="w-3.5 h-3.5 text-orange-600 dark:text-orange-400" />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1.5 pt-1">
                <Label htmlFor="budget-range" className="text-xs font-semibold">
                  Estimated Total Budget Range
                </Label>
                <Select
                  id="budget-range"
                  size="md"
                  value={budgetRange}
                  onChange={(e) => setBudgetRange(e.target.value)}
                >
                  <option value="Under £1,000">Under £1,000</option>
                  <option value="£1,000 - £2,500">£1,000 – £2,500</option>
                  <option value="£2,500 - £5,000">£2,500 – £5,000</option>
                  <option value="£5,000 - £10,000">£5,000 – £10,000</option>
                  <option value="£10,000+">£10,000+</option>
                </Select>
              </div>
            </div>

            {/* Section 4: Notes */}
            <div className="space-y-4 pt-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500 border-b border-gray-100 dark:border-white/10 pb-2">
                4. Dietary &amp; Styling Preferences
              </h3>

              <div className="space-y-1.5">
                <Label htmlFor="dietary-notes" className="text-xs font-semibold">
                  Dietary Requirements &amp; Allergies (100% Halal is standard)
                </Label>
                <Input
                  id="dietary-notes"
                  type="text"
                  value={dietaryNotes}
                  onChange={(e) => setDietaryNotes(e.target.value)}
                  placeholder="e.g. 4 vegetarian guests, 2 nut allergies"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="styling-notes" className="text-xs font-semibold">
                  Event Theme, Color Scheme &amp; Styling Notes
                </Label>
                <textarea
                  id="styling-notes"
                  rows={3}
                  value={stylingNotes}
                  onChange={(e) => setStylingNotes(e.target.value)}
                  placeholder="Tell us about your event colors, favorite flowers, or specific dishes you would like included..."
                  className="w-full rounded border border-gray-200 dark:border-white/15 bg-white dark:bg-gray-900 px-3 py-2 text-xs text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-4 border-t border-gray-100 dark:border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-[11px] text-gray-500 dark:text-gray-400">
                🔒 Your details are kept confidential. We will never share your event information.
              </p>
              <Button
                type="submit"
                disabled={submitting}
                className="w-full sm:w-auto text-xs px-8 h-10 cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {submitting ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Submitting Inquiry...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" />
                    <span>Submit Catering Inquiry</span>
                  </>
                )}
              </Button>
            </div>
          </form>
        )}
      </Card>
    </section>
  );
}
