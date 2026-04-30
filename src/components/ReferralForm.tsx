import { useState } from "react";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/i18n/LanguageContext";
import { CheckCircle2, Gift } from "lucide-react";

const referralSchema = z.object({
  referrer_name: z.string().trim().min(1).max(100),
  referrer_email: z.string().trim().email().max(255),
  referred_name: z.string().trim().min(1).max(100),
  referred_email: z.string().trim().email().max(255),
  referred_phone: z.string().trim().min(4).max(50),
});

interface ReferralFormProps {
  variant?: "section" | "page";
}

const ReferralForm = ({ variant = "section" }: ReferralFormProps) => {
  const { t, language } = useLanguage();
  const { toast } = useToast();
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [form, setForm] = useState({
    referrer_name: "",
    referrer_email: "",
    referred_name: "",
    referred_email: "",
    referred_phone: "",
  });
  const [consent, setConsent] = useState(false);
  const [privacy, setPrivacy] = useState(false);

  const update = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm({ ...form, [k]: e.target.value });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const parsed = referralSchema.safeParse(form);
    if (!parsed.success) {
      toast({
        title: t.referral.errorMessage,
        description: Object.values(parsed.error.flatten().fieldErrors).flat().join(" · "),
        variant: "destructive",
      });
      return;
    }
    if (!consent || !privacy) {
      toast({ title: t.referral.errorMessage, variant: "destructive" });
      return;
    }

    setSubmitting(true);
    try {
      const id = crypto.randomUUID();
      const { error: insertError } = await supabase.from("referrals").insert({
        id,
        referrer_name: parsed.data.referrer_name,
        referrer_email: parsed.data.referrer_email,
        referred_name: parsed.data.referred_name,
        referred_email: parsed.data.referred_email,
        referred_phone: parsed.data.referred_phone,
        consent_confirmed: consent,
        status: "new",
        metadata: { language, source: variant },
      });
      if (insertError) throw insertError;

      const { error: emailError } = await supabase.functions.invoke("send-transactional-email", {
        body: {
          templateName: "referral-notification",
          recipientEmail: "wohnmobil.berlin@gmx.de",
          idempotencyKey: `referral-${id}`,
          templateData: {
            referrerName: parsed.data.referrer_name,
            referrerEmail: parsed.data.referrer_email,
            referredName: parsed.data.referred_name,
            referredEmail: parsed.data.referred_email,
            referredPhone: parsed.data.referred_phone,
            language: language.toUpperCase(),
            submittedAt: new Date().toLocaleString("de-DE"),
          },
        },
      });
      if (emailError) {
        // Log but don't fail UX – the row is already saved
        console.error("Email-Benachrichtigung fehlgeschlagen:", emailError);
      }

      setSuccess(true);
      setForm({
        referrer_name: "",
        referrer_email: "",
        referred_name: "",
        referred_email: "",
        referred_phone: "",
      });
      setConsent(false);
      setPrivacy(false);
    } catch (err) {
      console.error("Empfehlung konnte nicht gesendet werden:", err);
      toast({ title: t.referral.errorMessage, variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <Card className="bg-surface-2 border-primary/30 p-8 md:p-10 text-center">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-primary/10 mb-4">
          <CheckCircle2 className="w-8 h-8 text-primary" />
        </div>
        <h3 className="font-display font-bold text-xl md:text-2xl mb-3">
          {t.referral.successTitle}
        </h3>
        <p className="text-muted-foreground leading-relaxed max-w-xl mx-auto">
          {t.referral.successText}
        </p>
        <Button
          variant="outline"
          className="mt-6"
          onClick={() => setSuccess(false)}
        >
          OK
        </Button>
      </Card>
    );
  }

  return (
    <Card className="bg-surface-2 border-border/30 p-6 md:p-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-primary/10">
          <Gift className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h3 className="font-display font-bold text-lg md:text-xl">{t.referral.formTitle}</h3>
          <p className="text-xs text-muted-foreground">{t.referral.formSubtitle}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Eigene Daten */}
        <div className="space-y-4">
          <p className="text-sm font-semibold text-foreground uppercase tracking-wide">
            {t.referral.yourData}
          </p>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="referrer_name">{t.referral.referrerName}</Label>
              <Input
                id="referrer_name"
                value={form.referrer_name}
                onChange={update("referrer_name")}
                maxLength={100}
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="referrer_email">{t.referral.referrerEmail}</Label>
              <Input
                id="referrer_email"
                type="email"
                value={form.referrer_email}
                onChange={update("referrer_email")}
                maxLength={255}
                required
              />
              <p className="text-xs text-muted-foreground">{t.referral.referrerEmailHint}</p>
            </div>
          </div>
        </div>

        {/* Empfohlene Person */}
        <div className="space-y-4 pt-2 border-t border-border/20">
          <p className="text-sm font-semibold text-foreground uppercase tracking-wide pt-4">
            {t.referral.referredData}
          </p>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="referred_name">{t.referral.referredName}</Label>
              <Input
                id="referred_name"
                value={form.referred_name}
                onChange={update("referred_name")}
                maxLength={100}
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="referred_email">{t.referral.referredEmail}</Label>
              <Input
                id="referred_email"
                type="email"
                value={form.referred_email}
                onChange={update("referred_email")}
                maxLength={255}
                required
              />
            </div>
            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor="referred_phone">{t.referral.referredPhone}</Label>
              <Input
                id="referred_phone"
                type="tel"
                value={form.referred_phone}
                onChange={update("referred_phone")}
                maxLength={50}
                required
              />
            </div>
          </div>
        </div>

        {/* Consent */}
        <div className="space-y-3 pt-2 border-t border-border/20">
          <label className="flex items-start gap-3 cursor-pointer text-sm leading-relaxed pt-4">
            <Checkbox
              className="mt-0.5"
              checked={consent}
              onCheckedChange={(c) => setConsent(c === true)}
            />
            <span className="text-muted-foreground">{t.referral.consentLabel}</span>
          </label>
          <label className="flex items-start gap-3 cursor-pointer text-sm leading-relaxed">
            <Checkbox
              className="mt-0.5"
              checked={privacy}
              onCheckedChange={(c) => setPrivacy(c === true)}
            />
            <span className="text-muted-foreground">{t.referral.privacyLabel}</span>
          </label>
        </div>

        <p className="text-xs text-muted-foreground italic">{t.referral.payoutNote}</p>

        <Button
          type="submit"
          size="lg"
          className="w-full"
          disabled={submitting || !consent || !privacy}
        >
          {submitting ? t.referral.submitting : t.referral.submit}
        </Button>
      </form>
    </Card>
  );
};

export default ReferralForm;
