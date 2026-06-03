import { TemplateContent } from "@/lib/templates";
import { SchemaParams } from "@/components/templateBuilder/types";

export const formTemplateConfig = {
  navbar: "minimal",
  hero: "centered",
  footer: "centered",
  sections: [
    {
      id: "form_main",
      type: "form",
      variant: "default",
      enabled: true,
      anchorName: "form",
    },
  ],
} as const;

const starterContent = ({ selectedTitle = "Quick Form" }: SchemaParams) => ({
  builderConfig: formTemplateConfig,
  navbar: {
    logo: "Q",
    title: selectedTitle,
    ctaButton: "Open Form",
    ctaButtonLink: { type: "anchor", anchorId: "form" },
    links: [{ label: "Form", type: "anchor", anchor: "form", href: "" }],
  },
  hero: {
    badge: "Now accepting responses",
    title: selectedTitle,
    desc: "Create a simple public form for enquiries, registrations, orders, bookings, and feedback.",
    primaryButton: "Fill the Form",
    primaryButtonLink: { type: "anchor", anchorId: "form" },
    secondaryButton: "",
    secondaryButtonLink: {},
  },
  form_main: {
    title: "Quick Form",
    desc: "Please complete the fields below. Your response will be sent directly to the site owner.",
    buttonLabel: "Submit Response",
    successMessage: "Thanks! Your response has been submitted.",
    fields: [
      {
        id: "name",
        label: "Full name",
        type: "text",
        required: true,
        placeholder: "Enter your full name",
      },
      {
        id: "email",
        label: "Email address",
        type: "email",
        required: true,
        placeholder: "you@example.com",
      },
      {
        id: "phone",
        label: "Phone number",
        type: "phone",
        required: false,
        placeholder: "Your phone number",
      },
      {
        id: "category",
        label: "Response type",
        type: "radio",
        required: true,
        options: ["Inquiry", "Registration", "Booking", "Feedback"],
      },
      {
        id: "details",
        label: "Details",
        type: "textarea",
        required: true,
        placeholder: "Write your response here...",
      },
    ],
  },
  footer: {
    brand: selectedTitle,
    copyright: `(c) ${new Date().getFullYear()} ${selectedTitle}. All rights reserved.`,
    socials: [],
  },
});

const formTemplate: TemplateContent = {
  meta: {
    title: "Quick Form",
    image: "/ti/form.png",
    category: "forms",
    description:
      "A Google Forms-style page for collecting registrations, bookings, orders, feedback, and custom responses through your dashboard inbox.",
  },
  config: {
    type: "form",
    theme: "light",
    hasCustomizeSidebar: true,
    isPremium: false,
  },
  contentConfig: formTemplateConfig,
  starterContent,
};

export default formTemplate;
