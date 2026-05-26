/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
// Define the useFormSubmit hook here, calling /api/messages
export default function useFormSubmit() {
  return async ({
    formData,
    setFormData,
    setSubmitting,
    setSubmitSuccess,
    setSubmitError,
    siteSlug,
    anchorName,
  }: {
    formData: { name: string; email: string; message: string };
    setFormData: React.Dispatch<
      React.SetStateAction<{ name: string; email: string; message: string }>
    >;
    setSubmitting: React.Dispatch<React.SetStateAction<boolean>>;
    setSubmitSuccess: React.Dispatch<React.SetStateAction<boolean>>;
    setSubmitError: React.Dispatch<React.SetStateAction<string | null>>;
    siteSlug?: string;
    anchorName?: string;
  }) => {
    setSubmitting(true);
    setSubmitError(null);
    setSubmitSuccess(false);

    // Basic error proofing
    try {
      // Validate form fields before submitting
      if (
        !formData ||
        typeof formData !== "object" ||
        typeof formData.name !== "string" ||
        typeof formData.email !== "string" ||
        typeof formData.message !== "string"
      ) {
        setSubmitError("Invalid form data.");
        return;
      }

      // Additional checks: message must not be empty, and be a reasonable length
      const trimmedMessage = formData.message.trim();
      if (!trimmedMessage) {
        setSubmitError("Message is required.");
        return;
      }
      if (trimmedMessage.length > 2000) {
        setSubmitError("Message must be no more than 2000 characters.");
        return;
      }
      // Optional: check name/email
      if (!formData.name.trim()) {
        setSubmitError("Name is required.");
        return;
      }
      if (!formData.email.trim()) {
        setSubmitError("Email is required.");
        return;
      }
      // Very basic email format check
      if (
        !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(formData.email.trim())
      ) {
        setSubmitError("Please provide a valid email address.");
        return;
      }

      // Prepare the payload, only including required keys
      const payload: any = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        message: trimmedMessage,
      };
      // Send slugs/anchorName as required by API contract
      if (siteSlug) payload.siteSlug = siteSlug;
      if (anchorName) payload.anchorName = anchorName;

      let res: Response;
      try {
        res = await fetch("/api/messages", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      } catch (netErr) {
        setSubmitError(
          "Network error: Could not connect to server. Please try again later.",
        );
        return;
      }

      let responseBody: any = undefined;
      let isJSON = false;
      try {
        // Content-Type check for robust error parsing
        const contentType = res.headers.get("content-type") || "";
        if (contentType.includes("application/json")) {
          responseBody = await res.json();
          isJSON = true;
        } else {
          // fallback to text if not JSON
          responseBody = await res.text();
        }
      } catch {
        // swallow, keep responseBody as is
      }

      if (!res.ok) {
        let errorMsg = "Request failed";
        if (isJSON && responseBody && typeof responseBody.error === "string") {
          errorMsg = responseBody.error;
        } else if (typeof responseBody === "string" && responseBody) {
          errorMsg = responseBody;
        }
        setSubmitError(errorMsg);
        return;
      }

      setFormData({ name: "", email: "", message: "" });
      setSubmitSuccess(true);
    } catch (res: any) {
      const msg = res.error;
      setSubmitError(msg);
    } finally {
      setSubmitting(false);
    }
  };
}
